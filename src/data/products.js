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
  'Fresh Cream Cakes',
  'Customized Cakes',
  'Ooty Special Bakery',
  'Homemade Chocolates',
  'Desserts',
  'Beverages',
  'Ooty Special Products',
]

export const PRODUCTS = [
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

  // ---------------- CUSTOMIZED CAKES ----------------
  { id: 15, name: 'Customized Birthday Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 16, name: 'Theme Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 17, name: 'Photo Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 18, name: 'Anniversary Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 19, name: 'Wedding Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 20, name: 'Baby Shower Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 21, name: 'Engagement Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 22, name: "Kids' Character Cakes", category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 23, name: 'Number Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  { id: 24, name: 'Alphabet Cakes', category: 'Customized Cakes', img: PLACEHOLDER },
  {
    id: 25,
    name: 'Eggless Customized Cakes',
    category: 'Customized Cakes',
    badge: 'On Request',
    img: PLACEHOLDER,
  },

  // ---------------- OOTY SPECIAL BAKERY ITEMS ----------------
  { id: 26, name: 'Normal Varkey', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 27, name: 'Ghee Varkey', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 28, name: 'Brown Sugar Varkey', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 29, name: 'Masala Varkey', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 30, name: 'Salt Cookies', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 31, name: 'Sweet Cookies', category: 'Ooty Special Bakery', img: PLACEHOLDER },
  { id: 32, name: 'Peanut Cookies', category: 'Ooty Special Bakery', img: PLACEHOLDER },

  // ---------------- HOMEMADE CHOCOLATES ----------------
  {
    id: 33,
    name: 'Assorted Homemade Chocolates',
    category: 'Homemade Chocolates',
    img: PLACEHOLDER,
  },

  // ---------------- DESSERTS ----------------
  { id: 34, name: 'Brownies', category: 'Desserts', img: PLACEHOLDER },
  { id: 35, name: 'Brownie with Ice Cream', category: 'Desserts', img: PLACEHOLDER },
  { id: 36, name: 'Chocolate Lava Cake', category: 'Desserts', img: PLACEHOLDER },
  { id: 37, name: 'Carrot Cake', category: 'Desserts', img: PLACEHOLDER },
  { id: 38, name: 'Banana Cake', category: 'Desserts', img: PLACEHOLDER },
  { id: 39, name: 'Swiss Roll', category: 'Desserts', img: PLACEHOLDER },
  { id: 40, name: 'Mini Doughnuts', category: 'Desserts', img: PLACEHOLDER },
  { id: 41, name: 'Rich Plum Cake', category: 'Desserts', img: PLACEHOLDER },

  // ---------------- BEVERAGES ----------------
  { id: 42, name: 'Seasonal Fresh Juices', category: 'Beverages', img: PLACEHOLDER },
  { id: 43, name: 'Chocolate Milkshake', category: 'Beverages', img: PLACEHOLDER },
  { id: 44, name: 'Strawberry Milkshake', category: 'Beverages', img: PLACEHOLDER },
  { id: 45, name: 'Vanilla Milkshake', category: 'Beverages', img: PLACEHOLDER },
  { id: 46, name: 'Oreo Milkshake', category: 'Beverages', img: PLACEHOLDER },
  { id: 47, name: 'Butterscotch Milkshake', category: 'Beverages', img: PLACEHOLDER },
  { id: 48, name: 'Mango Milkshake', category: 'Beverages', badge: 'Seasonal', img: PLACEHOLDER },
  { id: 49, name: 'Hot Chocolate', category: 'Beverages', img: PLACEHOLDER },

  // ---------------- OOTY SPECIAL PRODUCTS ----------------
  { id: 50, name: 'Tea Powder', category: 'Ooty Special Products', img: PLACEHOLDER },
  { id: 51, name: 'Eucalyptus Oil', category: 'Ooty Special Products', img: PLACEHOLDER },
  { id: 52, name: 'Joint Pain Oil', category: 'Ooty Special Products', img: PLACEHOLDER },
  { id: 53, name: 'Migraine Oil', category: 'Ooty Special Products', img: PLACEHOLDER },
]
