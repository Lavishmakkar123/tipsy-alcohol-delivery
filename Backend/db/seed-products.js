// One-off seed data for the products table. This is the same catalog that
// used to live inline in services/products.service.js before that switched
// to real SQL queries — kept here so `node db/migrate.js` can (re)seed it.
module.exports = [
  { id: 'beer-golden-wheat-lager', name: 'Golden Wheat Lager', category: 'beer', price: 15.99, size: '6 x 355ml', description: 'A crisp, easy-drinking wheat lager with a light citrus finish.' },
  { id: 'beer-harvest-pale-ale', name: 'Harvest Pale Ale', category: 'beer', price: 16.99, size: '6 x 355ml', description: 'Hoppy and bright, with notes of grapefruit and pine.' },
  { id: 'beer-amber-session-ale', name: 'Amber Session Ale', category: 'beer', price: 28.99, size: '12 x 355ml', description: 'A malt-forward session ale built for the long haul.' },
  { id: 'beer-midnight-stout', name: 'Midnight Stout', category: 'beer', price: 14.99, size: '4 x 473ml', description: 'Rich and roasty, with hints of coffee and dark chocolate.' },
  { id: 'wine-cabernet-reserve', name: 'Cabernet Reserve', category: 'wine', price: 19.99, size: '750ml', description: 'Full-bodied with dark fruit, oak, and a smooth finish.' },
  { id: 'wine-coastal-sauvignon-blanc', name: 'Coastal Sauvignon Blanc', category: 'wine', price: 17.99, size: '750ml', description: 'Bright and zesty, with notes of green apple and citrus.' },
  { id: 'wine-sparkling-rose', name: 'Sparkling Rosé', category: 'wine', price: 21.99, size: '750ml', description: 'Light and fruity with a fine, persistent sparkle.' },
  { id: 'wine-old-vine-merlot', name: 'Old Vine Merlot', category: 'wine', price: 22.99, size: '750ml', description: 'Soft tannins and ripe plum, from vines grown for decades.' },
  { id: 'spirits-silver-vodka', name: 'Silver Vodka', category: 'spirits', price: 34.99, size: '750ml', description: 'Clean and smooth, quadruple-distilled for a neutral finish.' },
  { id: 'spirits-aged-dark-rum', name: 'Aged Dark Rum', category: 'spirits', price: 39.99, size: '750ml', description: 'Barrel-aged with notes of caramel, vanilla, and spice.' },
  { id: 'spirits-highland-style-whisky', name: 'Highland Style Whisky', category: 'spirits', price: 54.99, size: '750ml', description: 'Smooth and smoky, matured for a rounded, warming finish.' },
  { id: 'spirits-london-dry-gin', name: 'London Dry Gin', category: 'spirits', price: 36.99, size: '750ml', description: 'Juniper-forward with bright botanicals and a crisp finish.' },
  { id: 'cider-citrus-hard-seltzer', name: 'Citrus Hard Seltzer', category: 'cider', price: 15.99, size: '6 x 355ml', description: 'Light, refreshing, and gluten-free with real citrus flavour.' },
  { id: 'cider-orchard-apple-cider', name: 'Orchard Apple Cider', category: 'cider', price: 16.99, size: '6 x 355ml', description: 'Crisp apple cider with a clean, semi-dry finish.' },
  { id: 'cider-berry-vodka-cooler', name: 'Berry Vodka Cooler', category: 'cider', price: 17.99, size: '6 x 355ml', description: 'A sweet and tart mixed berry cooler over vodka.' },
  { id: 'cider-tropical-fruit-cooler', name: 'Tropical Fruit Cooler', category: 'cider', price: 17.99, size: '6 x 355ml', description: 'Pineapple and mango flavours with a light fizz.' },
  { id: 'mixers-classic-ginger-beer', name: 'Classic Ginger Beer', category: 'mixers', price: 6.99, size: '4 x 355ml', description: 'Bold ginger spice, perfect for a classic mule.' },
  { id: 'mixers-tonic-water', name: 'Tonic Water', category: 'mixers', price: 5.99, size: '4 x 355ml', description: 'A crisp, bittersweet mixer for your favourite spirit.' },
  { id: 'mixers-sparkling-soda', name: 'Sparkling Soda', category: 'mixers', price: 4.99, size: '4 x 355ml', description: 'Plain and fizzy, for topping up any cocktail.' },
  { id: 'mixers-cola-mixer', name: 'Cola Mixer', category: 'mixers', price: 4.99, size: '4 x 355ml', description: 'A classic cola, made for rum and whisky alike.' },
];
