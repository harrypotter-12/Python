export const CATEGORIES = [
  { id: 'home', label: 'Home' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'pets', label: 'Pets' },
  { id: 'kitchen', label: 'Kitchen' },
]

export function categoryLabel(id) {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id
}

// Original sample catalog. Costs, shipping, and countries are illustrative.
export const products = [
  { id: 'hc-oak-peg-rail', title: 'Oak Peg Rail', category: 'home', country: 'Portugal', productCost: 11.5, shippingCost: 4.25, shippingDays: 9, suggestedRetail: 34 },
  { id: 'hc-linen-drawers', title: 'Linen Drawer Organizer', category: 'home', country: 'India', productCost: 6.8, shippingCost: 3.1, shippingDays: 14, suggestedRetail: 22 },
  { id: 'hc-stoneware-coasters', title: 'Stoneware Coaster Set', category: 'home', country: 'Japan', productCost: 9.4, shippingCost: 5.6, shippingDays: 12, suggestedRetail: 28 },
  { id: 'hc-wool-throw', title: 'Charcoal Wool Throw', category: 'home', country: 'Turkey', productCost: 18, shippingCost: 6.5, shippingDays: 11, suggestedRetail: 58 },
  { id: 'hc-rattan-basket', title: 'Rattan Magazine Basket', category: 'home', country: 'Vietnam', productCost: 13.2, shippingCost: 7.4, shippingDays: 16, suggestedRetail: 29 },
  { id: 'hc-brass-hooks', title: 'Brass Hook Trio', category: 'home', country: 'India', productCost: 4.9, shippingCost: 2.8, shippingDays: 13, suggestedRetail: 19 },
  { id: 'hc-storage-cube', title: 'Cotton Storage Cube', category: 'home', country: 'Portugal', productCost: 7.25, shippingCost: 4, shippingDays: 8, suggestedRetail: 26 },
  { id: 'hc-ceramic-lamp', title: 'Ceramic Table Lamp', category: 'home', country: 'Mexico', productCost: 15.8, shippingCost: 8.9, shippingDays: 10, suggestedRetail: 32 },

  { id: 'bt-amber-pump', title: 'Amber Glass Pump Bottle', category: 'beauty', country: 'Italy', productCost: 3.4, shippingCost: 2.2, shippingDays: 7, suggestedRetail: 16 },
  { id: 'bt-brush-roll', title: 'Bamboo Brush Roll', category: 'beauty', country: 'Vietnam', productCost: 5.1, shippingCost: 2.9, shippingDays: 15, suggestedRetail: 21 },
  { id: 'bt-silk-mask', title: 'Silk Sleep Mask', category: 'beauty', country: 'South Korea', productCost: 8.75, shippingCost: 3.4, shippingDays: 8, suggestedRetail: 32 },
  { id: 'bt-clay-bowl', title: 'Clay Mixing Bowl', category: 'beauty', country: 'Morocco', productCost: 6.2, shippingCost: 4.8, shippingDays: 12, suggestedRetail: 24 },
  { id: 'bt-toiletry-sleeve', title: 'Travel Toiletry Sleeve', category: 'beauty', country: 'Portugal', productCost: 7.9, shippingCost: 3.1, shippingDays: 9, suggestedRetail: 27 },
  { id: 'bt-rounds-canister', title: 'Cotton Rounds Canister', category: 'beauty', country: 'Poland', productCost: 4.6, shippingCost: 3.5, shippingDays: 6, suggestedRetail: 18 },
  { id: 'bt-matte-mirror', title: 'Matte Compact Mirror', category: 'beauty', country: 'South Korea', productCost: 5.8, shippingCost: 2.7, shippingDays: 10, suggestedRetail: 23 },
  { id: 'bt-linen-headband', title: 'Linen Headband Pair', category: 'beauty', country: 'Turkey', productCost: 3.9, shippingCost: 2.4, shippingDays: 11, suggestedRetail: 15 },

  { id: 'ft-cork-block', title: 'Cork Yoga Block', category: 'fitness', country: 'Portugal', productCost: 6.5, shippingCost: 4.2, shippingDays: 8, suggestedRetail: 22 },
  { id: 'ft-band-set', title: 'Resistance Band Set', category: 'fitness', country: 'Taiwan', productCost: 4.2, shippingCost: 2.6, shippingDays: 12, suggestedRetail: 18 },
  { id: 'ft-steel-bottle', title: 'Steel Bottle, 750 ml', category: 'fitness', country: 'India', productCost: 7.8, shippingCost: 5.1, shippingDays: 14, suggestedRetail: 29 },
  { id: 'ft-jump-rope', title: 'Foam-Handle Jump Rope', category: 'fitness', country: 'Vietnam', productCost: 3.3, shippingCost: 2.5, shippingDays: 13, suggestedRetail: 16 },
  { id: 'ft-foam-roller', title: 'Short Foam Roller', category: 'fitness', country: 'Poland', productCost: 9.6, shippingCost: 6.4, shippingDays: 7, suggestedRetail: 24 },
  { id: 'ft-exercise-mat', title: 'Studio Exercise Mat', category: 'fitness', country: 'Thailand', productCost: 12.4, shippingCost: 8.2, shippingDays: 18, suggestedRetail: 28 },
  { id: 'ft-ankle-weights', title: 'Soft Ankle Weights', category: 'fitness', country: 'Mexico', productCost: 11.2, shippingCost: 5.5, shippingDays: 9, suggestedRetail: 36 },
  { id: 'ft-grip-pair', title: 'Hand Grip Pair', category: 'fitness', country: 'Taiwan', productCost: 2.9, shippingCost: 2.1, shippingDays: 11, suggestedRetail: 14 },

  { id: 'pt-bed-cover', title: 'Canvas Bed Cover', category: 'pets', country: 'Portugal', productCost: 14.5, shippingCost: 6.8, shippingDays: 10, suggestedRetail: 44 },
  { id: 'pt-slow-bowl', title: 'Ceramic Slow Bowl', category: 'pets', country: 'Japan', productCost: 8.9, shippingCost: 5.4, shippingDays: 12, suggestedRetail: 31 },
  { id: 'pt-window-pad', title: 'Window Perch Pad', category: 'pets', country: 'Vietnam', productCost: 9.7, shippingCost: 4.9, shippingDays: 16, suggestedRetail: 22 },
  { id: 'pt-rope-tug', title: 'Cotton Rope Tug', category: 'pets', country: 'India', productCost: 3.6, shippingCost: 2.8, shippingDays: 13, suggestedRetail: 15 },
  { id: 'pt-travel-bottle', title: 'Travel Pet Bottle', category: 'pets', country: 'Mexico', productCost: 5.4, shippingCost: 3.2, shippingDays: 8, suggestedRetail: 20 },
  { id: 'pt-felt-cave', title: 'Felt Cat Cave', category: 'pets', country: 'Turkey', productCost: 13.8, shippingCost: 7.1, shippingDays: 14, suggestedRetail: 29 },
  { id: 'pt-food-scoop', title: 'Steel Food Scoop', category: 'pets', country: 'Poland', productCost: 4.1, shippingCost: 2.9, shippingDays: 6, suggestedRetail: 17 },
  { id: 'pt-leash', title: 'Reflective Leash', category: 'pets', country: 'Canada', productCost: 6.7, shippingCost: 3.8, shippingDays: 5, suggestedRetail: 26 },

  { id: 'kt-beech-spoons', title: 'Beech Spoon Set', category: 'kitchen', country: 'Portugal', productCost: 8.2, shippingCost: 4.4, shippingDays: 9, suggestedRetail: 28 },
  { id: 'kt-prep-boxes', title: 'Glass Prep Boxes', category: 'kitchen', country: 'Czechia', productCost: 11.4, shippingCost: 6.9, shippingDays: 8, suggestedRetail: 26 },
  { id: 'kt-trivet', title: 'Cast Iron Trivet', category: 'kitchen', country: 'India', productCost: 7.1, shippingCost: 5.2, shippingDays: 15, suggestedRetail: 25 },
  { id: 'kt-tea-towels', title: 'Linen Tea Towels', category: 'kitchen', country: 'Turkey', productCost: 6.4, shippingCost: 3.3, shippingDays: 11, suggestedRetail: 22 },
  { id: 'kt-coffee-mill', title: 'Hand Coffee Mill', category: 'kitchen', country: 'Japan', productCost: 16.5, shippingCost: 6.2, shippingDays: 10, suggestedRetail: 54 },
  { id: 'kt-spatulas', title: 'Silicone Spatula Set', category: 'kitchen', country: 'Taiwan', productCost: 4.8, shippingCost: 2.7, shippingDays: 12, suggestedRetail: 18 },
  { id: 'kt-mixing-bowls', title: 'Nested Mixing Bowls', category: 'kitchen', country: 'Poland', productCost: 13.6, shippingCost: 7.8, shippingDays: 7, suggestedRetail: 29 },
  { id: 'kt-herb-shears', title: 'Herb Shears', category: 'kitchen', country: 'Spain', productCost: 7.9, shippingCost: 3.6, shippingDays: 6, suggestedRetail: 27 },
]
