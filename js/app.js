// BLUSH Stone+ Luxury E-Commerce Engine
// Pure Vanilla JavaScript (No Node.js Required)

// Currency Configuration
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, code: 'USD' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
  CAD: { symbol: 'CA$', rate: 1.36, code: 'CAD' },
  AUD: { symbol: 'AU$', rate: 1.52, code: 'AUD' }
};

// Application State
const state = {
  currency: localStorage.getItem('blush_currency') || 'USD',
  cart: JSON.parse(localStorage.getItem('blush_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('blush_wishlist')) || [],
  activeCategory: 'all',
  activeSort: 'featured',
  activePromo: JSON.parse(localStorage.getItem('blush_promo')) || null,
  freeShippingThreshold: 75,
  quickViewProduct: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initCurrency();
  renderProducts();
  renderCuratedSets();
  updateCartUI();
  updateWishlistUI();
  setupEventListeners();
});

// Format Price with Currency
function formatPrice(amountInUSD) {
  const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
  const converted = amountInUSD * curr.rate;
  return `${curr.symbol}${converted.toFixed(2)}`;
}

// Currency Switcher
function initCurrency() {
  const selectors = document.querySelectorAll('.currency-select');
  selectors.forEach(sel => {
    sel.value = state.currency;
    sel.addEventListener('change', (e) => {
      state.currency = e.target.value;
      localStorage.setItem('blush_currency', state.currency);
      // Sync all currency dropdowns
      document.querySelectorAll('.currency-select').forEach(s => s.value = state.currency);
      renderProducts();
      renderCuratedSets();
      updateCartUI();
      if (state.quickViewProduct) openQuickView(state.quickViewProduct.id);
      showToast(`Currency updated to ${state.currency}`);
    });
  });
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = [...PRODUCTS];

  // Filter Category
  if (state.activeCategory === 'bestsellers') {
    filtered = filtered.filter(p => p.badge === 'Bestseller' || p.badge === 'Signature Piece');
  } else if (state.activeCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.activeCategory);
  }

  // Sort
  if (state.activeSort === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.activeSort === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.activeSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.activeSort === 'newest') {
    filtered.sort((a, b) => b.id - a.id);
  }

  // Empty State
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-500">
        <p class="font-serif text-2xl mb-2">No pieces found in this category.</p>
        <button onclick="setCategory('all')" class="text-sm tracking-wider uppercase underline underline-offset-4 text-amber-700 hover:text-amber-800">
          View All Creations
        </button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    const isWishlisted = state.wishlist.includes(product.id);
    return `
      <article class="product-card group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-amber-400/50 shadow-sm hover:shadow-xl transition-all duration-500">
        <!-- Image Area -->
        <div class="product-card-img-container relative bg-stone-100/70 aspect-square overflow-hidden cursor-pointer" onclick="openQuickView(${product.id})">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          <!-- Badge -->
          ${product.badge ? `
            <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full border border-amber-300/40 shadow-sm">
              ✦ ${product.badge}
            </span>
          ` : ''}

          <!-- Wishlist Heart Button -->
          <button 
            type="button"
            onclick="event.stopPropagation(); toggleWishlist(${product.id})" 
            aria-label="Add to Wishlist"
            class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-500 hover:scale-110 shadow-sm transition-all duration-300 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}"
          >
            <svg class="w-5 h-5 ${isWishlisted ? 'fill-current' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <!-- Quick View Hover Overlay -->
          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span class="text-xs font-medium uppercase tracking-widest text-white bg-stone-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md">
              Quick View
            </span>
          </div>
        </div>

        <!-- Product Meta -->
        <div class="p-5 flex-1 flex flex-col justify-between bg-white">
          <div>
            <div class="flex items-center gap-2 mb-1.5 text-xs text-stone-400">
              <span class="uppercase tracking-widest font-medium text-amber-700/90">${product.category}</span>
              <span>•</span>
              <div class="flex items-center text-amber-500">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span class="ml-1 text-stone-600 font-medium">${product.rating}</span>
                <span class="text-stone-400 ml-1">(${product.reviewCount})</span>
              </div>
            </div>

            <h3 class="font-serif text-lg text-stone-900 font-medium hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer" onclick="openQuickView(${product.id})">
              ${product.name}
            </h3>
            <p class="text-xs text-stone-500 mt-1 line-clamp-1">${product.subtitle}</p>
          </div>

          <div class="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span class="font-serif text-lg font-semibold text-stone-900">${formatPrice(product.price)}</span>
              ${product.originalPrice ? `
                <span class="text-xs text-stone-400 line-through ml-1.5">${formatPrice(product.originalPrice)}</span>
              ` : ''}
            </div>

            <button 
              type="button"
              onclick="quickAddToCart(${product.id})"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium tracking-wider uppercase rounded-full bg-stone-900 hover:bg-amber-700 text-white transition-all duration-300 shadow-sm hover:shadow"
            >
              <span>Add to Bag</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Render Curated Sets Section
function renderCuratedSets() {
  const container = document.getElementById('curated-sets-container');
  if (!container) return;

  container.innerHTML = CURATED_SETS.map(set => {
    return `
      <div class="relative bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row items-stretch">
        <div class="md:w-1/2 overflow-hidden aspect-[4/3] md:aspect-auto">
          <img src="${set.image}" alt="${set.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        <div class="md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-br from-cream-50 via-white to-amber-50/30">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
                ${set.tagline}
              </span>
              <span class="text-xs font-medium text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                ${set.savings}
              </span>
            </div>
            <h3 class="font-serif text-2xl md:text-3xl text-stone-900 font-semibold mb-3">${set.title}</h3>
            <p class="text-stone-600 text-sm mb-6 leading-relaxed">${set.description}</p>
            
            <div class="space-y-2 mb-6">
              <div class="flex items-center gap-2 text-xs text-stone-600">
                <span class="text-amber-600">✦</span> Includes luxury velvet gift box & travel pouch
              </div>
              <div class="flex items-center gap-2 text-xs text-stone-600">
                <span class="text-amber-600">✦</span> 18k Thick Gold Vermeil with 2-Year Warranty
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-stone-200 flex items-center justify-between">
            <div>
              <span class="font-serif text-2xl font-bold text-stone-900">${formatPrice(set.price)}</span>
              <span class="text-sm text-stone-400 line-through ml-2">${formatPrice(set.originalPrice)}</span>
            </div>
            <button 
              onclick="addSetToCart('${set.id}')"
              class="px-6 py-3 bg-stone-900 hover:bg-amber-700 text-white text-xs font-medium tracking-widest uppercase rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Add Set to Bag</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category & Sorting Filters
function setCategory(category) {
  state.activeCategory = category;
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    if (btn.dataset.category === category) {
      btn.classList.add('bg-stone-900', 'text-white', 'border-stone-900');
      btn.classList.remove('bg-white', 'text-stone-700', 'border-stone-200');
    } else {
      btn.classList.remove('bg-stone-900', 'text-white', 'border-stone-900');
      btn.classList.add('bg-white', 'text-stone-700', 'border-stone-200');
    }
  });
  renderProducts();
}

