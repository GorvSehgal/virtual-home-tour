type VirtualTourViewerProps = {
    panoramaUrl: string;
  };
  
  
  function VirtualTourViewer({ panoramaUrl }: VirtualTourViewerProps) {
    return (
        <div>
      <h3>360° Virtual Tour</h3>

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