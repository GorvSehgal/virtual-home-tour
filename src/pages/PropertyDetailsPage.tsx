import { useParams } from "react-router-dom";
import { properties } from "../data/properties";
import { useState } from "react";
import VirtualTourViewer from "../components/VirtualTourViewer";
import BookingForm from "../components/BookingForm";

function PropertyDetailsPage() {
    const [showTour, setShowTour] = useState(false);
  const { id } = useParams<{ id: string }>();

  const property = properties.find(
    property => property.id === Number(id)
  );


  if (!property) {
    return <h1>Property not found</h1>;
  }

  return (
    <div>
        <img src={property.image} alt={property.title} />

<p>
  {property.bedrooms} Beds | {property.bathrooms} Baths
</p>
<button onClick={() => setShowTour(prev => !prev)}>
  {showTour ? "Close Virtual Tour" : "Start Virtual Tour"}
</button>
{showTour && (
  <VirtualTourViewer panoramaUrl={property.panoramaUrl} />
)}

<p>{property.description}</p>
      <h1>{property.title}</h1>
      <p>ID: {property.id}</p>
      {/* <p>{property.location}</p> */}
      <p>${property.price}</p>
    
    <h2>Book a Viewing</h2>
<BookingForm />
</div>  
  );
}

export default PropertyDetailsPage;