function setSort(sortValue) {
  state.activeSort = sortValue;
  renderProducts();
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  state.quickViewProduct = product;

  const modal = document.getElementById('quick-view-modal');
  const modalContent = document.getElementById('quick-view-body');
  if (!modal || !modalContent) return;

  const isWishlisted = state.wishlist.includes(product.id);

  modalContent.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Product Image Gallery -->
      <div class="relative bg-stone-100 rounded-2xl overflow-hidden aspect-square border border-stone-200">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="w-full h-full object-cover"
        />
        ${product.badge ? `
          <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-stone-900 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-amber-300/40">
            ✦ ${product.badge}
          </span>
        ` : ''}
      </div>

      <!-- Details & Controls -->
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span class="uppercase tracking-widest font-semibold text-amber-700">${product.category}</span>
            <div class="flex items-center text-amber-500">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              <span class="ml-1 text-stone-700 font-semibold">${product.rating}</span>
              <span class="ml-1 text-stone-400">(${product.reviewCount} customer reviews)</span>
            </div>
          </div>

          <h2 class="font-serif text-2xl md:text-3xl text-stone-900 font-semibold mb-1">${product.name}</h2>
          <p class="text-sm text-stone-500 mb-4">${product.subtitle}</p>

          <div class="flex items-baseline gap-3 mb-6">
            <span class="font-serif text-2xl font-bold text-stone-900">${formatPrice(product.price)}</span>
            ${product.originalPrice ? `
              <span class="text-stone-400 line-through text-sm">${formatPrice(product.originalPrice)}</span>
              <span class="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">Save ${formatPrice(product.originalPrice - product.price)}</span>
            ` : ''}
          </div>

          <p class="text-sm text-stone-600 leading-relaxed mb-6">${product.description}</p>

          <!-- Material Selection -->
          <div class="mb-5">
            <label class="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Select Finish:
            </label>
            <div class="flex flex-wrap gap-2" id="qv-materials">
              ${product.materials.map((mat, i) => `
                <button 
                  type="button" 
                  onclick="selectOption(this, '#qv-materials')"
                  class="option-pill px-3 py-1.5 text-xs rounded-lg border ${i === 0 ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-semibold' : 'border-stone-200 text-stone-700 hover:border-stone-400'} transition-all"
                  data-value="${mat}"
                >
                  ${mat}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Size Selection -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold uppercase tracking-wider text-stone-700">
                Select Size / Length:
              </label>
              <button onclick="openSizeGuideModal()" class="text-xs text-amber-700 hover:underline">Size Chart</button>
            </div>
            <div class="flex flex-wrap gap-2" id="qv-sizes">
              ${product.sizes.map((sz, i) => `
                <button 
                  type="button" 
                  onclick="selectOption(this, '#qv-sizes')"
                  class="option-pill px-3 py-1.5 text-xs rounded-lg border ${i === 0 ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-semibold' : 'border-stone-200 text-stone-700 hover:border-stone-400'} transition-all"
                  data-value="${sz}"
                >
                  ${sz}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Stock badge -->
          <div class="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl mb-6">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Only <strong>${product.inStock} handcrafted pieces</strong> remaining in stock.</span>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="flex items-center gap-3 mb-6">
            <div class="flex items-center border border-stone-300 rounded-full px-3 py-2 bg-stone-50">
              <button type="button" onclick="adjustQvQty(-1)" class="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold">-</button>
              <span id="qv-quantity" class="w-8 text-center text-sm font-semibold text-stone-900">1</span>
              <button type="button" onclick="adjustQvQty(1)" class="w-6 h-6 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold">+</button>
            </div>

            <button 
              type="button"
              onclick="addQvToCart(${product.id})"
              class="flex-1 py-3 px-6 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold tracking-widest uppercase rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Add to Bag</span>
              <span class="text-amber-300">✦</span>
            </button>

            <button 
              type="button"
              onclick="toggleWishlist(${product.id}); openQuickView(${product.id})"
              class="p-3 rounded-full border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-500 transition-colors"
              title="Save to Wishlist"
            >
              <svg class="w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'fill-none'}" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          <!-- Product Details Accordion -->
          <div class="border-t border-stone-200 pt-4 space-y-2">
            <details class="group py-1 cursor-pointer">
              <summary class="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-stone-700 list-none">
                <span>Craftsmanship & Materials</span>
                <span class="transition group-open:rotate-180">▾</span>
              </summary>
              <ul class="mt-2 space-y-1.5 text-xs text-stone-600 pl-4 list-disc">
                ${product.details.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </details>
            <details class="group py-1 cursor-pointer">
              <summary class="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-stone-700 list-none">
                <span>Complimentary Shipping & Returns</span>
                <span class="transition group-open:rotate-180">▾</span>
              </summary>
              <p class="mt-2 text-xs text-stone-600 leading-relaxed">
                Free standard delivery on orders over $75. Every piece arrives enclosed in an anti-tarnish micro-suede pouch and embossed gift box. Enjoy 30-day hassle-free returns.
              </p>
            </details>
          </div>

        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeQuickView() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  state.quickViewProduct = null;
}

function selectOption(btn, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.option-pill').forEach(el => {
    el.classList.remove('border-amber-600', 'bg-amber-50/70', 'text-amber-900', 'font-semibold');
    el.classList.add('border-stone-200', 'text-stone-700');
  });
  btn.classList.add('border-amber-600', 'bg-amber-50/70', 'text-amber-900', 'font-semibold');
  btn.classList.remove('border-stone-200', 'text-stone-700');
}

let qvQty = 1;
function adjustQvQty(change) {
  qvQty = Math.max(1, qvQty + change);
  const el = document.getElementById('qv-quantity');
  if (el) el.textContent = qvQty;
}

function addQvToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const matPill = document.querySelector('#qv-materials .border-amber-600');
  const sizePill = document.querySelector('#qv-sizes .border-amber-600');

  const selectedMaterial = matPill ? matPill.dataset.value : product.materials[0];
  const selectedSize = sizePill ? sizePill.dataset.value : product.sizes[0];

  addToCart(product, qvQty, selectedMaterial, selectedSize);
  closeQuickView();
  qvQty = 1;
}

function quickAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  addToCart(product, 1, product.materials[0], product.sizes[0]);
}

function addSetToCart(setId) {
  const set = CURATED_SETS.find(s => s.id === setId);
  if (!set) return;

  const item = {
    id: `set-${set.id}`,
    productId: set.id,
    name: set.title,
    price: set.price,
    image: set.image,
    material: 'Curated Duo Set',
    size: 'Signature Fit',
    quantity: 1
  };

  const existing = state.cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push(item);
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Added ${set.title} to your bag!`);
}

// Core Cart Logic
function addToCart(product, quantity = 1, material = '', size = '') {
  const cartItemId = `${product.id}-${material}-${size}`;
  const existing = state.cart.find(item => item.id === cartItemId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    state.cart.push({
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      material: material,
      size: size,
      quantity: quantity
    });
  }

  saveCart();
  updateCartUI();
  openCartDrawer();
  showToast(`Added ${product.name} to your bag!`);
}

function updateCartItemQty(cartItemId, delta) {
  const item = state.cart.find(i => i.id === cartItemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.id !== cartItemId);
  }

  saveCart();
  updateCartUI();
}

function removeCartItem(cartItemId) {
  state.cart = state.cart.filter(i => i.id !== cartItemId);
  saveCart();
  updateCartUI();
  showToast('Item removed from your bag.');
}

function saveCart() {
  localStorage.setItem('blush_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  countBadges.forEach(badge => {
    badge.textContent = totalCount;
    if (totalCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  });

  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartDiscountRow = document.getElementById('cart-discount-row');
  const cartDiscountEl = document.getElementById('cart-discount-amount');
  const cartTotalEl = document.getElementById('cart-total');
  const freeShippingBar = document.getElementById('free-shipping-progress');
  const freeShippingText = document.getElementById('free-shipping-text');

  if (!cartItemsList) return;

  if (state.cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
        <svg class="w-12 h-12 text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="font-serif text-lg text-stone-700 mb-1">Your bag is empty</p>
        <p class="text-xs text-stone-400 mb-4">Discover our hand-forged golden creations.</p>
        <button onclick="closeCartDrawer(); window.location.hash='#shop'" class="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-full hover:bg-amber-700 transition-colors">
          Explore Pieces
        </button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(0);
    if (cartTotalEl) cartTotalEl.textContent = formatPrice(0);
    if (cartDiscountRow) cartDiscountRow.classList.add('hidden');
    if (freeShippingBar) freeShippingBar.style.width = '0%';
    if (freeShippingText) freeShippingText.innerHTML = `Add <strong>${formatPrice(state.freeShippingThreshold)}</strong> to unlock <strong>Complimentary Worldwide Shipping</strong>!`;
    return;
  }

  // Calculate totals
  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountUSD = 0;

  if (state.activePromo) {
    if (state.activePromo.type === 'percent') {
      discountUSD = subtotalUSD * (state.activePromo.value / 100);
    } else if (state.activePromo.type === 'fixed') {
      discountUSD = state.activePromo.value;
    }
  }

  const totalUSD = Math.max(0, subtotalUSD - discountUSD);

  // Free shipping progress
  const progressPercent = Math.min(100, (subtotalUSD / state.freeShippingThreshold) * 100);
  if (freeShippingBar) freeShippingBar.style.width = `${progressPercent}%`;

  if (freeShippingText) {
    if (subtotalUSD >= state.freeShippingThreshold) {
      freeShippingText.innerHTML = `🎉 You've unlocked <strong>FREE Worldwide Express Shipping</strong>!`;
    } else {
      const remaining = state.freeShippingThreshold - subtotalUSD;
      freeShippingText.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more to unlock <strong>Free Worldwide Shipping</strong>!`;
    }
  }

  // Render items
  cartItemsList.innerHTML = state.cart.map(item => `
    <div class="flex gap-4 py-4 border-b border-stone-100 last:border-0 items-center">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200" />
      <div class="flex-1 min-w-0">
        <h4 class="font-serif text-sm font-semibold text-stone-900 truncate">${item.name}</h4>
        <p class="text-xs text-stone-500">${item.material || ''} ${item.size ? '• ' + item.size : ''}</p>
        <span class="text-xs font-semibold text-stone-900 mt-1 block">${formatPrice(item.price)}</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-stone-50">
          <button onclick="updateCartItemQty('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 text-xs font-bold">-</button>
          <span class="w-6 text-center text-xs font-semibold">${item.quantity}</span>
          <button onclick="updateCartItemQty('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 text-xs font-bold">+</button>
        </div>
        <button onclick="removeCartItem('${item.id}')" class="text-stone-400 hover:text-rose-500 p-1 transition-colors" title="Remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  `).join('');

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotalUSD);
  if (cartDiscountRow) {
    if (discountUSD > 0) {
      cartDiscountRow.classList.remove('hidden');
      if (cartDiscountEl) cartDiscountEl.textContent = `-${formatPrice(discountUSD)} (${state.activePromo.code})`;
    } else {
      cartDiscountRow.classList.add('hidden');
    }
  }
  if (cartTotalEl) cartTotalEl.textContent = formatPrice(totalUSD);
}

