import { useState } from 'react';
import './Content.css';

const GalleryContent = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Placeholder photos — swap src with your own images
  const photos = [
    { id: 1, src: '/photos/photo1.jpg', alt: 'Funny moment #1', caption: 'That one time...' },
    { id: 2, src: '/photos/photo2.jpg', alt: 'Funny moment #2', caption: 'No context needed' },
    { id: 3, src: '/photos/photo3.jpg', alt: 'Funny moment #3', caption: 'Peak comedy' },
    { id: 4, src: '/photos/photo4.jpg', alt: 'Funny moment #4', caption: 'Certified classic' },
    { id: 5, src: '/photos/photo5.jpg', alt: 'Funny moment #5', caption: 'Frame-worthy' },
    { id: 6, src: '/photos/photo6.jpg', alt: 'Funny moment #6', caption: 'Iconic' },
    { id: 7, src: '/photos/photo7.jpg', alt: 'Funny moment #7', caption: 'Legendary' },
    { id: 8, src: '/photos/photo8.jpg', alt: 'Funny moment #8', caption: 'Unforgettable' },
    { id: 9, src: '/photos/photo9.jpg', alt: 'Funny moment #9', caption: 'Chef\'s kiss' },
  ];

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h2 className="gallery-title">📸 Photo Gallery</h2>
        <p className="gallery-subtitle">A curated collection of questionable moments</p>
        <div className="gallery-toolbar">
          <span className="gallery-count">{photos.length} items</span>
          <span className="gallery-view-label">Thumbnails</span>
        </div>
      </div>

      {selectedPhoto && (
        <div className="gallery-lightbox" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>✕</button>
            <div className="lightbox-image-wrap">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="lightbox-placeholder">
                <span className="lightbox-placeholder-icon">🖼️</span>
                <span>Image not found</span>
                <span className="lightbox-placeholder-path">{selectedPhoto.src}</span>
              </div>
            </div>
            <p className="lightbox-caption">{selectedPhoto.caption}</p>
          </div>
        </div>
      )}

      <div className="gallery-grid">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="gallery-item"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="gallery-thumb">
              <img
                src={photo.src}
                alt={photo.alt}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="gallery-thumb-placeholder">
                <span className="thumb-icon">🖼️</span>
              </div>
            </div>
            <span className="gallery-item-caption">{photo.caption}</span>
          </div>
        ))}
      </div>

      <div className="gallery-footer">
        <p>Drop your photos in <code>/public/photos/</code> named photo1.jpg – photo9.jpg</p>
      </div>
    </div>
  );
};

export default GalleryContent;
