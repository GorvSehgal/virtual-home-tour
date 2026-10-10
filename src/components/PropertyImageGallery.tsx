import { useState } from "react";
import "./PropertyImageGallery.css";

type Props = {
  photos: string[];
  title: string;
};

export default function PropertyImageGallery({ photos, title }: Props) {
  const [selected, setSelected] = useState(0);
  const imageCount = photos.length;
  if (imageCount === 0) return <p>No property photos available.</p>;

  const currentIndex = selected >= imageCount ? 0 : selected;
  const next = () => setSelected((index) => (index + 1) % imageCount);
  const previous = () => setSelected((index) => (index - 1 + imageCount) % imageCount);

  return (
    <section className="property-gallery" aria-label="Property photo gallery">
      <div className="property-gallery-stage">
        <img
          src={photos[currentIndex]}
          alt={`${title} — photo ${currentIndex + 1} of ${imageCount}`}
          className="property-gallery-main"
          decoding="async"
        />
        <span className="property-gallery-counter" aria-live="polite">
          {currentIndex + 1} / {imageCount} photos
        </span>
        {imageCount > 1 && (
          <>
            <button type="button" className="property-gallery-previous"
              onClick={previous} aria-label="Previous property photo">
              ‹
            </button>
            <button type="button" className="property-gallery-next"
              onClick={next} aria-label="Next property photo">
              ›
            </button>
          </>
        )}
      </div>
      {imageCount > 1 && (
        <div className="property-gallery-thumbnails" aria-label="Choose a property photo">
          {photos.map((photo, index) => (
            <button key={`${photo}-${index}`} type="button"
              className={index === currentIndex ? "property-gallery-thumb active" : "property-gallery-thumb"}
              onClick={() => setSelected(index)}
              aria-label={`Show property photo ${index + 1}`}
              aria-pressed={index === currentIndex}>
              <img src={photo} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
