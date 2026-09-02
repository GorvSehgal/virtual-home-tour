import { useEffect, useRef, useState } from "react";

type Panorama = {
  name: string;
  url: string;
};

type VirtualTourViewerProps = {
  panoramas: Panorama[];
};

function VirtualTourViewer({ panoramas }: VirtualTourViewerProps) {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedPanorama = panoramas[selectedIndex];

  useEffect(() => {
    if (!viewerRef.current || !selectedPanorama) return;

    const viewer = pannellum.viewer(viewerRef.current, {
      type: "equirectangular",
      panorama: selectedPanorama.url,
      autoLoad: true,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
    });

    return () => {
      viewer.destroy();
    };
  }, [selectedPanorama]);

  if (panoramas.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>360° Virtual Tour</h3>

      <p className="tour-description">
        Explore this property interactively in 360° before booking an
        in-person viewing.
      </p>

      <div className="tour-room-buttons">
        {panoramas.map((panorama, index) => (
          <button
            key={panorama.name}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={selectedIndex === index ? "active" : ""}
          >
            {panorama.name}
          </button>
        ))}
      </div>

      <div
        ref={viewerRef}
        style={{
          width: "100%",
          height: "500px",
        }}
      />
    </div>
  );
}

export default VirtualTourViewer;