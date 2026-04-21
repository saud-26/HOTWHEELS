'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToCars, addCar, updateCar, deleteCar } from '@/lib/db';
import { CARS } from '@/lib/cars';
import type { CarData } from '@/lib/types';
import {
  Plus, Trash2, Edit3, Upload, Car, X, Save, Image as ImageIcon,
  Link as LinkIcon, ChevronDown, Flame, Search, Database, AlertTriangle,
} from 'lucide-react';
import { resolveCarImage, handleImageError } from '@/lib/image-utils';

// Removed duplicate CarItem interface

const EMPTY_CAR = {
  name: '',
  bio: '',
  series: '',
  year: 2024,
  rarity: 'regular' as string,
  rarityScore: 1,
  description: '',
  specs: { engine: '', horsepower: 0, topSpeed: 0, weight: '', scale: '1:64' },
  colors: [] as string[],
  image: '',
  category: 'garage' as string,
};

export default function AdminDashboard() {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const [formData, setFormData] = useState(EMPTY_CAR);
  const [colorInput, setColorInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deletingCar, setDeletingCar] = useState<CarData | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Seed state
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [connectionError, setConnectionError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('hw_admin_token') : null;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCars((updatedCars) => {
      setCars(updatedCars);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filtered = cars.filter((car) => {
    const matchesSearch =
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.series.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || car.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Open add form
  const openAddForm = () => {
    setEditingCar(null);
    setFormData({ ...EMPTY_CAR, colors: [] });
    setColorInput('');
    setImageMode('url');
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (car: CarData) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      bio: car.bio || '',
      series: car.series || '',
      year: car.year || 2024,
      rarity: car.rarity || 'regular',
      rarityScore: car.rarityScore || 1,
      description: car.description || '',
      specs: car.specs ? { ...car.specs } : { ...EMPTY_CAR.specs },
      colors: car.colors ? [...car.colors] : [],
      image: car.image || '',
      category: car.category || 'garage',
    });
    setColorInput('');
    setImageMode('url');
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCar) {
        await updateCar(editingCar._id!, formData as Partial<CarData>);
      } else {
        await addCar(formData as Partial<CarData>);
      }
      setShowForm(false);
    } catch (err: any) {
      alert(err.message || 'Failed to save car');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCar) return;
    setDeleting(true);

    try {
      if(deletingCar._id) {
        await deleteCar(deletingCar._id);
      }
      setShowDelete(false);
      setDeletingCar(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('/api/upload/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch {
      alert('Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add color tag
  const addColor = () => {
    if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim()],
      }));
      setColorInput('');
    }
  };

  // Remove color tag
  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  // Seed database
  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage('');
    try {
      for (const car of CARS) {
        await addCar(car);
      }
      setSeedMessage(`Seeded ${CARS.length} cars!`);
    } catch (err: any) {
      setSeedMessage('Seed failed');
    } finally {
      setSeeding(false);
    }
  };

  const rarityBadgeClass: Record<string, string> = {
    'super-treasure': 'badge-super-treasure',
    treasure: 'badge-treasure',
    limited: 'badge-limited',
    regular: 'badge-regular',
  };

  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="admin-dash-header">
        <div>
          <h1>
            <Car size={28} />
            Car Collection
          </h1>
          <p>{cars.length} cars in database</p>
        </div>
        <div className="admin-dash-header-actions">
          <button className="btn btn-secondary admin-seed-btn" onClick={handleSeed} disabled={seeding}>
            <Database size={16} />
            {seeding ? 'Seeding...' : 'Seed DB'}
          </button>
          <button className="btn btn-primary" onClick={openAddForm}>
            <Plus size={18} />
            Add Car
          </button>
        </div>
      </div>

      {seedMessage && (
        <motion.div
          className="admin-seed-msg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {seedMessage}
        </motion.div>
      )}

      {connectionError && (
        <motion.div
          className="admin-login-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle size={16} />
          {connectionError}
        </motion.div>
      )}

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="admin-category-filter">
          <button
            className={`filter-pill ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          <button
            className={`filter-pill ${filterCategory === 'rare-collection' ? 'active' : ''}`}
            onClick={() => setFilterCategory('rare-collection')}
          >
            Rare Collection
          </button>
          <button
            className={`filter-pill ${filterCategory === 'garage' ? 'active' : ''}`}
            onClick={() => setFilterCategory('garage')}
          >
            Garage
          </button>
        </div>
      </div>

      {/* Car List */}
      {loading ? (
        <div className="admin-loading-cars">
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-car-skeleton" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          className="admin-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Car size={48} strokeWidth={1} />
          <h3>No Cars Found</h3>
          <p>
            {cars.length === 0
              ? 'Database is empty. Click "Seed DB" to populate with default cars, or add a new car.'
              : 'No cars match your filters.'}
          </p>
        </motion.div>
      ) : (
        <motion.div className="admin-car-grid" layout>
          <AnimatePresence>
            {filtered.map((car, i) => (
              <motion.div
                key={car._id}
                className="admin-car-card glass"
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="admin-car-card-img">
                  {car.image ? (
                    <img src={resolveCarImage(car.id, car.image)} alt={car.name} onError={handleImageError} />
                  ) : (
                    <div className="admin-car-no-img">
                      <Car size={32} />
                    </div>
                  )}
                  <span className={`admin-car-cat-badge ${car.category === 'rare-collection' ? 'cat-rare' : 'cat-garage'}`}>
                    {car.category === 'rare-collection' ? 'Rare' : 'Garage'}
                  </span>
                </div>

                <div className="admin-car-card-body">
                  <div className="admin-car-card-top">
                    <h3>{car.name}</h3>
                    <span className={`product-card-badge ${rarityBadgeClass[car.rarity] || 'badge-regular'}`}>
                      {(car.rarity || 'regular').replace('-', ' ')}
                    </span>
                  </div>
                  <p className="admin-car-meta">
                    {car.series || 'No Series'} · {car.year || 'N/A'}
                  </p>
                  <p className="admin-car-desc">{(car.description || '').slice(0, 80)}...</p>
                </div>

                <div className="admin-car-card-actions">
                  <button className="admin-action-btn edit" onClick={() => openEditForm(car)}>
                    <Edit3 size={15} />
                    Edit
                  </button>
                  <button
                    className="admin-action-btn delete"
                    onClick={() => {
                      setDeletingCar(car);
                      setShowDelete(true);
                    }}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="admin-modal glass-strong"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal-header">
                <h2>
                  {editingCar ? (
                    <><Edit3 size={20} /> Edit Car</>
                  ) : (
                    <><Plus size={20} /> Add New Car</>
                  )}
                </h2>
                <button className="admin-modal-close" onClick={() => setShowForm(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-form">
                <div className="admin-form-scroll">
                  {/* Basic Info */}
                  <div className="admin-form-section">
                    <h4>Basic Information</h4>
                    <div className="admin-form-grid">
                      <div className="admin-input-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Twin Mill"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Series *</label>
                        <input
                          type="text"
                          value={formData.series}
                          onChange={(e) => setFormData((p) => ({ ...p, series: e.target.value }))}
                          placeholder="e.g. Original Sweet Sixteen"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Year *</label>
                        <input
                          type="number"
                          value={formData.year}
                          onChange={(e) => setFormData((p) => ({ ...p, year: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Category *</label>
                        <div className="admin-select-wrap">
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                          >
                            <option value="rare-collection">Rare Collection</option>
                            <option value="garage">Garage</option>
                          </select>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description & Bio */}
                  <div className="admin-form-section">
                    <h4>Description</h4>
                    <div className="admin-input-group">
                      <label>Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                        placeholder="The story behind this car..."
                        rows={3}
                        required
                      />
                    </div>
                    <div className="admin-input-group">
                      <label>Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                        placeholder="Short bio for the car..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Rarity */}
                  <div className="admin-form-section">
                    <h4>Rarity</h4>
                    <div className="admin-form-grid">
                      <div className="admin-input-group">
                        <label>Rarity Level *</label>
                        <div className="admin-select-wrap">
                          <select
                            value={formData.rarity}
                            onChange={(e) => setFormData((p) => ({ ...p, rarity: e.target.value }))}
                          >
                            <option value="super-treasure">Super Treasure Hunt</option>
                            <option value="treasure">Treasure Hunt</option>
                            <option value="limited">Limited Edition</option>
                            <option value="regular">Regular</option>
                          </select>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                      <div className="admin-input-group">
                        <label>Rarity Score (1-5) *</label>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={formData.rarityScore}
                          onChange={(e) => setFormData((p) => ({ ...p, rarityScore: Number(e.target.value) }))}
                          className="admin-slider"
                        />
                        <div className="admin-slider-labels">
                          {[1, 2, 3, 4, 5].map((v) => (
                            <span key={v} className={formData.rarityScore >= v ? 'active' : ''}>
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="admin-form-section">
                    <h4>Specifications</h4>
                    <div className="admin-form-grid">
                      <div className="admin-input-group">
                        <label>Engine *</label>
                        <input
                          type="text"
                          value={formData.specs.engine}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, specs: { ...p.specs, engine: e.target.value } }))
                          }
                          placeholder="e.g. Twin Supercharged V8"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Horsepower *</label>
                        <input
                          type="number"
                          value={formData.specs.horsepower || ''}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              specs: { ...p.specs, horsepower: Number(e.target.value) },
                            }))
                          }
                          placeholder="e.g. 1200"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Top Speed (MPH) *</label>
                        <input
                          type="number"
                          value={formData.specs.topSpeed || ''}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              specs: { ...p.specs, topSpeed: Number(e.target.value) },
                            }))
                          }
                          placeholder="e.g. 240"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Weight *</label>
                        <input
                          type="text"
                          value={formData.specs.weight}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, specs: { ...p.specs, weight: e.target.value } }))
                          }
                          placeholder="e.g. 3,400 lbs"
                          required
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Scale</label>
                        <input
                          type="text"
                          value={formData.specs.scale}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, specs: { ...p.specs, scale: e.target.value } }))
                          }
                          placeholder="1:64"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div className="admin-form-section">
                    <h4>Colors</h4>
                    <div className="admin-color-input">
                      <input
                        type="text"
                        value={colorInput}
                        onChange={(e) => setColorInput(e.target.value)}
                        placeholder="Add a color..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addColor();
                          }
                        }}
                      />
                      <button type="button" className="admin-color-add-btn" onClick={addColor}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="admin-color-tags">
                      {formData.colors.map((c) => (
                        <span key={c} className="admin-color-tag">
                          {c}
                          <button type="button" onClick={() => removeColor(c)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="admin-form-section">
                    <h4>Image</h4>
                    <div className="admin-image-mode-toggle">
                      <button
                        type="button"
                        className={`admin-img-mode ${imageMode === 'url' ? 'active' : ''}`}
                        onClick={() => setImageMode('url')}
                      >
                        <LinkIcon size={14} />
                        URL
                      </button>
                      <button
                        type="button"
                        className={`admin-img-mode ${imageMode === 'upload' ? 'active' : ''}`}
                        onClick={() => setImageMode('upload')}
                      >
                        <Upload size={14} />
                        Upload
                      </button>
                    </div>

                    {imageMode === 'url' ? (
                      <div className="admin-input-group">
                        <label>Image URL</label>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                          placeholder="https://example.com/car.png"
                        />
                      </div>
                    ) : (
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          id="car-image-upload"
                          className="admin-file-input"
                        />
                        <label htmlFor="car-image-upload" className="admin-upload-label">
                          {uploadingImage ? (
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              style={{ display: 'inline-flex' }}
                            >
                              <Flame size={24} />
                            </motion.span>
                          ) : (
                            <>
                              <ImageIcon size={24} />
                              <span>Click to upload image</span>
                              <span className="admin-upload-hint">PNG, JPG, WebP up to 10MB</span>
                            </>
                          )}
                        </label>
                      </div>
                    )}

                    {formData.image && (
                      <motion.div
                        className="admin-image-preview"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <img src={formData.image} alt="Preview" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Form actions */}
                <div className="admin-form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    <Save size={16} />
                    {saving ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDelete && deletingCar && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDelete(false)}
          >
            <motion.div
              className="admin-delete-modal glass-strong"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-delete-icon">
                <AlertTriangle size={32} />
              </div>
              <h3>Delete Car</h3>
              <p>
                Are you sure you want to delete <strong>{deletingCar.name}</strong>? This action
                cannot be undone.
              </p>
              <div className="admin-delete-actions">
                <button className="btn btn-secondary" onClick={() => setShowDelete(false)}>
                  Cancel
                </button>
                <button className="admin-delete-confirm" onClick={handleDelete} disabled={deleting}>
                  <Trash2 size={16} />
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
