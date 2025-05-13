/**
 * Product Storage Service
 * Handles centralized product data management using localStorage
 */

// Structure for storing products
class ProductStorage {
  constructor() {
    this.storageKey = 'bentalaProducts';
    this.initialize();
  }

  // Initialize storage if it doesn't exist
  initialize() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Get all products
  getAllProducts() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (error) {
      console.error('Error retrieving products:', error);
      return [];
    }
  }

  // Add a new product
  addProduct(product) {
    try {
      const products = this.getAllProducts();
      
      // Add unique ID and timestamp if not provided
      const newProduct = {
        ...product,
        id: product.id || Date.now().toString(),
        dateAdded: product.dateAdded || new Date().toISOString(),
        sold: product.sold || 0
      };
      
      products.push(newProduct);
      localStorage.setItem(this.storageKey, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  }

  // Delete a product by ID
  deleteProduct(productId) {
    try {
      const products = this.getAllProducts();
      const filteredProducts = products.filter(product => product.id !== productId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Delete multiple products
  deleteProducts(productIds) {
    try {
      const products = this.getAllProducts();
      const filteredProducts = products.filter(product => !productIds.includes(product.id));
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
      return true;
    } catch (error) {
      console.error('Error deleting products:', error);
      return false;
    }
  }

  // Update a product
  updateProduct(productId, updatedData) {
    try {
      const products = this.getAllProducts();
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          return { ...product, ...updatedData };
        }
        return product;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(updatedProducts));
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  }

  // Search for products by name
  searchProducts(query) {
    try {
      const products = this.getAllProducts();
      if (!query) return products;
      
      const lowerCaseQuery = query.toLowerCase();
      return products.filter(product => 
        product.nama.toLowerCase().includes(lowerCaseQuery)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}

// Create and export singleton instance
const productStorage = new ProductStorage();