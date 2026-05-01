const admin = require('firebase-admin');
const { onRequest, HttpsError } = require('firebase-functions/v2/https');
const {
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentWritten,
} = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { setGlobalOptions } = require('firebase-functions/v2/options');

const appOptions = process.env.FIREBASE_DATABASE_URL
  ? { databaseURL: process.env.FIREBASE_DATABASE_URL }
  : undefined;

admin.initializeApp(appOptions);
setGlobalOptions({ region: 'asia-south1', maxInstances: 10 });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const Timestamp = admin.firestore.Timestamp;

const UPI_ID = process.env.UPI_ID || 'anwarulhaquekhan619@oksbi';
const STORE_NAME = process.env.STORE_NAME || 'Hot Wheels Store';

const ROLE_PERMISSIONS = {
  superadmin: {
    viewAnalytics: true,
    manageOrders: true,
    manageProducts: true,
    manageUsers: true,
    manageAdmins: true,
    manageDiscounts: true,
    exportData: true,
  },
  manager: {
    viewAnalytics: true,
    manageOrders: true,
    manageProducts: true,
    manageUsers: true,
    manageAdmins: false,
    manageDiscounts: true,
    exportData: true,
  },
  editor: {
    viewAnalytics: false,
    manageOrders: false,
    manageProducts: true,
    manageUsers: false,
    manageAdmins: false,
    manageDiscounts: false,
    exportData: false,
  },
  viewer: {
    viewAnalytics: true,
    manageOrders: false,
    manageProducts: false,
    manageUsers: false,
    manageAdmins: false,
    manageDiscounts: false,
    exportData: false,
  },
};

function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

function roundMoney(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function json(res, status, payload) {
  res.status(status).json(payload);
}

function assertMethod(req, res, method = 'POST') {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.status(204).send('');
    return false;
  }

  if (req.method !== method) {
    json(res, 405, { error: `Use ${method}` });
    return false;
  }

  return true;
}

async function getRequestAuth(req) {
  const header = req.get('authorization') || '';
  if (!header.startsWith('Bearer ')) return null;

  try {
    return await admin.auth().verifyIdToken(header.slice('Bearer '.length));
  } catch (error) {
    return null;
  }
}

