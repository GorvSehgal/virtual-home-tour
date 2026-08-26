type VirtualTourViewerProps = {
    panoramaUrl: string;
  };
  
  
  function VirtualTourViewer({ panoramaUrl }: VirtualTourViewerProps) {
    return (
        <div>
      <h3>360° Virtual Tour</h3>
      <p className="tour-description">
  Explore this property interactively in 360° before booking an in-person viewing.
</p>
      <iframe
        src={panoramaUrl}
        title="Virtual Tour"
        width="100%"
        height="500"
        allowFullScreen
      />
    </div>
    );
  }
  
  export default VirtualTourViewer;