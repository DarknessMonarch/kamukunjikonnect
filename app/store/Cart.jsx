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