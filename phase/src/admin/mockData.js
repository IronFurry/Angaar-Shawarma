// ── Angaar Shawarma — Admin Mock Data ──────────────────────────────────────

/**
 * USE_LIVE_DATA — toggle between live backend and static mock data.
 * Set to `false` to develop offline or test with predictable data.
 */
export const USE_LIVE_DATA = true;


export const BRANCHES = [
  { id: 'b1', name: 'Vasai Gaon (Main)', short: 'Vasai Gaon', city: 'Vasai', address: 'Shop 12, Main Market Rd, Vasai Gaon, Vasai-401202', phone: '+91 98765 43210', manager: 'Rajan Mehta', rating: 4.7, color: '#ff6b35' },
  { id: 'b2', name: 'Vasai West (2.0)', short: 'Vasai West', city: 'Vasai', address: 'Plot 5, Station Rd, Vasai West-401201', phone: '+91 98765 43211', manager: 'Priya Shah', rating: 4.5, color: '#e94560' },
  { id: 'b3', name: 'Nallasopara', short: 'Nallasopara', city: 'Nallasopara', address: 'Opp. Railway Station, Nallasopara East-401209', phone: '+91 98765 43212', manager: 'Suresh Patil', rating: 4.3, color: '#7c3aed' },
  { id: 'b4', name: 'Virar', short: 'Virar', city: 'Virar', address: 'Shop 8, Virar West Market-401303', phone: '+91 98765 43213', manager: 'Kavita Nair', rating: 4.6, color: '#0891b2' },
];

