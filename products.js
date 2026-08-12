const products = [
  { 
    id: "p1", 
    name: "Maggi Noodles", 
    unit: "70 g", 
    price: 15, 
    mrp: 18, 
    img: "https://images.unsplash.com/photo-1612929633738-8c10ad4f34f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Snacks",
    desc: "Instant masala noodles. Ready in just 2 minutes. Perfect for a quick and tasty meal."
  },
  { 
    id: "p2", 
    name: "Premium Basmati Rice", 
    img: "https://images.unsplash.com/photo-1586201375761-2762d7e4d930?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Pantry",
    desc: "Aged long-grain basmati rice. Perfect for biryani and pulao. Aromatic and fluffy.",
    customPricePerKg: 150, // Used for custom weight calculation
    variants: [
      { unit: "250 g", price: 45, mrp: 50 },
      { unit: "500 g", price: 80, mrp: 95 },
      { unit: "1 kg", price: 150, mrp: 180 },
      { unit: "2 kg", price: 280, mrp: 320 },
      { unit: "5 kg", price: 650, mrp: 750 }
    ]
  }
];