async function checkRateLimit(key, functionName, limit, windowSeconds = 60) {
  const safeKey = String(key || 'anonymous').replace(/[.#$/[\]]/g, '_');
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const expiresAt = Date.now() + windowSeconds * 1000;

  if (process.env.FIREBASE_DATABASE_URL) {
    const ref = admin.database().ref(`rateLimits/${safeKey}/${functionName}/${bucket}`);
    const result = await ref.transaction((current) => ({
      count: (current && current.count ? current.count : 0) + 1,
      expiresAt,
    }));
    const count = result.snapshot.val().count;

    if (count > limit) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Try again shortly.');
    }

    return;
  }

  const docRef = db.collection('rateLimits').doc(`${safeKey}_${functionName}_${bucket}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef);
    const count = (snap.exists ? snap.data().count || 0 : 0) + 1;
    tx.set(docRef, { count, expiresAt: Timestamp.fromMillis(expiresAt) }, { merge: true });

    if (count > limit) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Try again shortly.');
    }
  });
}

function calculateDiscount(promo, cartTotal) {
  const value = Number(promo.value || 0);
  const maxDiscountAmount = Number(promo.maxDiscountAmount || 0);

  if (promo.type === 'percentage') {
    const raw = cartTotal * (value / 100);
    return roundMoney(maxDiscountAmount > 0 ? Math.min(raw, maxDiscountAmount) : raw);
  }

  return roundMoney(Math.min(value, cartTotal));
}

async function validatePromoCore({ code, cartTotal, userId, productIds = [], series = [], consume = false }) {
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return { valid: false, message: 'Enter a promo code' };
  }

  const promoRef = db.collection('promoCodes').doc(normalizedCode);
  const now = Timestamp.now();
  let response = { valid: false, message: 'Invalid promo code' };

  await db.runTransaction(async (tx) => {
    const promoSnap = await tx.get(promoRef);

    if (!promoSnap.exists) {
      response = { valid: false, message: 'Code not found' };
      return;
    }

    const promo = promoSnap.data();
    const start = promo.startDate;
    const end = promo.endDate;
    const usedCount = Number(promo.usedCount || 0);
    const usageLimit = Number(promo.usageLimit || 0);
    const minOrderValue = Number(promo.minOrderValue || 0);
    const applicableProducts = promo.applicableProducts || [];
    const applicableSeries = promo.applicableSeries || [];

    if (!promo.active) {
      response = { valid: false, message: 'Code is inactive' };
      return;
    }

    if ((start && start.toMillis() > now.toMillis()) || (end && end.toMillis() < now.toMillis())) {
      response = { valid: false, message: 'Code expired or not started yet' };
      return;
    }

    if (usageLimit > 0 && usedCount >= usageLimit) {
      response = { valid: false, message: 'Code usage limit reached' };
      return;
    }

    if (cartTotal < minOrderValue) {
      response = { valid: false, message: `Minimum order value is INR ${minOrderValue}` };
      return;
    }

    if (
      applicableProducts.length > 0 &&
      !productIds.some((productId) => applicableProducts.includes(productId))
    ) {
      response = { valid: false, message: 'Code is not valid for these cars' };
      return;
    }

    if (applicableSeries.length > 0 && !series.some((name) => applicableSeries.includes(name))) {
      response = { valid: false, message: 'Code is not valid for this series' };
      return;
    }

    if (userId && Number(promo.perUserLimit || 0) > 0) {
      const usageQuery = db
        .collection('promoUsage')
        .where('code', '==', normalizedCode)
        .where('userId', '==', userId);
      const usageSnap = await tx.get(usageQuery);

      if (usageSnap.size >= Number(promo.perUserLimit || 0)) {
        response = { valid: false, message: 'You have already used this code' };
        return;
      }
    }

    const discountAmount = calculateDiscount(promo, cartTotal);

    if (consume) {
      tx.update(promoRef, { usedCount: FieldValue.increment(1), updatedAt: now });

      if (userId) {
        tx.create(db.collection('promoUsage').doc(), {
          code: normalizedCode,
          userId,
          orderId: null,
          discountAmount,
          usedAt: now,
        });
      }
    }

    response = {
      valid: true,
      discountAmount,
      message: `INR ${discountAmount} discount applied!`,
      code: normalizedCode,
    };
  });

  return response;
}

async function consumePromoInTransaction(tx, {
  code,
  cartTotal,
  userId,
  orderId,
  productIds = [],
  series = [],
}) {
  const normalizedCode = normalizeCode(code);

  if (!normalizedCode) {
    return { valid: false, message: 'Enter a promo code', discountAmount: 0 };
  }

  const promoRef = db.collection('promoCodes').doc(normalizedCode);
  const promoSnap = await tx.get(promoRef);
  const now = Timestamp.now();

  if (!promoSnap.exists) {
    return { valid: false, message: 'Code not found', discountAmount: 0 };
  }

  const promo = promoSnap.data();
  const start = promo.startDate;
  const end = promo.endDate;
  const usedCount = Number(promo.usedCount || 0);
  const usageLimit = Number(promo.usageLimit || 0);
  const minOrderValue = Number(promo.minOrderValue || 0);
  const applicableProducts = promo.applicableProducts || [];
  const applicableSeries = promo.applicableSeries || [];

  if (!promo.active) {
    return { valid: false, message: 'Code is inactive', discountAmount: 0 };
  }

  if ((start && start.toMillis() > now.toMillis()) || (end && end.toMillis() < now.toMillis())) {
    return { valid: false, message: 'Code expired or not started yet', discountAmount: 0 };
  }

  if (usageLimit > 0 && usedCount >= usageLimit) {
    return { valid: false, message: 'Code usage limit reached', discountAmount: 0 };
  }

  if (cartTotal < minOrderValue) {
    return { valid: false, message: `Minimum order value is INR ${minOrderValue}`, discountAmount: 0 };
  }

  if (
    applicableProducts.length > 0 &&
    !productIds.some((productId) => applicableProducts.includes(productId))
  ) {
    return { valid: false, message: 'Code is not valid for these cars', discountAmount: 0 };
  }

  if (applicableSeries.length > 0 && !series.some((name) => applicableSeries.includes(name))) {
    return { valid: false, message: 'Code is not valid for this series', discountAmount: 0 };
  }

  if (userId && Number(promo.perUserLimit || 0) > 0) {
    const usageQuery = db
      .collection('promoUsage')
      .where('code', '==', normalizedCode)
      .where('userId', '==', userId);
    const usageSnap = await tx.get(usageQuery);

    if (usageSnap.size >= Number(promo.perUserLimit || 0)) {
      return { valid: false, message: 'You have already used this code', discountAmount: 0 };
    }
  }

  const discountAmount = calculateDiscount(promo, cartTotal);
  tx.update(promoRef, { usedCount: FieldValue.increment(1), updatedAt: now });

  if (userId) {
    tx.create(db.collection('promoUsage').doc(), {
      code: normalizedCode,
      userId,
      orderId,
      discountAmount,
      usedAt: now,
    });
  }

  return {
    valid: true,
    code: normalizedCode,
    discountAmount,
    message: `INR ${discountAmount} discount applied!`,
  };
}

exports.validatePromoCode = onRequest(async (req, res) => {
  if (!assertMethod(req, res)) return;

  try {
    const auth = await getRequestAuth(req);
    const key = auth ? auth.uid : req.ip;
    await checkRateLimit(key, 'validatePromoCode', 10, 60);

    const result = await validatePromoCore({
      code: req.body.code,
      cartTotal: Number(req.body.cartTotal || 0),
      userId: auth ? auth.uid : req.body.userId,
      productIds: req.body.productIds || [],
      series: req.body.series || [],
      consume: req.body.consume === true,
    });

    json(res, 200, result);
  } catch (error) {
    const status = error.code === 'resource-exhausted' ? 429 : 500;
    json(res, status, { valid: false, message: error.message || 'Promo validation failed' });
  }
});

exports.createOrder = onRequest(async (req, res) => {
  if (!assertMethod(req, res)) return;

  try {
    const auth = await getRequestAuth(req);
    const userId = auth ? auth.uid : req.body.guestId || `guest_${Date.now()}`;
    await checkRateLimit(userId, 'createOrder', 5, 60);

    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const paymentMethod = req.body.paymentMethod === 'COD' ? 'COD' : 'UPI';
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    if (items.length === 0) {
      json(res, 400, { error: 'Cart is empty' });
      return;
    }

    const result = await db.runTransaction(async (tx) => {
      let subtotal = 0;
      const orderItems = [];
      const productIds = [];
      const productSeries = [];
      const stockUpdates = [];

      for (const item of items) {
        const productId = String(item.productId || '');
        const qty = Math.max(1, Number(item.qty || 1));
        const productRef = db.collection('products').doc(productId);
        const productSnap = await tx.get(productRef);

        if (!productSnap.exists) {
          throw new Error(`Product ${productId} was not found`);
        }

        const product = productSnap.data();
        const stock = Number(product.stock || 0);
        const price = Number(product.price || 0);

        if (!product.active) {
          throw new Error(`${product.name} is not available`);
        }

        if (stock < qty) {
          throw new Error(`${product.name} has only ${stock} left`);
        }

        subtotal += price * qty;
        productIds.push(productId);
        productSeries.push(product.series);
        orderItems.push({
          productId,
          name: product.name,
          qty,
          price,
          image: product.imageUrl || product.images?.[0] || '',
        });
        stockUpdates.push({ productRef, stock, qty });
      }

      const promo = req.body.promoCode
        ? await consumePromoInTransaction(tx, {
            code: req.body.promoCode,
            cartTotal: subtotal,
            userId: auth ? auth.uid : null,
            orderId,
            productIds,
            series: productSeries.filter(Boolean),
          })
        : { valid: false, discountAmount: 0 };

      if (req.body.promoCode && !promo.valid) {
        throw new Error(promo.message || 'Promo code is invalid');
      }

      const codFee = paymentMethod === 'COD' ? 50 : 0;
      const discount = promo.valid ? Number(promo.discountAmount || 0) : 0;
      const total = roundMoney(subtotal - discount + codFee);
      const upiPaymentLink =
        paymentMethod === 'UPI'
          ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
              STORE_NAME
            )}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`
          : '';

      stockUpdates.forEach(({ productRef, stock, qty }) => {
        tx.update(productRef, {
          stock: stock - qty,
          sold: FieldValue.increment(qty),
          updatedAt: Timestamp.now(),
        });
      });

      const order = {
        orderId,
        userId,
        customerName: req.body.customerName || '',
        customerPhone: req.body.customerPhone || '',
        customerEmail: req.body.customerEmail || '',
        address: req.body.address || {},
        items: orderItems,
        subtotal: roundMoney(subtotal),
        discount,
        codFee,
        total,
        promoCode: promo.valid ? promo.code : null,
        paymentMethod,
        paymentStatus: paymentMethod === 'UPI' ? 'awaiting_verification' : 'pending',
        upiTransactionId: req.body.upiTransactionId || '',
        upiScreenshot: req.body.upiScreenshot || '',
        upiPaymentLink,
        orderStatus: 'pending',
        trackingId: '',
        courier: '',
        notes: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      tx.set(db.collection('orders').doc(orderId), order);
      return { orderId, total, paymentMethod, paymentStatus: order.paymentStatus, upiPaymentLink };
    });

    json(res, 200, result);
  } catch (error) {
    const status = error.code === 'resource-exhausted' ? 429 : 400;
    json(res, status, { error: error.message || 'Order could not be created' });
  }
});

