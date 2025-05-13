// Sistem Cart untuk Bentala E-commerce
class CartManager {
  constructor() {
    this.cartItems = [];
    this.shippingFee = 0;
    this.selectedBank = '';
    this.init();
  }

  init() {
    this.loadCart();
    this.updateCartBadge();
    
    document.addEventListener('DOMContentLoaded', () => {
      this.renderCart();
      this.setupEventListeners();
    });
  }

  loadCart() {
    const savedCart = localStorage.getItem('bentalaCart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
    }
  }

  saveCart() {
    localStorage.setItem('bentalaCart', JSON.stringify(this.cartItems));
    this.updateCartBadge();
  }

  updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
    }
  }

  addItem(product) {
    // Pastikan harga dalam format numerik
    const price = typeof product.harga === 'string' ? 
      parseInt(product.harga.replace(/[^\d]/g, '')) : product.harga;

    const existingItem = this.cartItems.find(item => 
      item.id === product.id && item.size === product.size
    );
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({
        id: product.id,
        name: product.nama,
        price: price,
        image: product.gambar,
        quantity: 1,
        size: product.size || 'L'
      });
    }
    
    this.saveCart();
    this.renderCart();
    this.showNotification('Produk berhasil ditambahkan ke keranjang');
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[--ijo] text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 opacity-100 transition-all duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  removeItem(itemId, size) {
    this.cartItems = this.cartItems.filter(item => 
      !(item.id === itemId && item.size === size)
    );
    
    this.saveCart();
    this.renderCart();
  }

  updateQuantity(itemId, size, newQuantity) {
    const item = this.cartItems.find(item => 
      item.id === itemId && item.size === size
    );
    
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      this.saveCart();
      this.renderCart();
    }
  }

  getItemTotal(item) {
    return item.price * item.quantity;
  }

  getSubtotal() {
    return this.cartItems.reduce((total, item) => 
      total + this.getItemTotal(item), 0
    );
  }

  calculateShippingFee(location, shippingMethod) {
    const subtotal = this.getSubtotal();
    
    if (subtotal >= 1000000) {
      this.shippingFee = 0;
    } else {
      let baseFee = 15000;
      
      if (location) {
        const locationSum = Array.from(location).reduce((sum, char) => 
          sum + char.charCodeAt(0), 0
        );
        baseFee += locationSum % 15000;
      }
      
      this.shippingFee = shippingMethod === 'express' ? 
        Math.round(baseFee * 1.5) : baseFee;
    }
    
    return this.shippingFee;
  }

  getOrderTotal() {
    return this.getSubtotal() + this.shippingFee;
  }

  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  renderCart() {
    const cartContainer = document.querySelector('.justify-center.space-y-5.w-full.md\\:w-\\[60\\%\\]');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartContainer) return;
    
    if (this.cartItems.length === 0) {
      emptyCart.classList.remove('hidden');
      cartContent.classList.add('hidden');
      return;
    }
    
    emptyCart.classList.add('hidden');
    cartContent.classList.remove('hidden');
    
    const itemsContainer = cartContainer.querySelector('.items-container') || document.createElement('div');
    itemsContainer.className = 'items-container space-y-4';
    itemsContainer.innerHTML = '';
    
    this.cartItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'rectangle rounded-2xl border-2 border-[--hitam] w-full h-32';
      itemElement.innerHTML = `
        <div class="flex h-full w-full overflow-hidden">
          <ul class="flex flex-nowrap items-center space-x-5 mx-2 h-full text-[--hitam] w-full"> 
            <li class="flex items-center h-full"> 
              <img src="${item.image}" alt="${item.name}" class="h-28 rounded-lg">
            </li>
            <li class="flex items-center h-full flex-grow"> 
              <div>
                <ul class="space-y-1">
                  <li>
                    <span class="text-3xl font-bold">${item.name}</span>
                  </li>
                  <li class="font-medium">
                    <span>Size: ${item.size}</span>
                  </li>
                  <li class="font-medium">
                    <div class="rectangle bg-transparent border-2 border-[--hitam] h-10 rounded-lg flex items-center justify-between px-2">
                      <span>Jumlah:</span>
                      <input type="number" min="1" value="${item.quantity}" 
                        data-item-id="${item.id}" 
                        data-item-size="${item.size}"
                        class="quantity-input font-semibold text-start w-16 bg-transparent border-none outline-none"/> 
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li class="flex items-center h-full"> 
              <div class="flex flex-col items-end space-y-10">
                <i class="fa-solid fa-xmark remove-item cursor-pointer"
                  data-item-id="${item.id}"
                  data-item-size="${item.size}"></i>
                <span class="font-bold text-4xl">${this.formatPrice(this.getItemTotal(item))}</span>
              </div>
            </li>
          </ul>
        </div>
      `;
      
      itemsContainer.appendChild(itemElement);
    });
    
    const firstRectangle2 = cartContainer.querySelector('.rectangle2');
    if (firstRectangle2) {
      cartContainer.insertBefore(itemsContainer, firstRectangle2);
    }
    
    // Update summary
    const subtotalElement = document.querySelector('span.text-2xl.font-bold:last-child');
    const productCountElement = document.querySelector('span:contains("Produk")');
    const shippingElement = document.querySelector('span:contains("Pengiriman")').nextElementSibling;
    const totalElement = document.querySelector('span.text-4xl.font-bold:last-child');
    
    if (subtotalElement) subtotalElement.textContent = this.formatPrice(this.getSubtotal());
    if (productCountElement) productCountElement.textContent = `(${this.cartItems.length} Produk)`;
    if (shippingElement) shippingElement.textContent = this.formatPrice(this.shippingFee);
    if (totalElement) totalElement.textContent = this.formatPrice(this.getOrderTotal());
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Quantity change handlers
    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        const itemSize = e.target.dataset.itemSize;
        const newQuantity = parseInt(e.target.value);
        this.updateQuantity(itemId, itemSize, newQuantity);
      });
    });
    
    // Remove item handlers
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', (e) => {
        const itemId = parseInt(e.target.dataset.itemId);
        const itemSize = e.target.dataset.itemSize;
        this.removeItem(itemId, itemSize);
      });
    });
    
    // Shipping calculation handlers
    const addressInput = document.getElementById('addressInput');
    const shippingInputs = document.querySelectorAll('input[name="shipping"]');
    
    if (addressInput && shippingInputs.length) {
      const calculateShipping = () => {
        const address = addressInput.value;
        const shippingMethod = document.getElementById('shippingExpress').checked ? 
          'express' : 'standard';
        this.calculateShippingFee(address, shippingMethod);
        this.renderCart();
      };
      
      addressInput.addEventListener('change', calculateShipping);
      shippingInputs.forEach(input => {
        input.addEventListener('change', calculateShipping);
      });
    }
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Add to cart functionality for product listing
document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('button:contains("Tambah ke Keranjang")');
  
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.bg-white');
      if (!productCard) return;
      
      const product = {
        id: parseInt(productCard.dataset.productId),
        nama: productCard.querySelector('h3').textContent,
        harga: productCard.querySelector('.font-medium').textContent,
        gambar: productCard.querySelector('img').src,
        size: 'L' // Default size
      };
      
      cartManager.addItem(product);
    });
  });
});

// Expose to global scope for debugging
window.cartManager = cartManager;