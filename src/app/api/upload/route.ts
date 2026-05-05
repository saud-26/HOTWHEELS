import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { getFirebaseStorage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function POST(req: NextRequest) {
  try {
    const user = authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(getFirebaseStorage(), `uploads/${filename}`);
    
    // Upload to Firebase Storage
    // Note: In a server environment, we can use uploadBytes if the storage is initialized correctly
    const metadata = {
      contentType: file.type,
    };

    const snapshot = await uploadBytes(storageRef, buffer, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return NextResponse.json({
      success: true,
      url: downloadUrl,
      public_id: filename,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image: ' + error.message },
      { status: 500 }
    );
  }
}
