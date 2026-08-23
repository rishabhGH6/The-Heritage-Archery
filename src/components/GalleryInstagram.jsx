import React, { useState } from 'react';
import { Camera, ExternalLink, Plus, Heart, Image as ImageIcon, Upload } from 'lucide-react';

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export default function GalleryInstagram({ archers, currentUser, onAddPhoto }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [maximizedPhoto, setMaximizedPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Collect all photos from all archers
  const allTeamPhotos = archers.flatMap(a => (a.photos || []).map(p => ({
    url: p,
    uploader: a.name,
    uploaderCategory: a.category
  })));

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;

    onAddPhoto(currentUser.id, photoUrl.trim());
    setShowUploadModal(false);
    setPhotoUrl('');
    setCaption('');
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }} className="gallery-responsive-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <InstagramIcon size={13} /> Official Social & Team Media
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Instagram & Team Gallery Showcase 📷
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Follow <strong style={{ color: '#fbbf24' }}>@theheritage_archery</strong> on Instagram and share practice & competition photos!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }} className="gallery-header-btns">
          <a
            href="https://www.instagram.com/theheritage_archery?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ textDecoration: 'none', padding: '10px 18px', flex: 1, justifyContent: 'center' }}
          >
            <InstagramIcon size={18} color="#090d16" /> Instagram <ExternalLink size={14} />
          </a>

          <button onClick={() => setShowUploadModal(true)} className="btn-emerald" style={{ padding: '10px 18px', flex: 1, justifyContent: 'center' }}>
            <Plus size={18} /> Upload Photo
          </button>
        </div>
      </div>

      {/* Official Instagram Embed Hero Card */}
      <div className="glass-card glass-card-gold" style={{ padding: '24px', marginBottom: '32px', border: '1px solid rgba(217, 119, 6, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }} className="instagram-card-responsive">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(220,39,67,0.4)',
              flexShrink: 0
            }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <InstagramIcon size={28} color="#fbbf24" />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                @theheritage_archery
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Official Instagram handle of The Heritage Archery Team • State Tournaments & Daily Practice Highlights
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/theheritage_archery?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ border: '1px solid #fbbf24', color: '#fbbf24', justifyContent: 'center' }}
          >
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* Team Photos Showcase Grid */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Camera size={20} color="#34d399" /> Team Archer Uploads Gallery ({allTeamPhotos.length})
      </h3>

      {allTeamPhotos.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          No team photos uploaded yet. Click "Upload Photo" above to share your practice moments!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {allTeamPhotos.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card glass-card-hover" 
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              onClick={() => setMaximizedPhoto(item)}
            >
              <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={item.url}
                  alt="Heritage Archery Moment"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>

              <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'block' }}>
                    Uploaded by {item.uploader}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                    {item.uploaderCategory} Archer
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Heart size={14} fill="#ef4444" /> Maximize 🔍
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
      {maximizedPhoto && (
        <div className="modal-overlay" onClick={() => setMaximizedPhoto(null)} style={{ background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)' }}>
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ maxWidth: '880px', width: '94%', padding: '20px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
                  📷 Photo by {maximizedPhoto.uploader}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600, marginLeft: '8px' }}>
                  ({maximizedPhoto.uploaderCategory} Archer)
                </span>
              </div>
              <button onClick={() => setMaximizedPhoto(null)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '1.2rem', color: '#f8fafc' }}>✕</button>
            </div>

            <img 
              src={maximizedPhoto.url} 
              alt="Maximized Heritage Gallery" 
              style={{ maxWidth: '100%', maxHeight: '78vh', borderRadius: '16px', objectFit: 'contain', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}
            />
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={20} color="#34d399" /> Upload Photo to Team Gallery
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Photo from Device</label>
                <input
                  type="file"
                  accept="image/*"
                  id="gallery-modal-picker"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 800, 800, 0.8);
                        if (compressed) setPhotoUrl(compressed);
                      } catch (err) {
                        console.warn("Gallery photo compress error:", err);
                      }
                    }
                  }}
                />
                <label htmlFor="gallery-modal-picker" className="btn-emerald" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                  <Upload size={16} /> Choose Photo from Device
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Or Paste Image URL</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="https://..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>

              {photoUrl && (
                <div style={{ marginTop: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Preview:</span>
                  <img src={photoUrl} alt="Preview" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginTop: '4px' }} />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-emerald">Add to Gallery</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