exports.syncAdminCustomClaims = onDocumentWritten('adminUsers/{uid}', async (event) => {
  const uid = event.params.uid;
  const after = event.data.after;

  if (!after.exists) {
    await admin.auth().setCustomUserClaims(uid, { role: null, active: false });
    return;
  }

  const adminUser = after.data();
  const role = adminUser.active === false ? null : adminUser.role;
  const permissions = role ? adminUser.permissions || ROLE_PERMISSIONS[role] || {} : {};

  await admin.auth().setCustomUserClaims(uid, {
    role,
    permissions,
    active: adminUser.active !== false,
  });
});

exports.productStockMonitor = onDocumentUpdated('products/{productId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  const productId = event.params.productId;
  const oldStock = Number(before.stock || 0);
  const newStock = Number(after.stock || 0);
  const threshold = Number(after.lowStockThreshold || 5);

  if (oldStock === newStock) return;

  const productRef = event.data.after.ref;
  const now = Timestamp.now();
  const flags = {
    outOfStockAlert: newStock === 0,
    lowStockAlert: newStock > 0 && newStock <= threshold,
  };

  await productRef.set(flags, { merge: true });

  await db.collection('stockHistory').add({
    productId,
    productName: after.name || '',
    oldStock,
    newStock,
    changedBy: after.updatedBy || 'system',
    reason: 'stock_update',
    timestamp: now,
  });

  if (newStock > threshold) {
    const unresolved = await db
      .collection('inventoryAlerts')
      .where('productId', '==', productId)
      .where('resolved', '==', false)
      .get();

    const batch = db.batch();
    unresolved.docs.forEach((doc) => {
      batch.update(doc.ref, { resolved: true, resolvedAt: now, type: 'restock' });
    });
    await batch.commit();
    return;
  }

  const type = newStock === 0 ? 'out_of_stock' : 'low_stock';
  const existing = await db
    .collection('inventoryAlerts')
    .where('productId', '==', productId)
    .where('type', '==', type)
    .where('resolved', '==', false)
    .limit(1)
    .get();

  if (!existing.empty) return;

  await db.collection('inventoryAlerts').add({
    productId,
    productName: after.name || '',
    productImage: after.imageUrl || after.images?.[0] || '',
    type,
    stockLevel: newStock,
    threshold,
    resolved: false,
    createdAt: now,
  });
});