// Promo Code System
function applyPromoCode() {
  const input = document.getElementById('cart-promo-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'BLUSH10') {
    state.activePromo = { code: 'BLUSH10', type: 'percent', value: 10 };
    localStorage.setItem('blush_promo', JSON.stringify(state.activePromo));
    showToast('Promo code BLUSH10 applied (10% OFF)!');
  } else if (code === 'WELCOME15') {
    state.activePromo = { code: 'WELCOME15', type: 'percent', value: 15 };
    localStorage.setItem('blush_promo', JSON.stringify(state.activePromo));
    showToast('Welcome VIP Code WELCOME15 applied (15% OFF)!');
  } else if (code === 'GOLDEN') {
    state.activePromo = { code: 'GOLDEN', type: 'fixed', value: 20 };
    localStorage.setItem('blush_promo', JSON.stringify(state.activePromo));
    showToast('Voucher GOLDEN applied ($20 OFF)!');
  } else {
    showToast('Invalid promo code. Try BLUSH10 or WELCOME15');
    return;
  }

  input.value = '';
  updateCartUI();
}

// Wishlist Functionality
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast('Removed from Wishlist.');
  } else {
    state.wishlist.push(productId);
    showToast('Saved to your Wishlist ✦');
  }

  localStorage.setItem('blush_wishlist', JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProducts();
}

