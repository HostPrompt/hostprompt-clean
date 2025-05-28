// A collection of royalty-free property images
export const propertyImages = [
  // Luxury vacation properties
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Luxurious beachfront villa with infinity pool
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Elegant modern vacation home with large windows
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Luxurious oceanfront property with panoramic views
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Tropical villa with private pool and gardens
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Luxury penthouse with city skyline views
  'https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Elegant waterfront property
  
  // Modern rental properties
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Modern minimalist rental with clean lines
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Stylish urban apartment with contemporary furnishings
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Modern open concept living space
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Contemporary apartment with minimalist design
  
  // Cozy home interiors
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Cozy cabin retreat surrounded by pine trees
  'https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Cozy living room with fireplace and comfortable furnishings
  'https://images.unsplash.com/photo-1599619351208-3e6c839d6828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Rustic-chic farmhouse with warm interior design
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', // Cozy cottage style interior with warm lighting
];

export const getRandomPropertyImage = (): string => {
  const randomIndex = Math.floor(Math.random() * propertyImages.length);
  return propertyImages[randomIndex];
};
