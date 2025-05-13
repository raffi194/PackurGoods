// Profile Products
// This file handles displaying uploaded products in the profile page

document.addEventListener('DOMContentLoaded', function() {
  // Find a suitable container to show uploaded products
  const profileContainer = document.querySelector('.flex.flex-col.items-center.w-full');
  
  if (profileContainer) {
    // Check if the uploaded products section already exists
    let uploadedProductsSection = document.getElementById('uploaded-products-section');
    
    if (!uploadedProductsSection) {
      // Create a new section for uploaded products
      uploadedProductsSection = document.createElement('div');
      uploadedProductsSection.id = 'uploaded-products-section';
      uploadedProductsSection.className = 'w-full px-10 pb-10';
      
      const sectionTitle = document.createElement('h2');
      sectionTitle.className = 'text-2xl font-bold mb-4';
      sectionTitle.textContent = 'Produk Anda';
      
      const productsContainer = document.createElement('div');
      productsContainer.id = 'uploaded-products-container';
      productsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
      
      uploadedProductsSection.appendChild(sectionTitle);
      uploadedProductsSection.appendChild(productsContainer);
      
      // Add the section to the profile container
      profileContainer.appendChild(uploadedProductsSection);
    }
    
    // Load and display uploaded products
    loadUploadedProducts();
  }
  
  // Load and display uploaded products
  function loadUploadedProducts() {
    try {
      if (typeof getUploadedProducts === 'function') {
        const productsContainer = document.getElementById('uploaded-products-container');
        
        if (productsContainer) {
          const products = getUploadedProducts();
          
          if (products && products.length > 0) {
            // Clear existing product cards
            productsContainer.innerHTML = '';
            
            // Create product cards
            products.forEach(product => {
              const card = createProductCard(product);
              productsContainer.appendChild(card);
            });
          } else {
            // Show a message if no products have been uploaded
            productsContainer.innerHTML = '<p class="text-center text-gray-500 col-span-3">Belum ada produk yang diupload. Silakan upload produk di halaman admin.</p>';
          }
        }
      } else {
        console.error('getUploadedProducts function not found. Make sure productStorage.js is loaded.');
      }
    } catch (error) {
      console.error('Error loading uploaded products:', error);
    }
  }
  
  // Create a product card element
  function createProductCard(product) {
    const cardHtml = `
      <div class="relative">
        <div class="bg-[--putih] rounded-lg shadow-lg overflow-hidden border-2 border-[--hitam]">
          <div class="relative group">
            <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
            <div class="absolute inset-0 bg-[--hitam] opacity-30 transition-opacity duration-300 group-hover:opacity-0"></div>
            <div class="absolute top-2 left-2 flex items-center bg-[--putih] border border-[--hitam] rounded-2xl px-2 py-1">
              <i class="fa-regular fa-star text-[--hitam]"></i>
              <span class="ml-1 text-xs font-bold text-[--hitam]">${product.rating}/5</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg">${product.name}</h3>
            <div class="flex justify-between items-center mt-2">
              <span class="text-lg font-bold">${product.price}</span>
              <span class="text-sm text-gray-600">Stock: ${product.totalStock}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml.trim();
    return tempDiv.firstChild;
  }
});