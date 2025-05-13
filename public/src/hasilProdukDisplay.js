/**
 * HasilProduk Display
 * Shows all products on the HasilProduk.html page
 */

document.addEventListener('DOMContentLoaded', function() {
  const productContainer = document.getElementById('hasilProdukContainer');
  
  function displayProducts() {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('bentalaProducts')) || [];
    
    // Clear previous content
    productContainer.innerHTML = '';
    
    // Check if any products exist
    if (products.length === 0) {
      productContainer.innerHTML = `
        <div class="col-span-full text-center p-8">
          <h3 class="text-xl font-semibold mb-2">Belum ada produk</h3>
          <p class="text-gray-600 mb-4">Belum ada produk yang ditambahkan ke toko.</p>
          <button onclick="window.location.href='admin tambahkan produk.html'" class="bg-[--hitam] text-[--putih] py-2 px-4 rounded-md hover:opacity-90 transition">
            Tambah Produk
          </button>
        </div>
      `;
      return;
    }
    
    // Sort products by date (newest first)
    products.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    // Display each product
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden border border-gray-200';
      
      // Format product information
      productCard.innerHTML = `
        <div class="relative group">
          <img src="${product.gambar}" alt="${product.nama}" class="w-full h-64 object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-[--hitam] text-white px-4 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Lihat Detail
            </button>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg text-[--hitam]">${product.nama}</h3>
          <div class="flex justify-between items-center mt-2">
            <p class="font-medium text-[--hitam]">${product.harga}</p>
            <p class="text-sm text-gray-600">Stok: ${product.total}</p>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center">
              <span class="inline-block w-4 h-4 rounded-full mr-1" style="background-color: ${product.warna};"></span>
              <span class="text-sm capitalize">${getColorName(product.warna)}</span>
            </div>
            <span class="text-sm capitalize">${product.gender}</span>
          </div>
          <button class="w-full mt-4 bg-[--hitam] hover:bg-opacity-80 text-white py-2 rounded-md transition">
            Tambah ke Keranjang
          </button>
        </div>
      `;
      
      productContainer.appendChild(productCard);
    });
  }
  
  // Helper function to get color name from hex value
  function getColorName(hexColor) {
    const colorMap = {
      '#ff0000': 'Merah',
      '#0000ff': 'Biru',
      '#ffff00': 'Kuning',
      '#008000': 'Hijau',
      '#ffa500': 'Jingga',
      '#800080': 'Ungu',
      '#000000': 'Hitam',
      '#ffffff': 'Putih'
    };
    
    return colorMap[hexColor.toLowerCase()] || 'Warna Lain';
  }
  
  // Initial display
  displayProducts();
});

// Display products and handle cart functionality
document.addEventListener('DOMContentLoaded', function() {
  const productContainer = document.getElementById('hasilProdukContainer');
  
  function displayProducts(products) {
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transform transition duration-300 hover:-translate-y-1 hover:shadow-lg';
      productCard.dataset.productId = product.id;
      
      productCard.innerHTML = `
        <div class="relative group">
          <img src="${product.gambar}" alt="${product.nama}" class="w-full h-64 object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button class="bg-[--hitam] text-white px-4 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Lihat Detail
            </button>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg text-[--hitam]">${product.nama}</h3>
          <div class="flex justify-between items-center mt-2">
            <p class="font-medium text-[--hitam]">${product.harga}</p>
            <p class="text-sm text-gray-600">Stok: ${product.total}</p>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center">
              <span class="inline-block w-4 h-4 rounded-full mr-1" style="background-color: ${product.warna};"></span>
              <span class="text-sm capitalize">${getColorName(product.warna)}</span>
            </div>
            <span class="text-sm capitalize">${product.gender}</span>
          </div>
          <button onclick="window.cartManager.addItem(${JSON.stringify({...product, id: product.id})})" 
            class="w-full mt-4 bg-[--hitam] hover:bg-opacity-80 text-white py-2 rounded-md transition">
            Tambah ke Keranjang
          </button>
        </div>
      `;
      
      productContainer.appendChild(productCard);
    });
  }
  
  // Load and display products
  const products = JSON.parse(localStorage.getItem('bentalaProducts')) || [];
  displayProducts(products);
});