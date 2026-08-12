const products = [
  { 
    id: "p1", 
    name: "Maggi Noodles", 
    unit: "70 g", 
    price: 15, 
    mrp: 18, 
    img: "https://www.google.com/search?client=ms-android-vivo-rvo3&hs=RblV&sca_esv=0ca1614a8e79126c&sxsrf=APpeQnuZF2ioomzUn2xs5vhg-IFyEDWFUw:1786561254365&udm=2&fbs=ABfTbFXXq5_lq1-qc-RNbCT-iVCvZUY4OllCx8eHi2DBbGa2PoUPiBop7GRck9_ggqJeBKkeYkF3SJRR5lvoNgJqsHraZ5XpNNvqRSmKXnd4-wOYyod_LkywCkRlw_AysNVi_hisAHOxieJ-PAcVMpXdH1GlPrCLX-8TlDmQPr9-2ylfjJGvW_7FsRn2YqMHOhL2Y6EsVv21sjUXh99QrYOB4dyUSuxlc5iaG6Pk6UATWD5jkOhQGOI&q=maggie+images&sa=X&sqi=2&ved=2ahUKEwiQhL6n45uWAxXdmuEIHabVNT8QtKgLegQIERAB&biw=436&bih=881&dpr=2.47#sv=CAMSVxoyKhBlLUVINDRuNUR6d01wNTJNMg5FSDQ0bjVEendNcDUyTToOYkZiQ3JrdGxfUEVZYk0gBCoXCgFzEhBlLUVINDRuNUR6d01wNTJNGAEwAUoECAEQAhgHILn9nKADSggQAhgBIAIoAQ", 
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
