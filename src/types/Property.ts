export type Property = {
  id: number;
  title: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  yearBuilt?: number;
  image: string;
  description: string;
  panoramas: {
  name: string;
  url: string;
}[];
  dataSource: string;
  isDemo: boolean;
};