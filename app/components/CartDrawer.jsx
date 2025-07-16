'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/Auth'
import CartCard from '@/app/components/CartCard' 
import { useCartStore } from '@/app/store/Cart' // Updated to use cart store
import styles from '@/app/style/cartdrawer.module.css'

import {
  IoCartOutline as CartIcon,
  IoClose as CloseIcon,
} from "react-icons/io5";

import Toaster from "@/public/assets/toaster.png";
import Washing from "@/public/assets/washing.png";

// Mock products for initial testing (you can remove this when connecting to real data)
const mockProducts = [
  {
    id: 1,
    name: "Digital Smart Toaster - 4 Slice",
    currentPrice: 450,
    originalPrice: 500,
    image: Toaster,
    category: "appliances",
    quantity: 2,
  },
  {
    id: 2,
    name: "Compact Dishwasher - Energy Efficient",
    currentPrice: 600,
    originalPrice: 899,
    image: Washing,
    category: "appliances",
    quantity: 1,
  },
];

export default function CartComponent({ delivery = 50 }) {
  const router = useRouter()
  const authStore = useAuthStore()
  
  // Updated to use cart store for both items and drawer state
  const { 
    items: cartItems, 
    isDrawerOpen, 
    isLoading,
    toggleDrawer, 
    closeDrawer,
    updateQuantity,
    removeItem,
    addItem,
    getSubtotal,
    getDeliveryFee,
    getTotal,
    setLoading
  } = useCartStore()

  // Initialize with mock data if cart is empty (for testing - remove this later)
  useEffect(() => {
    if (cartItems.length === 0) {
      // Add mock items to cart for testing
      mockProducts.forEach(product => {
        addItem(product)
      })
    }
  }, [cartItems.length, addItem])

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      updateQuantity(itemId, newQuantity)
      toast.success("Quantity updated successfully!")
    } catch (error) {
      toast.error("Failed to update quantity")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      removeItem(itemId)
      toast.success("Item removed from cart!")
    } catch (error) {
      toast.error("Failed to remove item")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const pay = () => {
    if (!authStore.token) {
      router.push('/login')
      toast.error('Login to proceed')
    } else {
      router.push('/payment')
      closeDrawer()
    }
  }

  // Calculate current totals using cart store methods with fallbacks
  const currentSubtotal = getSubtotal() || 0
  const currentDelivery = getDeliveryFee(delivery) || 0
  const currentTotal = getTotal(delivery) || 0

  return (
    <div className={`${styles.cartComponent} ${isDrawerOpen ? styles.slideIn : styles.slideOut}`}>
      <div className={styles.cartHeaderWrapper}>
        <div className={styles.cartHeader}>
          <CloseIcon 
            className={styles.iconExit}
            onClick={() => toggleDrawer()}
          />
          <h1>My Cart ({cartItems.length})</h1>
          <CartIcon className={styles.iconCart} />
        </div>
      </div>
      
      <div className={styles.cartContent}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <CartIcon className={styles.emptyCartIcon} />
            <h3>Your cart is empty</h3>
            <p>Add some items to get started</p>
          </div>
        ) : (
          <div className={styles.cartItemsList}>
            {cartItems.map((item) => (
              <CartCard
                key={item.id}
                data={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            ))}
          </div>
        )}
      </div>
      
      {cartItems.length > 0 && (
        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutSummary}>
            <div className={styles.checkinfo}>
              <h4>Delivery Fee ({cartItems.length} items):</h4>
              <span>Ksh {currentDelivery}</span>
            </div>
            <div className={styles.checkinfo}>
              <h4>Subtotal:</h4>
              <span>Ksh {currentSubtotal}</span>
            </div>
            <div className={`${styles.checkinfo} ${styles.total}`}>
              <h3>Total:</h3>
              <h3>Ksh {currentTotal}</h3>
            </div>
          </div>
          
          <div className={styles.checkoutActions}>
            <button 
              className={styles.checkoutBtn} 
              onClick={pay}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Checkout'}
            </button>
            <button 
              className={styles.continueShoppingBtn}
              onClick={() => closeDrawer()}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}