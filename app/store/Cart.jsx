import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  isLoading: false,
  isDrawerOpen: false,
  
  addItem: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    
    return {
      items: [...state.items, { ...product, quantity: 1 }]
    };
  }),
  
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter(item => item.id !== itemId)
  })),
  
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === itemId 
        ? { ...item, quantity: Math.max(0, quantity) }
        : item
    ).filter(item => item.quantity > 0)
  })),
  
  clearCart: () => set({ items: [] }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  
  getItemCount: () => {
    const state = get();
    if (!state.items || !Array.isArray(state.items)) return 0;
    return state.items.reduce((total, item) => {
      const quantity = Number(item?.quantity) || 0;
      return total + quantity;
    }, 0);
  },
  
  getSubtotal: () => {
    const state = get();
    if (!state.items || !Array.isArray(state.items)) return 0;
    return state.items.reduce((total, item) => {
      const price = Number(item?.currentPrice) || 0;
      const quantity = Number(item?.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  },
  
  getDeliveryFee: (feePerItem = 50) => {
    const state = get();
    if (!state.items || !Array.isArray(state.items)) return 0;
    const fee = Number(feePerItem) || 0;
    return state.items.length * fee;
  },
  
  getTotal: (feePerItem = 50) => {
    const state = get();
    const subtotal = state.getSubtotal();
    const deliveryFee = state.getDeliveryFee(feePerItem);
    return subtotal + deliveryFee;
  }
}));


// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       cart: null,
//       cartSummary: {
//         totalItems: 0,
//         totalAmount: 0,
//         items: []
//       },
//       loading: false,
//       error: null,

//       // Fetch user's cart
//       fetchCart: async (token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ cart: data.data });
//             // Update local cart summary
//             get().updateLocalCartSummary(data.data);
//             return { success: true, data: data.data };
//           }
//           throw new Error(data.message || "Failed to fetch cart");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Get cart summary
//       getCartSummary: async (token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart/summary`, {
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ cartSummary: data.data });
//             return { success: true, data: data.data };
//           }
//           throw new Error(data.message || "Failed to fetch cart summary");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Add item to cart
//       addItemToCart: async (itemData, token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart/add`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               productId: itemData.productId,
//               quantity: itemData.quantity || 1,
//               selectedColor: itemData.selectedColor
//             })
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ cart: data.data });
//             get().updateLocalCartSummary(data.data);
//             return { success: true, data: data.data, message: data.message };
//           }
//           throw new Error(data.message || "Failed to add item to cart");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Update cart item
//       updateCartItem: async (itemId, updateData, token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart/item/${itemId}`, {
//             method: 'PUT',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({
//               quantity: updateData.quantity,
//               selectedColor: updateData.selectedColor
//             })
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ cart: data.data });
//             get().updateLocalCartSummary(data.data);
//             return { success: true, data: data.data, message: data.message };
//           }
//           throw new Error(data.message || "Failed to update cart item");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Remove item from cart
//       removeItemFromCart: async (itemId, token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart/item/${itemId}`, {
//             method: 'DELETE',
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ cart: data.data });
//             get().updateLocalCartSummary(data.data);
//             return { success: true, data: data.data, message: data.message };
//           }
//           throw new Error(data.message || "Failed to remove item from cart");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Clear entire cart
//       clearCart: async (token) => {
//         try {
//           set({ loading: true, error: null });
          
//           const response = await fetch(`${SERVER_API}/cart/clear`, {
//             method: 'DELETE',
//             headers: {
//               'Authorization': `Bearer ${token}`
//             }
//           });
          
//           const data = await response.json();
          
//           if (response.ok && data.success) {
//             set({ 
//               cart: data.data,
//               cartSummary: {
//                 totalItems: 0,
//                 totalAmount: 0,
//                 items: []
//               }
//             });
//             return { success: true, data: data.data, message: data.message };
//           }
//           throw new Error(data.message || "Failed to clear cart");
//         } catch (error) {
//           set({ error: error.message });
//           return { success: false, message: error.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // Update local cart summary (helper function)
//       updateLocalCartSummary: (cartData) => {
//         if (!cartData || !cartData.items) {
//           set({ 
//             cartSummary: {
//               totalItems: 0,
//               totalAmount: 0,
//               items: []
//             }
//           });
//           return;
//         }