export const MENU_ITEMS = [
  { id: 'm1', name: 'Angaar Classic Shawarma', category: 'Shawarma', price: 149, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: true, isNew: false, description: 'Tender chicken marinated in angaar spices, wrapped in fresh pita', totalSold: 2847 },
  { id: 'm2', name: 'Double Decker Shawarma', category: 'Shawarma', price: 199, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: true, isNew: false, description: 'Double the meat, double the flavor', totalSold: 1923 },
  { id: 'm3', name: 'Angaar Platter', category: 'Platters', price: 499, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: false, description: 'Sharing platter with 3 shawarmas + fries + drinks', totalSold: 876 },
  { id: 'm4', name: 'Crispy Fries', category: 'Sides', price: 79, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: false, description: 'Golden crispy fries with special seasoning', totalSold: 3201 },
  { id: 'm5', name: 'Garlic Mayo Dip', category: 'Sides', price: 39, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: false, description: 'House-made garlic mayo', totalSold: 1542 },
  { id: 'm6', name: 'Angaar Burger', category: 'Burgers', price: 169, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: true, description: 'Signature shawarma-style chicken burger', totalSold: 421 },
  { id: 'm7', name: 'Fresh Lemonade', category: 'Drinks', price: 69, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: false, description: 'Fresh squeezed with mint', totalSold: 987 },
  { id: 'm8', name: 'Mango Shake', category: 'Drinks', price: 99, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: false, bestSeller: false, isNew: false, description: 'Thick Alphonso mango shake', totalSold: 654 },
  { id: 'm9', name: 'Cheese Shawarma', category: 'Shawarma', price: 179, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: true, description: 'Extra cheese loaded shawarma', totalSold: 312 },
  { id: 'm10', name: 'Veg Shawarma', category: 'Shawarma', price: 119, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', available: true, bestSeller: false, isNew: false, description: 'Fresh veggies in our secret marinade', totalSold: 534 },
];

export const CUSTOMERS = [
  { id: 'c1', name: 'Arjun Sharma', phone: '98765-43210', email: 'arjun@email.com', totalOrders: 47, lifetimeSpend: 6203, avgOrderValue: 132, lastOrder: '2026-06-29', favoriteItem: 'Angaar Classic Shawarma', preferredBranch: 'Vasai Gaon', loyaltyPoints: 620, referrals: 5, segment: 'VIP', joinDate: '2024-03-12' },
  { id: 'c2', name: 'Priya Patel', phone: '87654-32109', email: 'priya@email.com', totalOrders: 32, lifetimeSpend: 4128, avgOrderValue: 129, lastOrder: '2026-06-28', favoriteItem: 'Double Decker Shawarma', preferredBranch: 'Vasai West', loyaltyPoints: 412, referrals: 3, segment: 'Returning', joinDate: '2024-07-22' },
  { id: 'c3', name: 'Rahul Verma', phone: '76543-21098', email: '', totalOrders: 12, lifetimeSpend: 1548, avgOrderValue: 129, lastOrder: '2026-06-25', favoriteItem: 'Crispy Fries', preferredBranch: 'Nallasopara', loyaltyPoints: 154, referrals: 1, segment: 'Returning', joinDate: '2025-01-08' },
  { id: 'c4', name: 'Sneha Joshi', phone: '65432-10987', email: 'sneha@email.com', totalOrders: 3, lifetimeSpend: 387, avgOrderValue: 129, lastOrder: '2026-06-30', favoriteItem: 'Angaar Classic Shawarma', preferredBranch: 'Virar', loyaltyPoints: 38, referrals: 0, segment: 'New', joinDate: '2026-06-01' },
  { id: 'c5', name: 'Amit Kumar', phone: '54321-09876', email: 'amit@email.com', totalOrders: 78, lifetimeSpend: 11234, avgOrderValue: 144, lastOrder: '2026-06-30', favoriteItem: 'Angaar Platter', preferredBranch: 'Vasai Gaon', loyaltyPoints: 1123, referrals: 12, segment: 'VIP', joinDate: '2023-11-05' },
  { id: 'c6', name: 'Nisha Singh', phone: '43210-98765', email: 'nisha@email.com', totalOrders: 1, lifetimeSpend: 149, avgOrderValue: 149, lastOrder: '2025-12-15', favoriteItem: 'Angaar Classic Shawarma', preferredBranch: 'Vasai West', loyaltyPoints: 14, referrals: 0, segment: 'Inactive', joinDate: '2025-12-01' },
  { id: 'c7', name: 'Deepak Raj', phone: '32109-87654', email: '', totalOrders: 55, lifetimeSpend: 8450, avgOrderValue: 153, lastOrder: '2026-06-29', favoriteItem: 'Double Decker Shawarma', preferredBranch: 'Vasai Gaon', loyaltyPoints: 845, referrals: 8, segment: 'High Spender', joinDate: '2024-02-18' },
  { id: 'c8', name: 'Kavita Nair', phone: '21098-76543', email: 'kavita@email.com', totalOrders: 28, lifetimeSpend: 3892, avgOrderValue: 139, lastOrder: '2026-06-27', favoriteItem: 'Cheese Shawarma', preferredBranch: 'Virar', loyaltyPoints: 389, referrals: 2, segment: 'Returning', joinDate: '2024-09-14' },
  { id: 'c9', name: 'Rohan Desai', phone: '10987-65432', email: 'rohan@email.com', totalOrders: 2, lifetimeSpend: 298, avgOrderValue: 149, lastOrder: '2026-06-30', favoriteItem: 'Veg Shawarma', preferredBranch: 'Nallasopara', loyaltyPoints: 29, referrals: 0, segment: 'New', joinDate: '2026-06-20' },
  { id: 'c10', name: 'Ananya Gupta', phone: '09876-54321', email: 'ananya@email.com', totalOrders: 91, lifetimeSpend: 14280, avgOrderValue: 156, lastOrder: '2026-06-30', favoriteItem: 'Angaar Platter', preferredBranch: 'Vasai West', loyaltyPoints: 1428, referrals: 18, segment: 'VIP', joinDate: '2023-08-30' },
];

export const ORDERS = [
  { id: 'o1', orderId: 'AGR-2847', customer: 'Arjun Sharma', phone: '98765-43210', branch: 'Vasai Gaon (Main)', items: [{ name: 'Angaar Classic Shawarma', qty: 2, price: 149 }, { name: 'Crispy Fries', qty: 1, price: 79 }], amount: 377, paymentStatus: 'Paid', paymentMethod: 'UPI', orderStatus: 'Delivered', orderType: 'Delivery', address: 'House 12, MG Road, Vasai', time: '2026-06-30T14:30:00', specialInstructions: 'Extra garlic sauce please', timeline: [{ status: 'Placed', time: '14:30' }, { status: 'Confirmed', time: '14:32' }, { status: 'Preparing', time: '14:35' }, { status: 'Ready', time: '14:52' }, { status: 'Delivered', time: '15:10' }] },
  { id: 'o2', orderId: 'AGR-2848', customer: 'Priya Patel', phone: '87654-32109', branch: 'Vasai West (2.0)', items: [{ name: 'Double Decker Shawarma', qty: 1, price: 199 }, { name: 'Mango Shake', qty: 2, price: 99 }], amount: 397, paymentStatus: 'Paid', paymentMethod: 'Card', orderStatus: 'Preparing', orderType: 'Takeaway', address: '', time: '2026-06-30T15:10:00', specialInstructions: '', timeline: [{ status: 'Placed', time: '15:10' }, { status: 'Confirmed', time: '15:12' }, { status: 'Preparing', time: '15:14' }] },
  { id: 'o3', orderId: 'AGR-2849', customer: 'Rahul Verma', phone: '76543-21098', branch: 'Nallasopara', items: [{ name: 'Angaar Classic Shawarma', qty: 3, price: 149 }, { name: 'Garlic Mayo Dip', qty: 2, price: 39 }], amount: 525, paymentStatus: 'Pending', paymentMethod: 'COD', orderStatus: 'Pending', orderType: 'Delivery', address: '45, Station Road, Nallasopara East', time: '2026-06-30T15:25:00', specialInstructions: 'Ring the bell twice', timeline: [{ status: 'Placed', time: '15:25' }] },
  { id: 'o4', orderId: 'AGR-2850', customer: 'Amit Kumar', phone: '54321-09876', branch: 'Vasai Gaon (Main)', items: [{ name: 'Angaar Platter', qty: 2, price: 499 }], amount: 998, paymentStatus: 'Paid', paymentMethod: 'UPI', orderStatus: 'Ready', orderType: 'Takeaway', address: '', time: '2026-06-30T15:00:00', specialInstructions: 'No onions', timeline: [{ status: 'Placed', time: '15:00' }, { status: 'Confirmed', time: '15:02' }, { status: 'Preparing', time: '15:05' }, { status: 'Ready', time: '15:28' }] },
  { id: 'o5', orderId: 'AGR-2851', customer: 'Sneha Joshi', phone: '65432-10987', branch: 'Virar', items: [{ name: 'Cheese Shawarma', qty: 1, price: 179 }, { name: 'Fresh Lemonade', qty: 1, price: 69 }], amount: 248, paymentStatus: 'Paid', paymentMethod: 'UPI', orderStatus: 'Out for Delivery', orderType: 'Delivery', address: '78, Virar West Colony', time: '2026-06-30T14:55:00', specialInstructions: '', timeline: [{ status: 'Placed', time: '14:55' }, { status: 'Confirmed', time: '14:57' }, { status: 'Preparing', time: '15:00' }, { status: 'Ready', time: '15:20' }, { status: 'Out for Delivery', time: '15:22' }] },
  { id: 'o6', orderId: 'AGR-2845', customer: 'Deepak Raj', phone: '32109-87654', branch: 'Vasai Gaon (Main)', items: [{ name: 'Double Decker Shawarma', qty: 2, price: 199 }, { name: 'Crispy Fries', qty: 2, price: 79 }], amount: 556, paymentStatus: 'Paid', paymentMethod: 'Card', orderStatus: 'Cancelled', orderType: 'Delivery', address: '22, Palm Street, Vasai', time: '2026-06-30T13:15:00', specialInstructions: '', timeline: [{ status: 'Placed', time: '13:15' }, { status: 'Cancelled', time: '13:18' }] },
  { id: 'o7', orderId: 'AGR-2844', customer: 'Kavita Nair', phone: '21098-76543', branch: 'Virar', items: [{ name: 'Veg Shawarma', qty: 2, price: 119 }, { name: 'Garlic Mayo Dip', qty: 1, price: 39 }], amount: 277, paymentStatus: 'Paid', paymentMethod: 'UPI', orderStatus: 'Delivered', orderType: 'Takeaway', address: '', time: '2026-06-30T12:40:00', specialInstructions: '', timeline: [{ status: 'Placed', time: '12:40' }, { status: 'Confirmed', time: '12:42' }, { status: 'Preparing', time: '12:44' }, { status: 'Ready', time: '13:00' }, { status: 'Delivered', time: '13:00' }] },
  { id: 'o8', orderId: 'AGR-2843', customer: 'Ananya Gupta', phone: '09876-54321', branch: 'Vasai West (2.0)', items: [{ name: 'Angaar Platter', qty: 1, price: 499 }, { name: 'Mango Shake', qty: 2, price: 99 }], amount: 697, paymentStatus: 'Paid', paymentMethod: 'Card', orderStatus: 'Delivered', orderType: 'Delivery', address: 'Flat 4B, Sunshine Apts, Vasai West', time: '2026-06-30T11:30:00', specialInstructions: 'Extra napkins please', timeline: [{ status: 'Placed', time: '11:30' }, { status: 'Confirmed', time: '11:32' }, { status: 'Preparing', time: '11:35' }, { status: 'Ready', time: '12:05' }, { status: 'Delivered', time: '12:28' }] },
];

export const EMPLOYEES = [
  { id: 'e1', name: 'Rajan Mehta', role: 'Branch Manager', branch: 'Vasai Gaon (Main)', ordersToday: 0, avgPrepTime: 18, attendance: 'Present', rating: 4.8, avatar: 'RM', joinDate: '2022-01-15', phone: '98765-11111', experience: '4 yrs' },
  { id: 'e2', name: 'Vikram Soni', role: 'Head Chef', branch: 'Vasai Gaon (Main)', ordersToday: 42, avgPrepTime: 14, attendance: 'Present', rating: 4.9, avatar: 'VS', joinDate: '2022-03-01', phone: '98765-22222', experience: '3 yrs' },
  { id: 'e3', name: 'Suresh Patil', role: 'Branch Manager', branch: 'Nallasopara', ordersToday: 0, avgPrepTime: 20, attendance: 'Present', rating: 4.5, avatar: 'SP', joinDate: '2023-06-01', phone: '98765-33333', experience: '3 yrs' },
  { id: 'e4', name: 'Priya Shah', role: 'Branch Manager', branch: 'Vasai West (2.0)', ordersToday: 0, avgPrepTime: 17, attendance: 'Present', rating: 4.6, avatar: 'PS', joinDate: '2022-08-15', phone: '98765-44444', experience: '4 yrs' },
  { id: 'e5', name: 'Mohan Tiwari', role: 'Chef', branch: 'Vasai West (2.0)', ordersToday: 38, avgPrepTime: 16, attendance: 'Present', rating: 4.4, avatar: 'MT', joinDate: '2023-02-20', phone: '98765-55555', experience: '3 yrs' },
  { id: 'e6', name: 'Kavita Nair', role: 'Branch Manager', branch: 'Virar', ordersToday: 0, avgPrepTime: 19, attendance: 'Present', rating: 4.7, avatar: 'KN', joinDate: '2023-04-10', phone: '98765-66666', experience: '3 yrs' },
  { id: 'e7', name: 'Ankit Rao', role: 'Delivery Executive', branch: 'Vasai Gaon (Main)', ordersToday: 22, avgPrepTime: 0, attendance: 'Present', rating: 4.6, avatar: 'AR', joinDate: '2024-01-05', phone: '98765-77777', experience: '2 yrs' },
  { id: 'e8', name: 'Sumit Jain', role: 'Chef', branch: 'Nallasopara', ordersToday: 31, avgPrepTime: 21, attendance: 'Late', rating: 4.2, avatar: 'SJ', joinDate: '2023-09-12', phone: '98765-88888', experience: '3 yrs' },
  { id: 'e9', name: 'Ritu Verma', role: 'Cashier', branch: 'Virar', ordersToday: 45, avgPrepTime: 0, attendance: 'Present', rating: 4.7, avatar: 'RV', joinDate: '2024-03-20', phone: '98765-99999', experience: '2 yrs' },
  { id: 'e10', name: 'Farhan Khan', role: 'Delivery Executive', branch: 'Vasai West (2.0)', ordersToday: 19, avgPrepTime: 0, attendance: 'Absent', rating: 3.9, avatar: 'FK', joinDate: '2024-06-01', phone: '98765-00000', experience: '1 yr' },
];

export const REVIEWS = [
  { id: 'r1', customer: 'Arjun Sharma', rating: 5, date: '2026-06-29', branch: 'Vasai Gaon (Main)', text: 'Best shawarma in Vasai! The Angaar Classic is absolutely mind-blowing. The spices are perfectly balanced and the chicken is so tender. Will order again and again! 🌯🔥', pinned: true, hidden: false, reply: 'Thank you Arjun bhai! Your support means the world to us! 🙏', color: '#fef9c3' },
  { id: 'r2', customer: 'Priya Patel', rating: 4, date: '2026-06-28', branch: 'Vasai West (2.0)', text: 'Loved the double decker! Filling and tasty. Delivery was a bit slow but the food was worth the wait. 😊', pinned: false, hidden: false, reply: '', color: '#dcfce7' },
  { id: 'r3', customer: 'Amit Kumar', rating: 5, date: '2026-06-27', branch: 'Vasai Gaon (Main)', text: 'The Angaar Platter is perfect for our family get-togethers. Everyone loves it. The garlic sauce is divine!', pinned: false, hidden: false, reply: '', color: '#ffe4e6' },
  { id: 'r4', customer: 'Rohan Desai', rating: 3, date: '2026-06-26', branch: 'Nallasopara', text: 'Food is good but the packing could be better. The wraps were a bit soggy by the time it arrived. Hope they improve.', pinned: false, hidden: false, reply: 'Hi Rohan, we\'re sorry about the experience! We\'re upgrading our packaging. Thank you for the feedback!', color: '#e0f2fe' },
  { id: 'r5', customer: 'Ananya Gupta', rating: 5, date: '2026-06-25', branch: 'Vasai West (2.0)', text: 'I\'ve been a regular for over 2 years and the quality has never dropped. The team at Vasai West is so warm and friendly. 10/10!', pinned: true, hidden: false, reply: 'Ananya didi you\'re our star customer! 🌟 Thank you so much!', color: '#fdf4ff' },
  { id: 'r6', customer: 'Kavita Nair', rating: 4, date: '2026-06-24', branch: 'Virar', text: 'Fresh and hot delivery! The cheese shawarma is new and absolutely delicious. Please keep it on the menu! 🧀', pinned: false, hidden: false, reply: '', color: '#fff7ed' },
];

export const INVENTORY = [
  { id: 'i1', ingredient: 'Chicken Breast', currentStock: 45, unit: 'kg', minStock: 20, supplier: 'Fresh Farms Co.', lastRestocked: '2026-06-28', daysRemaining: 3, category: 'Protein' },
  { id: 'i2', ingredient: 'Pita Bread', currentStock: 320, unit: 'pcs', minStock: 100, supplier: 'Bakery Direct', lastRestocked: '2026-06-30', daysRemaining: 5, category: 'Bread' },
  { id: 'i3', ingredient: 'Garlic Sauce', currentStock: 8, unit: 'L', minStock: 10, supplier: 'Sauce Masters', lastRestocked: '2026-06-25', daysRemaining: 1, category: 'Sauce' },
  { id: 'i4', ingredient: 'Shawarma Spice Mix', currentStock: 2.5, unit: 'kg', minStock: 3, supplier: 'Spice Route India', lastRestocked: '2026-06-20', daysRemaining: 1, category: 'Spices' },
  { id: 'i5', ingredient: 'Tomatoes', currentStock: 30, unit: 'kg', minStock: 15, supplier: 'Local Market', lastRestocked: '2026-06-30', daysRemaining: 4, category: 'Vegetables' },
  { id: 'i6', ingredient: 'Onions', currentStock: 25, unit: 'kg', minStock: 10, supplier: 'Local Market', lastRestocked: '2026-06-29', daysRemaining: 6, category: 'Vegetables' },
  { id: 'i7', ingredient: 'Cheese Slices', currentStock: 5, unit: 'kg', minStock: 8, supplier: 'Dairy Best', lastRestocked: '2026-06-27', daysRemaining: 2, category: 'Dairy' },
  { id: 'i8', ingredient: 'Potatoes (Fries)', currentStock: 80, unit: 'kg', minStock: 30, supplier: 'Fresh Farms Co.', lastRestocked: '2026-06-29', daysRemaining: 7, category: 'Vegetables' },
  { id: 'i9', ingredient: 'Mango Pulp', currentStock: 12, unit: 'L', minStock: 5, supplier: 'Fruit Wholesale', lastRestocked: '2026-06-28', daysRemaining: 5, category: 'Fruits' },
  { id: 'i10', ingredient: 'Cooking Oil', currentStock: 40, unit: 'L', minStock: 20, supplier: 'Oil Depot', lastRestocked: '2026-06-25', daysRemaining: 8, category: 'Oils' },
];

export const COUPONS = [
  { id: 'cp1', code: 'ANGAAR20', type: 'Percentage', discount: 20, minOrder: 200, maxUses: 500, used: 247, expiry: '2026-07-31', branch: 'All', active: true },
  { id: 'cp2', code: 'WELCOME50', type: 'Flat', discount: 50, minOrder: 149, maxUses: 1000, used: 823, expiry: '2026-12-31', branch: 'All', active: true },
  { id: 'cp3', code: 'VIRAR10', type: 'Percentage', discount: 10, minOrder: 0, maxUses: 200, used: 134, expiry: '2026-07-15', branch: 'Virar', active: true },
  { id: 'cp4', code: 'MONSOON30', type: 'Flat', discount: 30, minOrder: 300, maxUses: 300, used: 300, expiry: '2026-06-15', branch: 'All', active: false },
  { id: 'cp5', code: 'BDAY100', type: 'Flat', discount: 100, minOrder: 400, maxUses: 0, used: 45, expiry: '2026-12-31', branch: 'All', active: true },
];

export const CAMPAIGNS = [
  { id: 'cam1', name: 'Monsoon Special Offer', target: 'Returning Customers', sent: 2340, opened: 1560, redeemed: 487, date: '2026-06-15', status: 'Completed' },
  { id: 'cam2', name: 'VIP Exclusive Platter Deal', target: 'VIP Customers', sent: 450, opened: 412, redeemed: 289, date: '2026-06-20', status: 'Completed' },
  { id: 'cam3', name: 'Win Back Inactive Users', target: 'Inactive Customers', sent: 820, opened: 310, redeemed: 98, date: '2026-06-25', status: 'Completed' },
  { id: 'cam4', name: 'Birthday Month Treat', target: 'Birthday Customers', sent: 67, opened: 61, redeemed: 55, date: '2026-06-30', status: 'Active' },
];

// ── Chart Data ──────────────────────────────────────────────────────────────
export const REVENUE_DAILY = [
  { label: 'Mon', revenue: 18420, orders: 124 },
  { label: 'Tue', revenue: 21350, orders: 143 },
  { label: 'Wed', revenue: 19800, orders: 133 },
  { label: 'Thu', revenue: 24100, orders: 162 },
  { label: 'Fri', revenue: 31200, orders: 209 },
  { label: 'Sat', revenue: 38700, orders: 260 },
  { label: 'Sun', revenue: 35400, orders: 238 },
];

export const REVENUE_WEEKLY = [
  { label: 'W1 Jun', revenue: 142000, orders: 952 },
  { label: 'W2 Jun', revenue: 168000, orders: 1127 },
  { label: 'W3 Jun', revenue: 175000, orders: 1173 },
  { label: 'W4 Jun', revenue: 189000, orders: 1269 },
];

export const REVENUE_MONTHLY = [
  { label: 'Jan', revenue: 580000, orders: 3891 },
  { label: 'Feb', revenue: 520000, orders: 3488 },
  { label: 'Mar', revenue: 630000, orders: 4224 },
  { label: 'Apr', revenue: 710000, orders: 4762 },
  { label: 'May', revenue: 695000, orders: 4664 },
  { label: 'Jun', revenue: 748000, orders: 5020 },
];

export const PEAK_HOURS = [
  { hour: '10 AM', orders: 12 }, { hour: '11 AM', orders: 28 }, { hour: '12 PM', orders: 67 },
  { hour: '1 PM', orders: 89 }, { hour: '2 PM', orders: 72 }, { hour: '3 PM', orders: 45 },
  { hour: '4 PM', orders: 38 }, { hour: '5 PM', orders: 52 }, { hour: '6 PM', orders: 78 },
  { hour: '7 PM', orders: 94 }, { hour: '8 PM', orders: 108 }, { hour: '9 PM', orders: 87 },
  { hour: '10 PM', orders: 56 }, { hour: '11 PM', orders: 31 },
];

export const BRANCH_PERFORMANCE = [
  { branch: 'Vasai Gaon', revenue: 285000, orders: 1912, rating: 4.7, employees: 12, avgPrepTime: 16 },
  { branch: 'Vasai West', revenue: 198000, orders: 1328, rating: 4.5, employees: 9, avgPrepTime: 18 },
  { branch: 'Nallasopara', revenue: 162000, orders: 1087, rating: 4.3, employees: 8, avgPrepTime: 21 },
  { branch: 'Virar', revenue: 103000, orders: 693, rating: 4.6, employees: 7, avgPrepTime: 19 },
];

export const CUSTOMER_GROWTH = [
  { month: 'Jan', new: 142, returning: 389 }, { month: 'Feb', new: 128, returning: 412 },
  { month: 'Mar', new: 198, returning: 456 }, { month: 'Apr', new: 231, returning: 489 },
  { month: 'May', new: 187, returning: 523 }, { month: 'Jun', new: 264, returning: 571 },
];

export const PAYMENT_METHODS = [
  { name: 'UPI', value: 58, color: '#ff6b35' },
  { name: 'Card', value: 24, color: '#7c3aed' },
  { name: 'COD', value: 18, color: '#0891b2' },
];

// ── KPI Summary ─────────────────────────────────────────────────────────────
export const KPI_DATA = {
  todayRevenue: 35400,
  todayOrders: 238,
  pendingOrders: 12,
  completedOrders: 218,
  cancelledOrders: 8,
  avgOrderValue: 148.7,
  returningCustomerPct: 67.3,
  satisfactionRating: 4.6,
};