function updateWishlistUI() {
  const badges = document.querySelectorAll('.wishlist-count-badge');
  badges.forEach(b => {
    b.textContent = state.wishlist.length;
    if (state.wishlist.length > 0) {
      b.classList.remove('hidden');
    } else {
      b.classList.add('hidden');
    }
  });

  const list = document.getElementById('wishlist-items-list');
  if (!list) return;

  if (state.wishlist.length === 0) {
    list.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-500">
        <svg class="w-12 h-12 text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p class="font-serif text-lg text-stone-700 mb-1">Your wishlist is empty</p>
        <p class="text-xs text-stone-400">Save pieces you love by tapping the heart icon.</p>
      </div>
    `;
    return;
  }

  const wishlistedProducts = PRODUCTS.filter(p => state.wishlist.includes(p.id));
  list.innerHTML = wishlistedProducts.map(p => `
    <div class="flex gap-4 py-4 border-b border-stone-100 last:border-0 items-center">
      <img src="${p.image}" alt="${p.name}" class="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200" />
      <div class="flex-1 min-w-0">
        <h4 class="font-serif text-sm font-semibold text-stone-900 truncate">${p.name}</h4>
        <span class="text-xs font-semibold text-stone-900">${formatPrice(p.price)}</span>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="quickAddToCart(${p.id}); toggleWishlist(${p.id})" class="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-stone-900 text-white rounded-full hover:bg-amber-700 transition-colors">
          Move to Bag
        </button>
        <button onclick="toggleWishlist(${p.id})" class="text-stone-400 hover:text-rose-500 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Drawer Open/Close Helpers
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('cart-panel')?.classList.remove('translate-x-full');
      document.getElementById('cart-backdrop')?.classList.remove('opacity-0');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }
}

function closeCartDrawer() {
  const panel = document.getElementById('cart-panel');
  const backdrop = document.getElementById('cart-backdrop');
  if (panel && backdrop) {
    panel.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      document.getElementById('cart-drawer')?.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
}

function openWishlistDrawer() {
  const drawer = document.getElementById('wishlist-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('wishlist-panel')?.classList.remove('translate-x-full');
      document.getElementById('wishlist-backdrop')?.classList.remove('opacity-0');
    }, 10);
    document.body.classList.add('overflow-hidden');
  }
}

