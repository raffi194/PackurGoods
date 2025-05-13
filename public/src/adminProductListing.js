/**
 * Admin Product Listing
 * Manages the product listing in the admin interface
 */

document.addEventListener('DOMContentLoaded', function() {
  // UI Elements
  const produkGrid = document.getElementById('produkGrid');
  const searchInput = document.getElementById('searchInput');
  const pilihButton = document.getElementById('pilihButton');
  const pilihanContainer = document.getElementById('pilihanContainer');
  const selectedCardCount = document.getElementById('selectedCardCount');
  const trashIcon = document.getElementById('trashIcon');
  const addProductButton = document.getElementById('addProductButton');

  // Selection state
  let isSelectMode = false;
  let selectedProducts = [];

  // Load products from localStorage
  function loadProducts(searchQuery = '') {
    // Clear the grid
    produkGrid.innerHTML = '';
    
    // Get products from localStorage
    let produkList = JSON.parse(localStorage.getItem('bentalaProducts')) || [];
    
    // Filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      produkList = produkList.filter(produk => 
        produk.nama.toLowerCase().includes(query)
      );
    }
    
    // Check if products exist
    if (produkList.length === 0) {
      produkGrid.innerHTML = `
        <div class="col-span-3 p-8 text-center">
          <p class="text-gray-500 mb-4">Tidak ada produk yang tersedia.</p>
          <button onclick="openAddProduct()" class="px-4 py-2 bg-[--ijo] text-white rounded hover:bg-opacity-90 transition">
            Tambah Produk Sekarang
          </button>
        </div>
      `;
      return;
    }
    
    // Create product cards
    produkList.forEach(produk => {
      const card = document.createElement('div');
      card.className = 'product-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all duration-300';
      card.dataset.id = produk.id;
      
      // Class for selected state
      if (selectedProducts.includes(produk.id)) {
        card.classList.add('selected');
      }
      
      // Class for select mode
      if (isSelectMode) {
        card.classList.add('selectable');
      }
      
      card.innerHTML = `
        <div class="relative">
          <img src="${produk.gambar}" alt="${produk.nama}" class="w-full h-48 object-cover">
          <div class="checkbox-container absolute top-2 right-2 ${isSelectMode ? 'opacity-100' : 'opacity-0'}">
            <input type="checkbox" id="check-${produk.id}" class="hidden" ${selectedProducts.includes(produk.id) ? 'checked' : ''}>
            <label for="check-${produk.id}" class="w-6 h-6 rounded-full bg-white border-2 border-[--hitam] flex items-center justify-center cursor-pointer">
              <i class="fa-solid fa-check ${selectedProducts.includes(produk.id) ? '' : 'hidden'}" style="color: var(--hitam);"></i>
            </label>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-lg mb-1">${produk.nama}</h3>
          <p class="text-[--hitam] font-medium">${produk.harga}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm text-gray-600">Stok: ${produk.total}</p>
            <p class="text-sm text-gray-600">Terjual: ${produk.sold || 0}</p>
          </div>
        </div>
      `;
      
      // Card click event
      card.addEventListener('click', function(e) {
        if (!isSelectMode) return;
        
        const id = this.dataset.id;
        const checkbox = this.querySelector(`#check-${id}`);
        const checkIcon = this.querySelector(`label[for="check-${id}"] i`);
        
        if (selectedProducts.includes(id)) {
          // Unselect
          selectedProducts = selectedProducts.filter(productId => productId !== id);
          this.classList.remove('selected');
          checkbox.checked = false;
          checkIcon.classList.add('hidden');
        } else {
          // Select
          selectedProducts.push(id);
          this.classList.add('selected');
          checkbox.checked = true;
          checkIcon.classList.remove('hidden');
        }
        
        // Update counter
        selectedCardCount.textContent = selectedProducts.length;
      });
      
      produkGrid.appendChild(card);
    });
  }

  // Toggle selection mode
  pilihButton.addEventListener('click', function() {
    isSelectMode = !isSelectMode;
    
    if (isSelectMode) {
      // Enter selection mode
      this.textContent = 'Batal';
      this.classList.add('bg-gray-200');
      pilihanContainer.classList.remove('hidden');
      selectedProducts = [];
      selectedCardCount.textContent = 0;
      
      // Update cards
      document.querySelectorAll('.product-card').forEach(card => {
        card.classList.add('selectable');
      });
    } else {
      // Exit selection mode
      this.textContent = 'Pilih';
      this.classList.remove('bg-gray-200');
      pilihanContainer.classList.add('hidden');
      
      // Update cards
      document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selectable', 'selected');
        const id = card.dataset.id;
        const checkbox = card.querySelector(`#check-${id}`);
        const checkIcon = card.querySelector(`label[for="check-${id}"] i`);
        
        if (checkbox) checkbox.checked = false;
        if (checkIcon) checkIcon.classList.add('hidden');
      });
    }
  });

  // Delete selected products
  trashIcon.addEventListener('click', function() {
    if (selectedProducts.length === 0) return;
    
    Swal.fire({
      title: 'Hapus Produk?',
      text: `Apakah anda yakin ingin menghapus ${selectedProducts.length} produk yang dipilih?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        // Get current products
        let produkList = JSON.parse(localStorage.getItem('bentalaProducts')) || [];
        
        // Filter out selected products
        produkList = produkList.filter(produk => !selectedProducts.includes(produk.id));
        
        // Save back to localStorage
        localStorage.setItem('bentalaProducts', JSON.stringify(produkList));
        
        // Reset selection
        selectedProducts = [];
        selectedCardCount.textContent = 0;
        
        // Reload products
        loadProducts(searchInput.value);
        
        // Show success message
        Swal.fire(
          'Terhapus!',
          'Produk berhasil dihapus.',
          'success'
        );
      }
    });
  });

  // Search functionality
  searchInput.addEventListener('input', function() {
    loadProducts(this.value);
  });

  // Add Product button
  addProductButton.addEventListener('click', function() {
    // This button is now linked to export products to HasilProduk.html
    // Since we're already using the same localStorage key, no export needed
    Swal.fire({
      title: 'Produk Diupload!',
      text: 'Produk sudah tersedia di halaman Hasil Produk.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      window.location.href = 'HasilProduk.html';
    });
  });

  // Initial load
  loadProducts();
});