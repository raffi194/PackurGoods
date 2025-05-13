// Collection Products
// This file handles displaying uploaded products in the collection page

document.addEventListener('DOMContentLoaded', function() {
  // Find products container in the collection page
  const productsContainer = document.querySelector('.grid');
  
  if (productsContainer) {
    // Load and display uploaded products in the collection
    loadCollectionProducts();
  }
  
  // Load and display uploaded products in the collection
  function loadCollectionProducts() {
    try {
      if (typeof getUploadedProducts === 'function') {
        const products = getUploadedProducts();
        
        // Only proceed if there are uploaded products
        if (products && products.length > 0) {
          // Create and add product cards to the collection grid
          products.forEach(product => {
            const card = createCollectionProductCard(product);
            productsContainer.appendChild(card);
          });
        }
      } else {
        console.error('getUploadedProducts function not found. Make sure productStorage.js is loaded.');
      }
    } catch (error) {
      console.error('Error loading collection products:', error);
    }
  }
  
  // Create a collection product card element
  function createCollectionProductCard(product) {
    const cardHtml = `
      <div class="relative">
        <div>
          <div class="cursor-pointer">
            <div class="bg-[--putih] rounded-lg shadow-lg overflow-hidden border-2 border-[--hitam]">
              <div class="relative group">
                <div class="flex flex-nowrap absolute p-2 space-x-5">
                  <div class="flex justify-start items-center bg-[--putih] w-fit border border-[--hitam] rounded-2xl px-2 py-1">
                    <i class="fa-regular fa-star text-[--hitam]"></i>
                    <span class="ml-1 text-xs font-bold text-[--hitam]">${product.rating}/5</span>
                  </div>
                </div>
                <img src="${product.image}" alt="${product.name}" class="w-full h-96 object-cover shadow-lg transition-shadow duration-300 hover:shadow-none">
                <div class="absolute inset-0 bg-[--hitam] opacity-30 transition-opacity duration-300 group-hover:opacity-0"></div>
              </div>
            </div>
            <div class="flex flex-col p-4">
              <span class="text-lg font-bold">${product.name.split(' ')[0]}</span>
              <span class="text-[--hitam] font-semibold">${product.name}</span>
              <div class="flex justify-between items-center w-full mt-2">
                <span class="text-xl font-bold">${product.price}</span>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <i class="fa-regular fa-heart fa-xl absolute top-[410px] cursor-pointer" onclick="toggleHeart(this)"></i>
          </div>
        </div>
      </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardHtml.trim();
    return tempDiv.firstChild;
  }
});