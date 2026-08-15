const products = [
  { 
    id: "maggi-noodles", 
    name: "Maggi Noodles", 
    unit: "70 g", 
    price: 15, 
    mrp: 18, 
    images: [
      "https://images.unsplash.com/photo-1612929633738-8c10ad4f34f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582418702059-97ebdcb3ca4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Noodles",
    desc: "Instant masala noodles. Ready in just 2 minutes. Perfect for a quick and tasty meal.",
    isOffer: true 
  },
  { 
    id: "fortune-basmati-rice", 
    name: "Fortune Basmati Rice", 
    images: [
      "https://images.unsplash.com/photo-1586201375761-2762d7e4d930?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Rice",
    desc: "Premium Fortune Basmati Rice. Buy 1 Get 1 Free! Or get half rate if you only need one 1kg pack.",
    variants: [
      { unit: "1 Pack (Half Rate)", price: 140, mrp: 280 },
      { unit: "2 Packs (Buy 1 Get 1)", price: 280, mrp: 560 }
    ],
    isOffer: true
  },
  { 
    id: "chandtara-rice", 
    name: "Chandtara Rice", 
    images: [
      "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Rice",
    desc: "High quality Chandtara rice. Perfect for daily cooking and soft texture.",
    customPricePerKg: 60,
    variants: [
      { unit: "1 kg", price: 60 },
      { unit: "5 kg", price: 290 },
      { unit: "10 kg", price: 550 }
    ]
  },
  { 
    id: "abbahuzzur-rice", 
    name: "Abbahuzzur Rice", 
    images: [
      "https://images.unsplash.com/photo-1599909533730-1c4a0c7f97c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Rice",
    desc: "Special Abbahuzzur rice, known for its unique aroma and taste. Aged to perfection.",
    customPricePerKg: 75,
    variants: [
      { unit: "1 kg", price: 75 },
      { unit: "5 kg", price: 360 }
    ]
  },
  { 
    id: "tata-salt", 
    name: "Tata Salt", 
    unit: "1 kg", 
    price: 28, 
    images: [
      "https://images.unsplash.com/photo-1616462823505-56b4f0d1e3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Masale",
    desc: "Described as the salt of the nation. Essential for every kitchen."
  },
  { 
    id: "madhur-sugar", 
    name: "Madhur Sugar", 
    unit: "1 kg", 
    price: 45, 
    images: [
      "https://images.unsplash.com/photo-1616462823505-56b4f0d1e3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Sugar",
    desc: "Pure and hygienic refined sugar for your daily needs."
  },
  { 
    id: "tata-tea-premium", 
    name: "Tata Tea Premium", 
    unit: "500 g", 
    price: 230, 
    mrp: 260, 
    images: [
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Tea & Coffee",
    desc: "Strong and refreshing tea for your morning cup.",
    isOffer: true 
  },
  { 
    id: "nescafe-classic-coffee", 
    name: "Nescafe Classic Coffee", 
    unit: "100 g", 
    price: 250, 
    mrp: 280, 
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Tea & Coffee",
    desc: "Rich aroma and taste of pure instant coffee."
  },
  { 
    id: "parle-g-biscuits", 
    name: "Parle-G Biscuits", 
    unit: "100 g", 
    price: 10, 
    images: [
      "https://images.unsplash.com/photo-1587026530560-9c8c63b3e7b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Biscuits",
    desc: "The classic glucose biscuit loved by all."
  },
  { 
    id: "oreo-chocolate", 
    name: "Oreo Chocolate", 
    unit: "120 g", 
    price: 40, 
    mrp: 45, 
    images: [
      "https://images.unsplash.com/photo-1587026530560-9c8c63b3e7b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Biscuits",
    desc: "Chocolate sandwich cookies with a creamy center."
  },
  { 
    id: "coca-cola-pet-bottle", 
    name: "Coca-Cola Pet Bottle", 
    unit: "750 ml", 
    price: 38, 
    mrp: 40, 
    images: [
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Cold Drinks",
    desc: "Refreshing cola to chill your day."
  },
  { 
    id: "amul-vanilla-magic", 
    name: "Amul Vanilla Magic", 
    unit: "700 ml", 
    price: 250, 
    mrp: 300, 
    images: [
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Ice Cream",
    desc: "Classic vanilla ice cream made from pure milk.",
    isOffer: true 
  },
  { 
    id: "premium-dryfruits-mix", 
    name: "Premium Dryfruits Mix", 
    images: [
      "https://images.unsplash.com/photo-1536591375634-83d8f6a8f8f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Dry Fruits",
    desc: "A healthy and delicious mix of premium cashews, almonds, and raisins.",
    customPricePerKg: 1200,
    variants: [
      { unit: "250 g", price: 300, mrp: 350 },
      { unit: "500 g", price: 550, mrp: 650 }
    ],
    isOffer: true
  },
  { 
    id: "fortune-sunflower-oil", 
    name: "Fortune Sunflower Oil", 
    unit: "1 L", 
    price: 130, 
    mrp: 150, 
    images: [
      "https://images.unsplash.com/photo-1616462823505-56b4f0d1e3e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ], 
    cat: "Pantry",
    desc: "Refined sunflower oil for healthy cooking."
  }
];
