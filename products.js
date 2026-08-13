const products = [
  { 
    id: "p1", 
    name: "Maggi Noodles", 
    unit: "70 g", 
    price: 15, 
    mrp: 18, 
    img: "https://5.imimg.com/data5/SELLER/Default/2023/11/363459181/WU/HF/DP/158100183/maggi-1.jpg", 
    cat: "Snacks",
    desc: "Instant masala noodles. Ready in just 2 minutes. Perfect for a quick and tasty meal."
  },
  { 
    id: "p2", 
    name: "Fortune Basmati Rice", 
    img: "https://images.unsplash.com/photo-1586201375761-2762d7e4d930?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Pantry",
    desc: "Premium Fortune Basmati Rice. Buy 1 Get 1 Free! Or get half rate if you only need one 1kg pack.",
    variants: [
      { unit: "1 Pack (Half Rate)", price: 140, mrp: 280 },
      { unit: "2 Packs (Buy 1 Get 1)", price: 280, mrp: 560 }
    ]
  },
  { 
    id: "p3", 
    name: "Chandtara Rice", 
    img: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Pantry",
    desc: "High quality Chandtara rice. Perfect for daily cooking and soft texture.",
    customPricePerKg: 60,
    variants: [
      { unit: "1 kg", price: 60 },
      { unit: "5 kg", price: 290 },
      { unit: "10 kg", price: 550 }
    ]
  },
  { 
    id: "p4", 
    name: "Abbahuzzur Rice", 
    img: "https://images.unsplash.com/photo-1599909533730-1c4a0c7f97c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Pantry",
    desc: "Special Abbahuzzur rice, known for its unique aroma and taste. Aged to perfection.",
    customPricePerKg: 75,
    variants: [
      { unit: "1 kg", price: 75 },
      { unit: "5 kg", price: 360 }
    ]
  },
  { 
    id: "p5", 
    name: "Premium Dryfruits Mix", 
    img: "https://images.unsplash.com/photo-1536591375634-83d8f6a8f8f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
    cat: "Pantry",
    desc: "A healthy and delicious mix of premium cashews, almonds, and raisins. Rich in nutrients.",
    customPricePerKg: 1200,
    variants: [
      { unit: "250 g", price: 300, mrp: 350 },
      { unit: "500 g", price: 550, mrp: 650 }
    ]
  }
];