exports.createStockNotifications = onDocumentUpdated('products/{productId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (Number(before.stock || 0) > 0 || Number(after.stock || 0) <= 0) return;

  const productId = event.params.productId;
  const alerts = await db
    .collection('stockAlerts')
    .where('productId', '==', productId)
    .where('notified', '==', false)
    .get();

  if (alerts.empty) return;

  const batch = db.batch();
  alerts.docs.forEach((alertDoc) => {
    const alert = alertDoc.data();
    const notificationRef = db
      .collection('users')
      .doc(alert.userId)
      .collection('notifications')
      .doc();

    batch.set(notificationRef, {
      type: 'restock',
      title: `${after.name} is back in stock`,
      productId,
      read: false,
      createdAt: Timestamp.now(),
    });
    batch.update(alertDoc.ref, { notified: true, notifiedAt: Timestamp.now() });
  });

  await batch.commit();
});

exports.orderStatusNotifications = onDocumentUpdated('orders/{orderId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.orderStatus === after.orderStatus) return;

  await db.collection('notifications').add({
    userId: after.userId,
    orderId: event.params.orderId,
    type: 'order_status',
    title: `Order ${event.params.orderId} is now ${after.orderStatus}`,
    read: false,
    createdAt: Timestamp.now(),
  });
});

