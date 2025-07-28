import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: [],
      activeCategories: [],
      currentCategory: null,
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCategories: 0,
        hasNext: false,
        hasPrev: false
      },

      // Fetch all categories (admin view with pagination)
      fetchCategories: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page);
          if (params.limit) queryParams.append('limit', params.limit);
          if (params.search) queryParams.append('search', params.search);
          if (params.sortBy) queryParams.append('sortBy', params.sortBy);
          if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
          if (params.isActive !== undefined) queryParams.append('isActive', params.isActive);

          const response = await fetch(`${SERVER_API}/categories?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ 
              categories: data.data,
              pagination: data.pagination 
            });
            return { success: true, data: data.data, pagination: data.pagination };
          }
          throw new Error(data.message || "Failed to fetch categories");
        } catch (error) {
          set({ error: error.message });
          return {
            success: false,
            message: error.message || "Failed to fetch categories",
          };
        } finally {
          set({ loading: false });
        }
      },

      // Fetch active categories (for dropdowns and public use)
      fetchActiveCategories: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/categories/active`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ activeCategories: data.data });
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch active categories");
        } catch (error) {
          set({ error: error.message });
          return {
            success: false,
            message: error.message || "Failed to fetch active categories",
          };
        } finally {
          set({ loading: false });
        }
      },

      // Get category by ID
      getCategoryById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/categories/${id}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ currentCategory: data.data });
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Get category by slug
      getCategoryBySlug: async (slug) => {
        try {
          set({ loading: true, error: null });
          const response = await fetch(`${SERVER_API}/categories/slug/${slug}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ currentCategory: data.data });
            return { success: true, data: data.data };
          }
          throw new Error(data.message || "Failed to fetch category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Create new category (Admin only)
      createCategory: async (categoryData, token) => {
        try {
          set({ loading: true, error: null });
          
          const formData = new FormData();
          formData.append('name', categoryData.name);
          if (categoryData.description) formData.append('description', categoryData.description);
          if (categoryData.sortOrder !== undefined) formData.append('sortOrder', categoryData.sortOrder);
          if (categoryData.image) formData.append('image', categoryData.image);

          const response = await fetch(`${SERVER_API}/categories`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Add new category to the list
            const currentCategories = get().categories;
            set({ categories: [data.data, ...currentCategories] });
            
            // Refresh active categories if needed
            if (data.data.isActive) {
              const currentActive = get().activeCategories;
              set({ activeCategories: [data.data, ...currentActive] });
            }
            
            return { success: true, data: data.data, message: data.message };
          }
          throw new Error(data.message || "Failed to create category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Update category (Admin only)
      updateCategory: async (id, categoryData, token) => {
        try {
          set({ loading: true, error: null });
          
          const formData = new FormData();
          if (categoryData.name) formData.append('name', categoryData.name);
          if (categoryData.description !== undefined) formData.append('description', categoryData.description);
          if (categoryData.sortOrder !== undefined) formData.append('sortOrder', categoryData.sortOrder);
          if (categoryData.isActive !== undefined) formData.append('isActive', categoryData.isActive);
          if (categoryData.image) formData.append('image', categoryData.image);

          const response = await fetch(`${SERVER_API}/categories/${id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Update category in the list
            const currentCategories = get().categories;
            const updatedCategories = currentCategories.map(cat => 
              cat._id === id ? data.data : cat
            );
            set({ categories: updatedCategories });
            
            // Update active categories
            const currentActive = get().activeCategories;
            if (data.data.isActive) {
              const updatedActive = currentActive.some(cat => cat._id === id)
                ? currentActive.map(cat => cat._id === id ? data.data : cat)
                : [data.data, ...currentActive];
              set({ activeCategories: updatedActive });
            } else {
              set({ activeCategories: currentActive.filter(cat => cat._id !== id) });
            }
            
            // Update current category if it's the one being updated
            if (get().currentCategory?._id === id) {
              set({ currentCategory: data.data });
            }
            
            return { success: true, data: data.data, message: data.message };
          }
          throw new Error(data.message || "Failed to update category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Delete category (Admin only)
      deleteCategory: async (id, token) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/categories/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Remove category from the list
            const currentCategories = get().categories;
            set({ categories: currentCategories.filter(cat => cat._id !== id) });
            
            // Remove from active categories
            const currentActive = get().activeCategories;
            set({ activeCategories: currentActive.filter(cat => cat._id !== id) });
            
            // Clear current category if it's the one being deleted
            if (get().currentCategory?._id === id) {
              set({ currentCategory: null });
            }
            
            return { success: true, message: data.message };
          }
          throw new Error(data.message || "Failed to delete category");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Get products in a category
      getCategoryProducts: async (categoryId, params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          if (params.page) queryParams.append('page', params.page);
          if (params.limit) queryParams.append('limit', params.limit);
          if (params.sortBy) queryParams.append('sortBy', params.sortBy);
          if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
          if (params.minPrice) queryParams.append('minPrice', params.minPrice);
          if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

          const response = await fetch(`${SERVER_API}/categories/${categoryId}/products?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            return { 
              success: true, 
              data: data.data.products,
              category: data.data.category,
              pagination: data.data.pagination 
            };
          }
          throw new Error(data.message || "Failed to fetch category products");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Update product counts for all categories (Admin only)
      updateProductCounts: async (token) => {
        try {
          set({ loading: true, error: null });
          
          const response = await fetch(`${SERVER_API}/categories/update-counts`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
            // Refresh categories to get updated counts
            await get().fetchCategories();
            await get().fetchActiveCategories();
            
            return { success: true, message: data.message };
          }
          throw new Error(data.message || "Failed to update product counts");
        } catch (error) {
          set({ error: error.message });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Clear current category
      clearCurrentCategory: () => set({ currentCategory: null }),

      // Reset store
      resetStore: () => set({
        categories: [],
        activeCategories: [],
        currentCategory: null,
        loading: false,
        error: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalCategories: 0,
          hasNext: false,
          hasPrev: false
        }
      }),
    }),
    {
      name: "category-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeCategories: state.activeCategories,
        currentCategory: state.currentCategory,
      }),
    }
  )
);