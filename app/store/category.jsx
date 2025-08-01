import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useCategoryStore = create(
  persist(
    (set, get) => ({
      categories: [],
      currentCategory: null,
      loading: false,
      error: null,

      fetchCategories: async (params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
          if (params.search) queryParams.append('search', params.search);
          if (params.sortBy) queryParams.append('sortBy', params.sortBy);
          if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

          const response = await fetch(`${SERVER_API}/categories?${queryParams.toString()}`);
          const data = await response.json();
          
          if (response.ok && data.success) {
            set({ categories: data.data });
            return { success: true, data: data.data };
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
            const currentCategories = get().categories;
            set({ categories: [data.data, ...currentCategories] });
            
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

      updateCategory: async (id, categoryData, token) => {
        try {
          set({ loading: true, error: null });
          
          const formData = new FormData();
          if (categoryData.name) formData.append('name', categoryData.name);
          if (categoryData.description !== undefined) formData.append('description', categoryData.description);
          if (categoryData.sortOrder !== undefined) formData.append('sortOrder', categoryData.sortOrder);
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
            const currentCategories = get().categories;
            const updatedCategories = currentCategories.map(cat => 
              cat._id === id ? data.data : cat
            );
            set({ categories: updatedCategories });
            
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
            const currentCategories = get().categories;
            set({ categories: currentCategories.filter(cat => cat._id !== id) });
            
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

      getCategoryProducts: async (categoryId, params = {}) => {
        try {
          set({ loading: true, error: null });
          
          const queryParams = new URLSearchParams();
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
              category: data.data.category
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
            await get().fetchCategories();
            
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

      clearError: () => set({ error: null }),

      clearCurrentCategory: () => set({ currentCategory: null }),

      resetStore: () => set({
        categories: [],
        currentCategory: null,
        loading: false,
        error: null
      }),
    }),
    {
      name: "category-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentCategory: state.currentCategory,
      }),
    }
  )
);