import type { Property } from "../types/Property";

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Detached Home",
    address: "123 Example Street",
    city: "Vancouver",
    province: "BC",
    postalCode: "V5K 0A1",
    price: 1280000,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Detached",
    yearBuilt: 2018,
    image: "https://placehold.co/600x400",
    description: "Modern detached family home with spacious living areas.",
    panoramaUrl: "YOUR_EXISTING_PANORAMA_URL",
    dataSource: "Demo / Canadian Open Data",
    isDemo: true
  },
  {
    id: 2,
    title: "Downtown Condo",
    location: "Toronto, ON",
    price: 649000,
    bedrooms: 2,
    bathrooms: 2,
    image: "https://placehold.co/600x400",
    description: "A bright condo close to downtown amenities.",
    panoramaUrl: "https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg"
  }
];