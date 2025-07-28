import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: [],
      currentProduct: null,
      searchResults: [],
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNext: false,
        hasPrev: false
      },

      // Fetch all products with filters
      fetchProducts: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page);
          if (params.limit) queryParams.append('limit', params.limit);
          if (params.category) queryParams.append('category', params.category);
          if (params.productType) queryParams.append('productType', params.productType);
          if (params.minPrice) queryParams.append('minPrice', params.minPrice);
          if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
          if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
          if (params.search) queryParams.append('search', params.search);
          if (params.sortBy) queryParams.append('sortBy', params.sortBy);
          if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

          const response = await fetch(`${SERVER_API}/products?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ 
              products: data.data,
              pagination: data.pagination 
            });
            return { success: true, data: data.data, pagination: data.pagination };
          }
          throw new Error(data.message || "Failed to fetch products");
        } catch (error) {
          set({ error: error.message });
          return {
            success: false,
            message: error.message || "Failed to fetch products",
          };
        } finally {
          set({ loading: false });
        }
      },

      // Get product by ID
      getProductById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/products/${id}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ currentProduct: data.data });
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch product");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Search products
      searchProducts: async (query, params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          queryParams.append('q', query);
          if (params.page) queryParams.append('page', params.page);
          if (params.limit) queryParams.append('limit', params.limit);

          const response = await fetch(`${SERVER_API}/products/search?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ 
              searchResults: data.data,
              pagination: data.pagination 
            });
            return { success: true, data: data.data, pagination: data.pagination };
          }
          throw new Error(data.message || "Failed to search products");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Get products by category
      getProductsByCategory: async (categoryId, params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page);
          if (params.limit) queryParams.append('limit', params.limit);

          const response = await fetch(`${SERVER_API}/products/category/${categoryId}?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            return { success: true, data: data.data, pagination: data.pagination };
          }
          throw new Error(data.message || "Failed to fetch products by category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Create new product (Admin only)
      createProduct: async (productData, token) => {
        try {
          set({ loading: true, error: null });
          
          const formData = new FormData();
          
          // Basic product info
          formData.append('name', productData.name);
          formData.append('currentPrice', productData.currentPrice);
          formData.append('originalPrice', productData.originalPrice);
          formData.append('category', productData.category);
          formData.append('productType', productData.productType);
          formData.append('description', productData.description);
          
          // Optional fields
          if (productData.stockQuantity !== undefined) formData.append('stockQuantity', productData.stockQuantity);
          if (productData.brand) formData.append('brand', productData.brand);
          if (productData.weight) formData.append('weight', productData.weight);
          if (productData.dimensions) formData.append('dimensions', productData.dimensions);
          
          // Arrays
          if (productData.colors && productData.colors.length > 0) {
            formData.append('colors', JSON.stringify(productData.colors));
          }
          if (productData.tags && productData.tags.length > 0) {
            formData.append('tags', JSON.stringify(productData.tags));
          }
          
          // Main image
          if (productData.mainImage) {
            formData.append('image', productData.mainImage);
          }
          
          // Gallery images
          if (productData.galleryImages && productData.galleryImages.length > 0) {
            productData.galleryImages.forEach(image => {
              formData.append('images', image);
            });
          }

          const response = await fetch(`${SERVER_API}/products`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Add new product to the list
            const currentProducts = get().products;
            set({ products: [data.data, ...currentProducts] });
            
            return { success: true, data: data.data, message: data.message };
          }
          throw new Error(data.message || "Failed to create product");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Update product (Admin only)
      updateProduct: async (id, productData, token) => {
        try {
          set({ loading: true, error: null });
          
          const formData = new FormData();
          
          // Only append fields that are provided
          if (productData.name) formData.append('name', productData.name);
          if (productData.currentPrice !== undefined) formData.append('currentPrice', productData.currentPrice);
          if (productData.originalPrice !== undefined) formData.append('originalPrice', productData.originalPrice);
          if (productData.category) formData.append('category', productData.category);
          if (productData.productType) formData.append('productType', productData.productType);
          if (productData.description) formData.append('description', productData.description);
          if (productData.stockQuantity !== undefined) formData.append('stockQuantity', productData.stockQuantity);
          if (productData.brand !== undefined) formData.append('brand', productData.brand);
          if (productData.weight !== undefined) formData.append('weight', productData.weight);
          if (productData.dimensions !== undefined) formData.append('dimensions', productData.dimensions);
          if (productData.inStock !== undefined) formData.append('inStock', productData.inStock);
          
          // Arrays
          if (productData.colors !== undefined) {
            formData.append('colors', JSON.stringify(productData.colors));
          }
          if (productData.tags !== undefined) {
            formData.append('tags', JSON.stringify(productData.tags));
          }
          
          // Images
          if (productData.mainImage) {
            formData.append('image', productData.mainImage);
          }
          if (productData.galleryImages && productData.galleryImages.length > 0) {
            productData.galleryImages.forEach(image => {
              formData.append('images', image);
            });
          }

          const response = await fetch(`${SERVER_API}/products/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Update product in the list
            const currentProducts = get().products;
            const updatedProducts = currentProducts.map(product => 
              product._id === id ? data.data : product
            );
            set({ products: updatedProducts });
            
            // Update current product if it's the one being updated
            if (get().currentProduct?._id === id) {
              set({ currentProduct: data.data });
            }
            
            return { success: true, data: data.data, message: data.message };
          }
          throw new Error(data.message || "Failed to update product");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Delete product (Admin only)
      deleteProduct: async (id, token) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/products/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Remove product from the list
            const currentProducts = get().products;
            set({ products: currentProducts.filter(product => product._id !== id) });
            
            // Clear current product if it's the one being deleted
            if (get().currentProduct?._id === id) {
              set({ currentProduct: null });
            }
            
            return { success: true, message: data.message };
          }
          throw new Error(data.message || "Failed to delete product");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Clear search results
      clearSearchResults: () => set({ searchResults: [] }),

      // Clear current product
      clearCurrentProduct: () => set({ currentProduct: null }),

      // Clear error
      clearError: () => set({ error: null }),

      // Reset store
      resetStore: () => set({
        products: [],
        currentProduct: null,
        searchResults: [],
        loading: false,
        error: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: 0,
          hasNext: false,
          hasPrev: false
        }
      }),
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentProduct: state.currentProduct,
      }),
    }
  )
);