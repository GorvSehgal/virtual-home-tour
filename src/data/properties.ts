import type { Property } from "../types/Property";

import vancouverHome from "../assets/properties/vancouver-home.jpg";
import torontoCondo from "../assets/properties/toronto-condo.jpg";
import calgaryHome from "../assets/properties/calgary-home.jpg";
import ottawaTownhouse from "../assets/properties/ottawa-townhouse.jpg";
import montrealCondo from "../assets/properties/montreal-condo.jpg";
import kelownaWaterfront from "../assets/properties/kelowna-waterfront.jpg";
import livingRoomPanorama from "../assets/panoramas/living-room.jpg";
import bedroomPanorma from "../assets/panoramas/bedroom.png";
import bedroom2Panorama from "../assets/panoramas/bedroom2.png";
/**
 * Wikimedia Commons can return a resized version of the original
 * equirectangular panorama.
 */

const panoramaUrl =  livingRoomPanorama;
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
    image: vancouverHome,
    description:
      "Modern detached family home with spacious living areas.",
    panoramas:  [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom 2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },

  {
    id: 2,
    title: "Downtown Luxury Condo",
    address: "88 Example Avenue",
    city: "Toronto",
    province: "ON",
    postalCode: "M5V 2T6",
    price: 749000,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Condo",
    yearBuilt: 2021,
    image: torontoCondo,
    description:
      "Modern downtown condo with bright interiors and convenient city access.",
    panoramas:  [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom 2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },

  {
    id: 3,
    title: "Contemporary Family Home",
    address: "42 Sample Crescent",
    city: "Calgary",
    province: "AB",
    postalCode: "T2P 1J9",
    price: 638000,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Detached",
    yearBuilt: 2019,
    image: calgaryHome,
    description:
      "Comfortable family home with an open layout and modern finishes.",
    panoramas: [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom 2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },

  {
    id: 4,
    title: "Spacious Urban Townhouse",
    address: "210 Demo Lane",
    city: "Ottawa",
    province: "ON",
    postalCode: "K1P 1J1",
    price: 695000,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "Townhouse",
    yearBuilt: 2020,
    image: ottawaTownhouse,
    description:
      "Spacious townhouse offering comfortable living near urban amenities.",
    panoramas:  [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },

  {
    id: 5,
    title: "Modern City Condo",
    address: "75 Rue Exemple",
    city: "Montreal",
    province: "QC",
    postalCode: "H2Y 1C6",
    price: 589000,
    bedrooms: 2,
    bathrooms: 1,
    propertyType: "Condo",
    yearBuilt: 2022,
    image: montrealCondo,
    description:
      "Contemporary condo with efficient space and easy access to downtown.",
    panoramas:  [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom 2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },

  {
    id: 6,
    title: "Okanagan View Home",
    address: "16 Sample View Road",
    city: "Kelowna",
    province: "BC",
    postalCode: "V1Y 6N2",
    price: 1150000,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Detached",
    yearBuilt: 2017,
    image: kelownaWaterfront,
    description:
      "Spacious home with scenic surroundings and generous family living space.",
    panoramas:  [
  { name: "Living Room", url: panoramaUrl },
  { name: "Bedroom 1", url: bedroomPanorma },
  { name: "Bedroom2", url: bedroom2Panorama }],
    dataSource: "Demo 360 imagery — NPS / Wikimedia Commons",
    isDemo: true,
  },
];