//         const summary = {
//           totalItems: cartData.totalItems || 0,
//           totalAmount: cartData.totalAmount || 0,
//           items: cartData.items.map(item => ({
//             id: item._id,
//             productId: item.product._id,
//             productName: item.product.name,
//             quantity: item.quantity,
//             priceAtTime: item.priceAtTime,
//             selectedColor: item.selectedColor,
//             subtotal: item.priceAtTime * item.quantity,
//             image: item.product.image,
//             inStock: item.product.inStock
//           }))
//         };

//         set({ cartSummary: summary });
//       },

//       // Quick add to cart (optimistic update)
//       quickAddToCart: (productData, quantity = 1, selectedColor = null) => {
//         const currentSummary = get().cartSummary;
//         const existingItemIndex = currentSummary.items.findIndex(
//           item => item.productId === productData._id && item.selectedColor === selectedColor
//         );

//         let updatedItems = [...currentSummary.items];

//         if (existingItemIndex > -1) {
//           // Update existing item
//           updatedItems[existingItemIndex] = {
//             ...updatedItems[existingItemIndex],
//             quantity: updatedItems[existingItemIndex].quantity + quantity,
//             subtotal: (updatedItems[existingItemIndex].quantity + quantity) * updatedItems[existingItemIndex].priceAtTime
//           };
//         } else {
//           // Add new item
//           const newItem = {
//             id: `temp-${Date.now()}`,
//             productId: productData._id,
//             productName: productData.name,
//             quantity: quantity,
//             priceAtTime: productData.currentPrice,
//             selectedColor: selectedColor,
//             subtotal: productData.currentPrice * quantity,
//             image: productData.image,
//             inStock: productData.inStock
//           };
//           updatedItems.push(newItem);
//         }

//         const newSummary = {
//           totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
//           totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0),
//           items: updatedItems
//         };

//         set({ cartSummary: newSummary });
//       },

//       // Quick remove from cart (optimistic update)
//       quickRemoveFromCart: (itemId) => {
//         const currentSummary = get().cartSummary;
//         const updatedItems = currentSummary.items.filter(item => item.id !== itemId);

//         const newSummary = {
//           totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
//           totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0),
//           items: updatedItems
//         };

//         set({ cartSummary: newSummary });
//       },

//       // Update cart item quantity (optimistic update)
//       quickUpdateQuantity: (itemId, newQuantity) => {
//         const currentSummary = get().cartSummary;
//         const updatedItems = currentSummary.items.map(item => {
//           if (item.id === itemId) {
//             return {
//               ...item,
//               quantity: newQuantity,
//               subtotal: newQuantity * item.priceAtTime
//             };
//           }
//           return item;
//         });

//         const newSummary = {
//           totalItems: updatedItems.reduce((total, item) => total + item.quantity, 0),
//           totalAmount: updatedItems.reduce((total, item) => total + item.subtotal, 0),
//           items: updatedItems
//         };

//         set({ cartSummary: newSummary });
//       },

//       // Get cart item count
//       getCartItemCount: () => {
//         return get().cartSummary.totalItems;
//       },

//       // Get cart total amount
//       getCartTotal: () => {
//         return get().cartSummary.totalAmount;
//       },

//       // Check if product is in cart
//       isProductInCart: (productId, selectedColor = null) => {
//         const items = get().cartSummary.items;
//         return items.some(item => 
//           item.productId === productId && item.selectedColor === selectedColor
//         );
//       },

//       // Get product quantity in cart
//       getProductQuantityInCart: (productId, selectedColor = null) => {
//         const items = get().cartSummary.items;
//         const item = items.find(item => 
//           item.productId === productId && item.selectedColor === selectedColor
//         );
//         return item ? item.quantity : 0;
//       },

//       // Clear error
//       clearError: () => set({ error: null }),

//       // Reset cart store
//       resetCartStore: () => set({
//         cart: null,
//         cartSummary: {
//           totalItems: 0,
//           totalAmount: 0,
//           items: []
//         },
//         loading: false,
//         error: null
//       }),
//     }),
//     {
//       name: "cart-store",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         cartSummary: state.cartSummary,
//       }),
//     }
//   )
// );