function closeWishlistDrawer() {
  const panel = document.getElementById('wishlist-panel');
  const backdrop = document.getElementById('wishlist-backdrop');
  if (panel && backdrop) {
    panel.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      document.getElementById('wishlist-drawer')?.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
}

// Search Modal
function openSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.getElementById('search-input')?.focus();
    document.body.classList.add('overflow-hidden');
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

function handleLiveSearch(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;
  const q = query.trim().toLowerCase();

  if (q.length === 0) {
    resultsContainer.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center">Type something to search our fine jewelry catalog...</p>`;
    return;
  }

  const matches = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q) ||
    p.subtitle.toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<p class="text-xs text-stone-500 py-6 text-center">No jewelry matching "<strong>${query}</strong>" found.</p>`;
    return;
  }

  resultsContainer.innerHTML = matches.map(p => `
    <div onclick="closeSearchModal(); openQuickView(${p.id})" class="flex items-center gap-4 p-3 rounded-xl hover:bg-stone-50 cursor-pointer border border-transparent hover:border-stone-200 transition-all">
      <img src="${p.image}" alt="${p.name}" class="w-14 h-14 rounded-lg object-cover bg-stone-100" />
      <div class="flex-1 min-w-0">
        <h4 class="font-serif text-sm font-semibold text-stone-900">${p.name}</h4>
        <p class="text-xs text-stone-500">${p.category} • ${formatPrice(p.price)}</p>
      </div>
      <span class="text-xs text-amber-700 font-semibold uppercase tracking-wider">View</span>
    </div>
  `).join('');
}

// Checkout Flow
function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your bag is empty.');
    return;
  }

  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discountUSD = 0;
  if (state.activePromo) {
    if (state.activePromo.type === 'percent') discountUSD = subtotalUSD * (state.activePromo.value / 100);
    else discountUSD = state.activePromo.value;
  }
  const totalUSD = Math.max(0, subtotalUSD - discountUSD);

  const checkoutTotalEl = document.getElementById('checkout-order-total');
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(totalUSD);

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

function completeCheckout(event) {
  event.preventDefault();
  const modal = document.getElementById('checkout-modal');
  const body = document.getElementById('checkout-modal-body');

  const orderNum = 'BLUSH-' + Math.floor(100000 + Math.random() * 900000);

  if (body) {
    body.innerHTML = `
      <div class="text-center py-10 px-4">
        <div class="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 class="font-serif text-3xl font-semibold text-stone-900 mb-2">Thank You For Your Order!</h3>
        <p class="text-sm text-stone-600 mb-4">Your order reference is <strong>#${orderNum}</strong>.</p>
        <p class="text-xs text-stone-500 max-w-md mx-auto leading-relaxed mb-8">
          A confirmation receipt with your tracked delivery details and care instructions has been simulated. Your handcrafted BLUSH Stone+ pieces will be gently boxed and dispatched with love.
        </p>
        <button onclick="closeCheckoutModal(); location.reload()" class="px-8 py-3 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold tracking-widest uppercase rounded-full transition-all">
          Continue Shopping
        </button>
      </div>
    `;
  }

  // Clear cart
  state.cart = [];
  saveCart();
  updateCartUI();
  showToast('Order placed successfully! ✦');
}

// Toast Notification System
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toast = document.createElement('div');
  toast.className = 'glass-card text-stone-900 px-4 py-3 rounded-2xl shadow-xl border border-amber-300/60 flex items-center gap-3 text-xs font-medium tracking-wide transform transition-all duration-300 translate-y-4 opacity-0';
  toast.innerHTML = `
    <span class="text-amber-600 text-base">✦</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Sizing Guide Modal
function openSizeGuideModal() {
  const modal = document.getElementById('size-guide-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeSizeGuideModal() {
  const modal = document.getElementById('size-guide-modal');
  if (modal) modal.classList.add('hidden');
}

// Newsletter Subscription
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletter-email');
  if (!input || !input.value) return;

  localStorage.setItem('blush_vip_email', input.value);
  input.value = '';
  showToast('Welcome to the Blush Circle! Use code WELCOME15 for 15% off.');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Live search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleLiveSearch(e.target.value));
  }

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCartDrawer();
      closeWishlistDrawer();
      closeSearchModal();
      closeSizeGuideModal();
    }
  });
}
