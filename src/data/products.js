// Smiley Bakes — Kotagiri. Product catalog.
//
// IMAGE: all items currently share one static placeholder image.
// To use your own photos later:
//   1. Put image files in the  public/products/  folder
//   2. Change each item's `img` to e.g.  '/products/black-forest.jpg'
//      (or change PLACEHOLDER below to swap the single shared image)

export const PLACEHOLDER =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80'

// Formats a product's price for display, e.g. "₹650 / kg".
// Returns '' when the product shouldn't show a price (toggle off or no amount).
const UNIT_LABEL = { kg: 'kg', piece: 'piece', pack: 'pack' }
export function formatPrice(p) {
  if (!p?.show_price || p.price == null) return ''
  const amount = Number(p.price)
  if (Number.isNaN(amount)) return ''
  const rupees = `₹${amount % 1 === 0 ? amount : amount.toFixed(2)}`
  const unit = UNIT_LABEL[p.price_unit]
  return unit ? `${rupees} / ${unit}` : rupees
}

export const CATEGORIES = [
  'All',
  'Tea',
  'Coffee',
  'Milkshake',
  'Juice',
  'Dessert',
  'Fresh Cream Cakes',
  'Ooty Special Varkey',
  'Homemade Chocolate',
  'Nilgiri Oils',
  'Tea Powders',
]

export const PRODUCTS = [
  // ---------------- TEA ----------------
  { id: 54, name: 'Tea', category: 'Tea', img: PLACEHOLDER },

  // ---------------- COFFEE ----------------
  { id: 55, name: 'Coffee', category: 'Coffee', img: PLACEHOLDER },

  // ---------------- MILKSHAKE ----------------
  { id: 43, name: 'Chocolate Milkshake', category: 'Milkshake', img: PLACEHOLDER },
  { id: 44, name: 'Strawberry Milkshake', category: 'Milkshake', img: PLACEHOLDER },
  { id: 45, name: 'Vanilla Milkshake', category: 'Milkshake', img: PLACEHOLDER },
  { id: 46, name: 'Oreo Milkshake', category: 'Milkshake', img: PLACEHOLDER },
  { id: 47, name: 'Butterscotch Milkshake', category: 'Milkshake', img: PLACEHOLDER },
  { id: 48, name: 'Mango Milkshake', category: 'Milkshake', badge: 'Seasonal', img: PLACEHOLDER },

  // ---------------- JUICE ----------------
  { id: 42, name: 'Seasonal Fresh Juices', category: 'Juice', img: PLACEHOLDER },

  // ---------------- DESSERT ----------------
  { id: 34, name: 'Brownies', category: 'Dessert', img: PLACEHOLDER },
  { id: 35, name: 'Brownie with Ice Cream', category: 'Dessert', img: PLACEHOLDER },
  { id: 36, name: 'Chocolate Lava Cake', category: 'Dessert', img: PLACEHOLDER },
  { id: 37, name: 'Carrot Cake', category: 'Dessert', img: PLACEHOLDER },
  { id: 38, name: 'Banana Cake', category: 'Dessert', img: PLACEHOLDER },
  { id: 39, name: 'Swiss Roll', category: 'Dessert', img: PLACEHOLDER },
  { id: 40, name: 'Mini Doughnuts', category: 'Dessert', img: PLACEHOLDER },
  { id: 41, name: 'Rich Plum Cake', category: 'Dessert', img: PLACEHOLDER },
  { id: 30, name: 'Salt Cookies', category: 'Dessert', img: PLACEHOLDER },
  { id: 31, name: 'Sweet Cookies', category: 'Dessert', img: PLACEHOLDER },
  { id: 32, name: 'Peanut Cookies', category: 'Dessert', img: PLACEHOLDER },

  // ---------------- FRESH CREAM CAKES ----------------
  { id: 1, name: 'Black Forest', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 2, name: 'White Forest', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 3, name: 'Chocolate Truffle', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 4, name: 'Red Velvet', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 5, name: 'Purple Velvet', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 6, name: 'Pista Velvet', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 7, name: 'Pista Truffle', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 8, name: 'Butterscotch', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 9, name: 'Blueberry', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 10, name: 'Strawberry', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 11, name: 'Pineapple', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 12, name: 'Black Currant', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 13, name: 'Choco Fantasy', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 14, name: 'Mousse Cup', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 15, name: 'Customized Birthday Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 16, name: 'Theme Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 17, name: 'Photo Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 18, name: 'Anniversary Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 19, name: 'Wedding Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 20, name: 'Baby Shower Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 21, name: 'Engagement Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 22, name: "Kids' Character Cakes", category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 23, name: 'Number Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  { id: 24, name: 'Alphabet Cakes', category: 'Fresh Cream Cakes', img: PLACEHOLDER },
  {
    id: 25,
    name: 'Eggless Customized Cakes',
    category: 'Fresh Cream Cakes',
    badge: 'On Request',
    img: PLACEHOLDER,
  },

  // ---------------- OOTY SPECIAL VARKEY ----------------
  { id: 26, name: 'Normal Varkey', category: 'Ooty Special Varkey', img: PLACEHOLDER },
  { id: 27, name: 'Ghee Varkey', category: 'Ooty Special Varkey', img: PLACEHOLDER },
  { id: 28, name: 'Brown Sugar Varkey', category: 'Ooty Special Varkey', img: PLACEHOLDER },
  { id: 29, name: 'Masala Varkey', category: 'Ooty Special Varkey', img: PLACEHOLDER },

  // ---------------- HOMEMADE CHOCOLATE ----------------
  {
    id: 33,
    name: 'Assorted Homemade Chocolates',
    category: 'Homemade Chocolate',
    img: PLACEHOLDER,
  },

  // ---------------- NILGIRI OILS ----------------
  { id: 51, name: 'Eucalyptus Oil', category: 'Nilgiri Oils', img: PLACEHOLDER },
  { id: 52, name: 'Joint Pain Oil', category: 'Nilgiri Oils', img: PLACEHOLDER },
  { id: 53, name: 'Migraine Oil', category: 'Nilgiri Oils', img: PLACEHOLDER },

  // ---------------- TEA POWDERS ----------------
  { id: 50, name: 'Tea Powder', category: 'Tea Powders', img: PLACEHOLDER },
]