exports.recalculateProductRatings = onDocumentWritten('reviews/{reviewId}', async (event) => {
  const before = event.data.before.exists ? event.data.before.data() : null;
  const after = event.data.after.exists ? event.data.after.data() : null;
  const productId = (after || before || {}).productId;

  if (!productId) return;

  const reviews = await db.collection('reviews').where('productId', '==', productId).get();
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  let count = 0;

  reviews.docs.forEach((doc) => {
    const review = doc.data();
    if (review.adminApproved === false || review.reported === true) return;
    const rating = Math.max(1, Math.min(5, Number(review.rating || 0)));
    breakdown[rating] += 1;
    total += rating;
    count += 1;
  });

  await db.collection('products').doc(productId).set(
    {
      avgRating: count === 0 ? 0 : roundMoney(total / count),
      reviewCount: count,
      ratingBreakdown: {
        1: breakdown[1],
        2: breakdown[2],
        3: breakdown[3],
        4: breakdown[4],
        5: breakdown[5],
      },
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
});

exports.auditAdminLogins = onDocumentCreated('adminUsers/{uid}', async (event) => {
  const adminUser = event.data.data();
  await logAdminAction({
    adminUid: adminUser.createdBy || 'system',
    adminName: 'System',
    adminRole: 'superadmin',
    action: 'ADMIN_CREATED',
    category: 'auth',
    targetId: event.params.uid,
    targetName: adminUser.email || event.params.uid,
    oldValue: null,
    newValue: adminUser,
  });
});

async function logAdminAction({
  adminUid,
  adminName,
  adminRole,
  action,
  category,
  targetId,
  targetName,
  oldValue,
  newValue,
  ipAddress = '',
  userAgent = '',
}) {
  await db.collection('auditLogs').add({
    adminUid,
    adminName,
    adminRole,
    action,
    category,
    targetId,
    targetName,
    oldValue,
    newValue,
    ipAddress,
    userAgent,
    timestamp: Timestamp.now(),
  });
}

exports.cleanupAuditLogs = onSchedule('every 24 hours', async () => {
  const cutoff = Timestamp.fromMillis(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const oldLogs = await db
    .collection('auditLogs')
    .where('timestamp', '<', cutoff)
    .limit(500)
    .get();

  if (oldLogs.empty) return;

  const batch = db.batch();
  oldLogs.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
});

exports.generateSitemap = onRequest(async (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  const staticPaths = ['/', '/rare-collection/', '/garage/', '/history/', '/tracks/'];

  const urls = staticPaths.map((path) => ({
    loc: `${origin}${path}`,
    changefreq: 'weekly',
    priority: path === '/' ? '1.0' : '0.8',
  }));

  const products = await db.collection('products').where('active', '==', true).get();
  products.docs.forEach((doc) => {
    urls.push({
      loc: `${origin}/product/${encodeURIComponent(doc.id)}/`,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  const cars = await db.collection('cars').get();
  cars.docs.forEach((doc) => {
    urls.push({
      loc: `${origin}/garage/?car=${encodeURIComponent(doc.id)}`,
      changefreq: 'monthly',
      priority: '0.5',
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const { onObjectFinalized } = require("firebase-functions/v2/storage");
const sharp = require("sharp");
const path = require("path");
const os = require("os");
const fs = require("fs");

exports.optimizeImage = onObjectFinalized(async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  // Only process files in products/{productId}/original.*
  if (!filePath.startsWith('products/') || !filePath.includes('/original.') || !contentType.startsWith('image/')) {
    return;
  }

  const bucket = admin.storage().bucket(fileBucket);
  const fileName = path.basename(filePath);
  const productId = filePath.split('/')[1];
  const tempFilePath = path.join(os.tmpdir(), fileName);

  await bucket.file(filePath).download({ destination: tempFilePath });

  const sizes = [
    { name: 'thumb', size: 200, quality: 70 },
    { name: 'medium', size: 600, quality: 75 },
    { name: 'large', size: 1200, quality: 85 },
  ];

  const uploadPromises = sizes.map(async ({ name, size, quality }) => {
    const tempWebpPath = path.join(os.tmpdir(), `${name}.webp`);
    
    await sharp(tempFilePath)
      .resize(size, size, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality })
      .toFile(tempWebpPath);

    const destination = `products/${productId}/${name}.webp`;
    
    await bucket.upload(tempWebpPath, {
      destination,
      metadata: {
        contentType: 'image/webp',
        cacheControl: 'public,max-age=31536000,immutable',
      },
    });

    fs.unlinkSync(tempWebpPath);
    
    const fileRef = bucket.file(destination);
    await fileRef.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    return { name, url: publicUrl };
  });

  const results = await Promise.all(uploadPromises);
  fs.unlinkSync(tempFilePath);

  // Update Firestore product document
  const urls = {};
  results.forEach(r => { urls[r.name + 'Url'] = r.url; });

  await db.collection('products').doc(productId).update({
    images: admin.firestore.FieldValue.arrayUnion(urls.mediumUrl),
    optimizedImages: urls,
    updatedAt: admin.firestore.Timestamp.now()
  });
});
