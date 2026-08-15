// Load Cart & Recent Searches from Local Storage
let cart = JSON.parse(localStorage.getItem('madhuban_cart')) || {};
let recentSearches = JSON.parse(localStorage.getItem('madhuban_searches')) || [];

let currentFilter = "All";
let itemsToShow = 8; // Initial items loaded
let activeProduct = null;
let activeVariant = null;
let customWeightUnit = "g";

/* ====== SAVE TO LOCAL STORAGE ====== */
function saveCart() {
  localStorage.setItem('madhuban_cart', JSON.stringify(cart));
}
function saveSearches() {
  localStorage.setItem('madhuban_searches', JSON.stringify(recentSearches));
}

/* ====== TOAST NOTIFICATIONS ====== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 300);
  }, 1000); // 1 second
}

/* ====== SKELETON LOADERS ====== */
function renderSkeletons() {
  const grid = document.getElementById('productsGrid');
  let html = '';
  for (let i = 0; i < 4; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton-img"></div>
        <div style="padding: 0 1rem 1rem;">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line btn"></div>
        </div>
      </div>
    `;
  }
  grid.innerHTML = html;
}

/* ====== HTML TEMPLATES ====== */
function productCardHTML(p) {
  let priceHtml = '';
  let unitHtml = p.unit || 'Choose Weight';
  let badgeHtml = '';
  let imgSrc = p.images && p.images.length > 0 ? p.images[0] : '';

  if (p.variants || p.customPricePerKg) {
    let minPrice = Infinity;
    let minMrp = Infinity;
    if (p.variants) {
      minPrice = Math.min(...p.variants.map(v => v.price));
      minMrp = Math.min(...p.variants.map(v => v.mrp || v.price));
    } else if (p.customPricePerKg) {
      minPrice = Math.round(p.customPricePerKg * 0.1);
      minMrp = minPrice;
    }
    priceHtml = `<span class="product-card__price">Rs ${minPrice}</span><span class="product-card__price-original" style="font-size: 11px; color: var(--ink-mute); font-weight: 500; margin-top: 4px; text-decoration: none;">Starts from</span>`;
    if (minMrp > minPrice) {
      let disc = Math.round((1 - minPrice/minMrp) * 100);
      badgeHtml = `<span class="product-card__badge">${disc}% OFF</span>`;
    }
  } else {
    priceHtml = `<span class="product-card__price">Rs ${p.price}</span>${p.mrp && p.mrp > p.price ? `<span class="product-card__price-original">Rs ${p.mrp}</span>` : ''}`;
    if (p.mrp && p.mrp > p.price) {
      let disc = Math.round((1 - p.price/p.mrp) * 100);
      badgeHtml = `<span class="product-card__badge">${disc}% OFF</span>`;
    }
  }

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card__media" onclick="openProductDetail('${p.id}')">
        <img src="${imgSrc}" class="product-card__img" alt="${p.name}">
        ${badgeHtml}
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">${p.name}</h3>
        <p class="product-card__unit">${unitHtml}</p>
        <div class="product-card__bottom">
          <div class="product-card__price-block">${priceHtml}</div>
          <div class="product-card__actions">
            ${p.variants || p.customPricePerKg ? `<button class="add-btn" onclick="openProductDetail('${p.id}')">VIEW</button>` : `<button class="add-btn" data-id="${p.id}">ADD</button><div class="stepper"><button class="dec-btn" data-id="${p.id}">-</button><span class="qty">1</span><button class="inc-btn" data-id="${p.id}">+</button></div>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

function offerCardHTML(p) {
  let minPrice = p.price;
  let minMrp = p.mrp;
  if (p.variants) {
    minPrice = Math.min(...p.variants.map(v => v.price));
    minMrp = Math.min(...p.variants.map(v => v.mrp || v.price));
  } else if (p.customPricePerKg) {
    minPrice = Math.round(p.customPricePerKg * 0.1);
    minMrp = minPrice;
  }
  let imgSrc = p.images && p.images.length > 0 ? p.images[0] : '';

  return `
    <div class="offer-card" onclick="openProductDetail('${p.id}')">
      <div class="offer-card__media"><img src="${imgSrc}" alt="${p.name}"></div>
      <div class="offer-card__content">
        <div class="offer-card__tag">Best Deal</div>
        <div class="offer-card__title">${p.name}</div>
        <div class="offer-card__price">Rs ${minPrice} ${minMrp > minPrice ? `<span style="font-size:11px; color:var(--ink-mute); text-decoration:line-through; margin-left:4px;">Rs ${minMrp}</span>` : ''}</div>
      </div>
    </div>
  `;
}

function attachProductEvents() {
  document.querySelectorAll('.add-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); addToCart(btn.dataset.id); }));
  document.querySelectorAll('.inc-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); changeCartQty(btn.dataset.id, 1); }));
  document.querySelectorAll('.dec-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); changeCartQty(btn.dataset.id, -1); }));
}

/* ====== RENDER PRODUCTS & PAGINATION ====== */
const grid = document.getElementById('productsGrid');
const showMoreBtn = document.getElementById('showMoreBtn');

function renderProducts() {
  const filtered = products.filter(p => currentFilter === "All" || p.cat === currentFilter);
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--ink-mute);">No products found</div>`;
    showMoreBtn.style.display = 'none';
    return;
  }
  const paginated = filtered.slice(0, itemsToShow);
  grid.innerHTML = paginated.map(productCardHTML).join('');
  attachProductEvents();
  syncAllProductUI();

  if (filtered.length > itemsToShow) {
    showMoreBtn.style.display = 'block';
  } else {
    showMoreBtn.style.display = 'none';
  }
}

showMoreBtn.addEventListener('click', () => {
  itemsToShow += 8;
  renderProducts();
});

/* ====== RENDER OFFERS & CATEGORIES ====== */
function renderOffers() {
  const offers = products.filter(p => p.isOffer);
  const offersContainer = document.getElementById('offersContainer');
  const offersScroll = document.getElementById('offersScroll');
  if (offers.length > 0) {
    offersContainer.style.display = 'block';
    offersScroll.innerHTML = offers.map(offerCardHTML).join('');
  } else {
    offersContainer.style.display = 'none';
  }
}

function renderCategories() {
  const cats = ["All", ...new Set(products.map(p => p.cat))];
  const scroll = document.getElementById('categoriesScroll');
  scroll.innerHTML = cats.map(cat => `<button class="cat-pill ${cat === currentFilter ? 'active' : ''}" data-cat="${cat}">${cat}</button>`).join('');
  scroll.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      currentFilter = pill.dataset.cat;
      itemsToShow = 8;
      scroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      document.getElementById('productsTitle').textContent = currentFilter === "All" ? "All Products" : currentFilter;
      renderProducts();
      document.getElementById('productsTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ====== PRODUCT DETAIL LOGIC ====== */
const detailSheet = document.getElementById('detailSheet');
const detailOverlay = document.getElementById('detailOverlay');
const customWeightSection = document.getElementById('customWeightSection');
const customWeightWrap = document.getElementById('customWeightWrap');
const customWeightToggle = document.getElementById('customWeightToggle');
const customWeightInput = document.getElementById('customWeightInput');
const customWeightInfo = document.getElementById('customWeightInfo');

function openProductDetail(id) {
  const p = products.find(prod => prod.id === id);
  if (!p) return;
  
  activeProduct = p;
  activeVariant = p.variants ? p.variants[0] : null;

  // Multi-Image Carousel
  const carousel = document.getElementById('detailCarousel');
  const dots = document.getElementById('carouselDots');
  if (p.images && p.images.length > 0) {
    carousel.innerHTML = p.images.map(img => `<img src="${img}" alt="${p.name}">`).join('');
    if (p.images.length > 1) {
      dots.innerHTML = p.images.map((_, i) => `<div class="carousel-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`).join('');
      dots.style.display = 'flex';
      carousel.onscroll = () => {
        const idx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        dots.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      };
    } else {
      dots.innerHTML = '';
      dots.style.display = 'none';
    }
  }

  document.getElementById('detailCat').textContent = p.cat;
  document.getElementById('detailTitle').textContent = p.name;
  document.getElementById('detailDesc').textContent = p.desc;

  const variantContainer = document.getElementById('variantContainer');
  const variantOptions = document.getElementById('variantOptions');
  customWeightWrap.classList.remove('active');
  customWeightInfo.classList.remove('active');
  customWeightInput.value = '';
  customWeightUnit = "g";
  document.getElementById('unitGramsBtn').classList.add('active');
  document.getElementById('unitKgBtn').classList.remove('active');

  if (p.variants || p.customPricePerKg) {
    variantContainer.style.display = 'block';
    let variantsHTML = '';
    if (p.variants) {
      variantsHTML += p.variants.map((v, i) => `<div class="variant-card ${i === 0 ? 'active' : ''}" onclick="selectVariant(${i})"><div class="variant-card__weight">${v.unit}</div><div class="variant-card__price">Rs ${v.price}</div>${v.mrp ? `<span class="variant-card__mrp">Rs ${v.mrp}</span>` : ''}</div>`).join('');
    }
    variantOptions.innerHTML = variantsHTML;
    if (p.customPricePerKg) {
      customWeightSection.style.display = 'block';
      if (!p.variants) activeVariant = null;
    } else {
      customWeightSection.style.display = 'none';
    }
    updateDetailPrice();
  } else {
    variantContainer.style.display = 'none';
    document.getElementById('detailPrice').textContent = `Rs ${p.price}`;
    const mrpEl = document.getElementById('detailMrp');
    if (p.mrp) { mrpEl.textContent = `Rs ${p.mrp}`; mrpEl.style.display = 'block'; } else { mrpEl.style.display = 'none'; }
  }

  renderRelatedItems(p);
  detailSheet.classList.add('open');
  detailOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderRelatedItems(p) {
  const relatedSection = document.getElementById('relatedSection');
  const relatedScroll = document.getElementById('relatedScroll');
  const related = products.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 5);
  if (related.length > 0) {
    relatedSection.style.display = 'block';
    relatedScroll.innerHTML = related.map(r => {
      let rPrice = r.price || (r.variants ? Math.min(...r.variants.map(v=>v.price)) : (r.customPricePerKg ? Math.round(r.customPricePerKg*0.1) : 0));
      let rImg = r.images && r.images.length > 0 ? r.images[0] : '';
      return `<div class="related-card" onclick="openProductDetail('${r.id}')"><img src="${rImg}" alt="${r.name}"><div class="related-card__content"><div class="related-card__title">${r.name}</div><div class="related-card__price">Rs ${rPrice}</div></div></div>`;
    }).join('');
  } else {
    relatedSection.style.display = 'none';
  }
}

function selectVariant(index) {
  document.querySelectorAll('.variant-card').forEach(card => card.classList.remove('active'));
  document.querySelectorAll('.variant-card')[index].classList.add('active');
  activeVariant = activeProduct.variants[index];
  customWeightWrap.classList.remove('active');
  customWeightInfo.classList.remove('active');
  customWeightToggle.style.display = 'block';
  updateDetailPrice();
}

document.getElementById('unitGramsBtn').addEventListener('click', () => { customWeightUnit = "g"; document.getElementById('unitGramsBtn').classList.add('active'); document.getElementById('unitKgBtn').classList.remove('active'); });
document.getElementById('unitKgBtn').addEventListener('click', () => { customWeightUnit = "kg"; document.getElementById('unitKgBtn').classList.add('active'); document.getElementById('unitGramsBtn').classList.remove('active'); });
customWeightToggle.addEventListener('click', () => { customWeightWrap.classList.add('active'); customWeightToggle.style.display = 'none'; customWeightInput.focus(); });

document.getElementById('calcCustomWeightBtn').addEventListener('click', () => {
  let weight = parseFloat(customWeightInput.value);
  if (!weight || weight <= 0) { alert("Please enter a valid number."); return; }
  let weightInGrams = customWeightUnit === "kg" ? weight * 1000 : weight;
  if (weightInGrams < 100) { alert("Minimum weight is 100g."); return; }
  if (weightInGrams > 50000) { alert("Maximum weight is 50kg (50000g)."); return; }
  const calculatedPrice = (activeProduct.customPricePerKg / 1000) * weightInGrams;
  const finalPrice = Math.round(calculatedPrice * 100) / 100;
  activeVariant = { unit: `${weight} ${customWeightUnit} (Custom)`, price: finalPrice, custom: true };
  document.querySelectorAll('.variant-card').forEach(card => card.classList.remove('active'));
  customWeightInfo.innerText = `Custom Weight: ${weight} ${customWeightUnit} = Rs ${finalPrice}`;
  customWeightInfo.classList.add('active');
  updateDetailPrice();
});

customWeightInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('calcCustomWeightBtn').click(); } });

function updateDetailPrice() {
  if (activeVariant) {
    document.getElementById('detailPrice').textContent = `Rs ${activeVariant.price}`;
    const mrpEl = document.getElementById('detailMrp');
    if (activeVariant.mrp) { mrpEl.textContent = `Rs ${activeVariant.mrp}`; mrpEl.style.display = 'block'; } else { mrpEl.style.display = 'none'; }
  } else if (activeProduct && activeProduct.customPricePerKg) {
    document.getElementById('detailPrice').textContent = `Rs ${activeProduct.customPricePerKg}/kg`;
  }
}

document.getElementById('detailAddBtn').addEventListener('click', () => {
  if (!activeProduct) return;
  if ((activeProduct.variants || activeProduct.customPricePerKg) && !activeVariant) { alert("Please select a weight or enter a custom weight."); return; }
  let cartId, cartItem;
  if ((activeProduct.variants || activeProduct.customPricePerKg) && activeVariant) {
    cartId = `${activeProduct.id}_${activeVariant.unit}`;
    cartItem = { id: cartId, name: activeProduct.name, unit: activeVariant.unit, price: activeVariant.price, img: activeProduct.images[0], qty: 1 };
  } else {
    cartId = activeProduct.id;
    cartItem = { ...activeProduct, img: activeProduct.images[0], qty: 1 };
  }
  cart[cartId] = cartItem;
  saveCart();
  syncAllProductUI();
  updateCartUI();
  showToast(`${activeProduct.name} added to cart`);
  closeDetailSheet();
});

function closeDetailSheet() { detailSheet.classList.remove('open'); detailOverlay.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('closeDetailBtn').addEventListener('click', closeDetailSheet);
detailOverlay.addEventListener('click', closeDetailSheet);

/* ====== CART LOGIC ====== */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.variants || product.customPricePerKg) return;
  cart[id] = { ...product, img: product.images[0], qty: 1 };
  saveCart();
  syncProductCardUI(id);
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function changeCartQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  syncProductCardUI(id);
  updateCartUI();
}

function syncProductCardUI(id) {
  document.querySelectorAll(`.product-card[data-id="${id}"]`).forEach(card => {
    const qtySpan = card.querySelector('.qty');
    if (cart[id]) { card.classList.add('in-cart'); if (qtySpan) qtySpan.textContent = cart[id].qty; } else { card.classList.remove('in-cart'); }
  });
}
function syncAllProductUI() { Object.keys(cart).forEach(id => syncProductCardUI(id)); }

function updateCartUI() {
  const itemIds = Object.keys(cart);
  const totalQty = itemIds.reduce((sum, id) => sum + cart[id].qty, 0);
  const subtotal = itemIds.reduce((sum, id) => sum + (cart[id].price * cart[id].qty), 0);

  const floatingCart = document.getElementById('floatingCart');
  if (totalQty > 0) {
    floatingCart.classList.add('visible');
    document.getElementById('cartCount').textContent = `${totalQty} item${totalQty > 1 ? 's' : ''}`;
    document.getElementById('cartTotal').textContent = `Rs ${subtotal}`;
  } else {
    floatingCart.classList.remove('visible');
  }

  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartFoot = document.getElementById('cartFoot');
  const emptyCart = document.getElementById('emptyCart');

  if (itemIds.length === 0) {
    emptyCart.style.display = 'flex';
    cartFoot.style.display = 'none';
    cartItemsContainer.innerHTML = '';
  } else {
    emptyCart.style.display = 'none';
    cartFoot.style.display = 'block';
    document.getElementById('subtotal').textContent = `Rs ${subtotal}`;
    document.getElementById('cartTotalFinal').textContent = `Rs ${subtotal}`;
    document.getElementById('checkoutTotal').textContent = `Rs ${subtotal}`;

    const deliveryFeeEl = document.getElementById('deliveryFee');
    if (subtotal >= 1999) { deliveryFeeEl.textContent = "FREE"; deliveryFeeEl.style.color = "var(--primary)"; deliveryFeeEl.style.fontWeight = "700"; deliveryFeeEl.style.fontSize = "14px"; } else { deliveryFeeEl.textContent = "Calculated on WhatsApp"; deliveryFeeEl.style.color = "var(--ink-mute)"; deliveryFeeEl.style.fontWeight = "600"; deliveryFeeEl.style.fontSize = "12px"; }

    cartItemsContainer.innerHTML = '';
    itemIds.forEach(id => {
      const item = cart[id];
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `<img src="${item.img}" class="cart-item__img" alt="${item.name}"><div class="cart-item__details"><h4 class="cart-item__title">${item.name}</h4><p class="cart-item__unit">${item.unit}</p><div class="cart-item__bottom"><span class="cart-item__price">Rs ${item.price * item.qty}</span><div class="cart-item__stepper"><button data-cart-dec="${id}">-</button><span>${item.qty}</span><button data-cart-inc="${id}">+</button></div></div></div>`;
      cartItemsContainer.appendChild(itemEl);
    });

    cartItemsContainer.querySelectorAll('[data-cart-inc]').forEach(btn => btn.addEventListener('click', () => changeCartQty(btn.dataset.cartInc, 1)));
    cartItemsContainer.querySelectorAll('[data-cart-dec]').forEach(btn => btn.addEventListener('click', () => changeCartQty(btn.dataset.cartDec, -1)));
  }
}

/* ====== SMART SEARCH ====== */
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const searchEmpty = document.getElementById('searchEmpty');
const searchRecentContainer = document.getElementById('searchRecentContainer');

function renderRecentSearches() {
  if (recentSearches.length > 0) {
    searchRecentContainer.innerHTML = `<h4 style="margin-bottom:0.75rem; font-size:14px; font-weight:700; color:var(--ink-soft); text-transform:uppercase; letter-spacing:0.05em;">Recent Searches</h4><div class="search-recent">${recentSearches.map(s => `<div class="search-chip" onclick="searchFor('${s}')">${s}</div>`).join('')}</div>`;
  } else {
    searchRecentContainer.innerHTML = '';
  }
}

function searchFor(term) {
  searchInput.value = term;
  renderSearchResults(term);
}

document.getElementById('openSearchBtn').addEventListener('click', () => {
  searchOverlay.classList.add('open');
  renderRecentSearches();
  setTimeout(() => searchInput.focus(), 100);
});

document.getElementById('closeSearchBtn').addEventListener('click', () => {
  searchOverlay.classList.remove('open');
  searchInput.value = '';
  searchResultsGrid.innerHTML = '';
  searchEmpty.style.display = 'none';
  renderRecentSearches();
});

function renderSearchResults(query) {
  const q = query.toLowerCase().trim();
  if (q === '') {
    searchResultsGrid.innerHTML = '';
    searchEmpty.style.display = 'none';
    renderRecentSearches();
    return;
  }
  
  searchRecentContainer.innerHTML = '';
  const filtered = products.filter(p => p.name.toLowerCase().includes(q));
  
  if (filtered.length === 0) {
    searchResultsGrid.innerHTML = '';
    searchEmpty.style.display = 'block';
    
    // Simple Fuzzy Search ("Did you mean?")
    let suggestion = products.find(p => {
      let matches = 0;
      for (let char of q) { if (p.name.toLowerCase().includes(char)) matches++; }
      return matches >= q.length * 0.6; // 60% character match
    });
    
    if (suggestion) {
      document.getElementById('searchEmptyTitle').innerText = "No products found";
      document.getElementById('searchEmptyText').innerHTML = `Did you mean <strong style="color:var(--primary); cursor:pointer;" onclick="searchFor('${suggestion.name}')">${suggestion.name}</strong>?`;
    } else {
      document.getElementById('searchEmptyTitle').innerText = "No products found";
      document.getElementById('searchEmptyText').innerText = "Try searching for something else.";
    }
  } else {
    searchEmpty.style.display = 'none';
    searchResultsGrid.innerHTML = filtered.map(productCardHTML).join('');
    attachProductEvents();
    syncAllProductUI();
    
    // Save to recent searches
    if (!recentSearches.includes(query)) {
      recentSearches.unshift(query);
      if (recentSearches.length > 5) recentSearches.pop();
      saveSearches();
    }
  }
}

searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

/* ====== CART SHEET LOGIC ====== */
const cartSheet = document.getElementById('cartSheet');
const cartOverlay = document.getElementById('cartOverlay');
const cartView = document.getElementById('cartView');
const checkoutView = document.getElementById('checkoutView');

function openCartSheet() { cartSheet.classList.add('open'); cartOverlay.classList.add('open'); showCartView(); document.body.style.overflow = 'hidden'; }
function closeCartSheet() { cartSheet.classList.remove('open'); cartOverlay.classList.remove('open'); document.body.style.overflow = ''; }
function showCartView() { checkoutView.classList.remove('active'); checkoutView.classList.add('hidden'); cartView.classList.remove('hidden'); cartView.classList.add('active'); }
function showCheckoutView() { cartView.classList.remove('active'); cartView.classList.add('hidden'); checkoutView.classList.remove('hidden'); checkoutView.classList.add('active'); loadUserData(); }

document.getElementById('openCartBtn').addEventListener('click', openCartSheet);
document.getElementById('closeCartBtn').addEventListener('click', closeCartSheet);
document.getElementById('closeCartBtn2').addEventListener('click', closeCartSheet);
document.getElementById('cartOverlay').addEventListener('click', closeCartSheet);
document.getElementById('emptyStateShopBtn').addEventListener('click', () => { closeCartSheet(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

document.getElementById('goToCheckoutBtn').addEventListener('click', () => { if (Object.keys(cart).length === 0) return; showCheckoutView(); });
document.getElementById('backToCartBtn').addEventListener('click', showCartView);

/* ====== LOCAL STORAGE & WHATSAPP ORDER ====== */
function loadUserData() {
  const saved = JSON.parse(localStorage.getItem('madhuban_user') || '{}');
  document.getElementById('inputName').value = saved.name || '';
  document.getElementById('inputPhone').value = saved.phone || '';
  document.getElementById('inputHouse').value = saved.house || '';
  document.getElementById('inputArea').value = saved.area || '';
  document.getElementById('inputLandmark').value = saved.landmark || '';
  document.getElementById('inputPincode').value = saved.pincode || '';
}

document.getElementById('placeOrderBtn').addEventListener('click', () => {
  const name = document.getElementById('inputName').value.trim();
  const phone = document.getElementById('inputPhone').value.trim();
  const house = document.getElementById('inputHouse').value.trim();
  const area = document.getElementById('inputArea').value.trim();
  const landmark = document.getElementById('inputLandmark').value.trim();
  const pincode = document.getElementById('inputPincode').value.trim();
  const notes = document.getElementById('inputNotes').value.trim();

  if (!name || !phone || !house || !area || !pincode) { alert('Please fill all required fields marked with *'); return; }
  if (phone.length !== 10) { alert('Please enter a valid 10-digit phone number'); return; }
  if (pincode.length !== 6) { alert('Please enter a valid 6-digit pincode'); return; }

  localStorage.setItem('madhuban_user', JSON.stringify({ name, phone, house, area, landmark, pincode }));

  let msg = `*NEW ORDER - MADHUBAN SUPERMARKET*\n`;
  msg += `================================\n`;
  msg += `Hello! I would like to place the following order.\n\n`;
  msg += `*ORDER ITEMS:*\n`;
  let subtotal = 0;
  Object.keys(cart).forEach((id, i) => {
    const item = cart[id];
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    msg += `${i+1}. ${item.name} (${item.unit})\n   Qty: ${item.qty} x Rs ${item.price} = *Rs ${itemTotal}*\n`;
  });
  msg += `\n*ESTIMATED TOTAL: Rs ${subtotal}*\n`;
  if (subtotal >= 1999) { msg += `*Delivery: FREE (Order above Rs 1999)*\n`; } else { msg += `*Delivery: Charges applicable (Free above Rs 1999)*\n`; }
  msg += `================================\n`;
  msg += `*DELIVERY DETAILS:*\n`;
  msg += `Name: ${name}\nPhone: ${phone}\nHouse/Flat: ${house}\nStreet/Area: ${area}\n`;
  if (landmark) msg += `Landmark: ${landmark}\n`;
  msg += `Pincode: ${pincode}\nCity: Latur\n`;
  if (notes) msg += `Notes: ${notes}\n`;
  msg += `================================\n`;
  msg += `Please confirm the availability, final amount, and delivery time. Thank you!\n`;

  // IMPORTANT: Replace 919999999999 with the actual WhatsApp number
  const waUrl = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;
  window.open(waUrl, '_blank');
});

/* ====== HEADER SCROLL EFFECT ====== */
const header = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});

/* ====== INIT ====== */
// 1. Render Skeletons immediately
renderSkeletons();
// 2. Render Categories & Offers instantly
renderCategories();
renderOffers();
// 3. Simulate slight delay to show off skeleton animation, then render products
setTimeout(() => {
  renderProducts();
}, 600);

syncAllProductUI();
updateCartUI();
