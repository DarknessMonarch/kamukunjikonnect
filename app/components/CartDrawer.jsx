'use client'

import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/app/components/Loader'
import Nothing from '@/app/components/Nothing'
import { useAuthStore } from '@/app/store/Auth'
import CartCard from '@/app/components/CartCard' 
import { useCartStore } from '@/app/store/Cart' 
import EmptyCart from '@/public/assets/emptycart.png'
import styles from '@/app/style/cartdrawer.module.css'

import {
  IoCartOutline as CartIcon,
  IoClose as CloseIcon,
  IoPersonOutline as LoginIcon,
} from "react-icons/io5";

import Toaster from "@/public/assets/toaster.png";
import Washing from "@/public/assets/washing.png";

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
  const { 
    isAuth, 
    accessToken, 
    firstName, 
    lastName, 
    email,
    emailVerified,
    isInitialized 
  } = useAuthStore()
  
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
    setLoading,
    clearCart
  } = useCartStore()

  // Initialize auth when component mounts
  useEffect(() => {
    const initAuth = async () => {
      if (!isInitialized) {
        await useAuthStore.getState().initializeAuth()
      }
    }
    initAuth()
  }, [isInitialized])

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setLoading(true)
    try {
      // If user is authenticated, you could sync with server here
      if (isAuth && accessToken) {
        // Example: await syncCartToServer(itemId, newQuantity)
      }
      
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
      // If user is authenticated, you could sync with server here
      if (isAuth && accessToken) {
        // Example: await removeFromServerCart(itemId)
      }
      
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

  const handleLogin = () => {
    closeDrawer()
    router.push('/login')
  }

  const pay = () => {
    if (!isAuth || !accessToken) {
      toast.error('Please login to proceed with checkout')
      handleLogin()
      return
    }

    if (!emailVerified) {
      toast.error('Please verify your email before checkout')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    router.push('/payment')
    closeDrawer()
  }

  const currentSubtotal = getSubtotal() || 0
  const currentDelivery = getDeliveryFee(delivery) || 0
  const currentTotal = getTotal(delivery) || 0

  return (
    <div className={`${styles.cartComponent} ${isDrawerOpen ? styles.slideIn : styles.slideOut}`}>
      <div className={styles.cartHeader}>
        <CloseIcon 
          className={styles.iconExit}
          onClick={() => toggleDrawer()}
        />
        <h1>My Cart ({cartItems.length})</h1>
        <CartIcon className={styles.iconCart} />
      </div>

      {/* Auth Status Display */}
      {isAuth && (
        <div className={styles.userInfo}>
          <p>Welcome back, {firstName || email}!</p>
          {!emailVerified && (
            <p className={styles.verificationWarning}>
              Please verify your email to complete checkout
            </p>
          )}
        </div>
      )}
      
      <div className={styles.cartContent}>
        {cartItems.length === 0 ? (
          <Nothing NothingImage={EmptyCart} Text="Your cart is empty" Alt="Empty cart" />
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
            {isAuth ? (
              // Authenticated user checkout
              <button 
                className={styles.checkoutBtn} 
                onClick={pay}
                disabled={isLoading || !emailVerified}
              >
                {isLoading ? <Loading /> : 'Checkout'}
              </button>
            ) : (
              // Non-authenticated user - login required
              <button 
                className={styles.checkoutBtn} 
                onClick={handleLogin}
                disabled={isLoading}
              >
                <LoginIcon style={{ marginRight: '8px' }} />
                {isLoading ? <Loading /> : 'Login to Checkout'}
              </button>
            )}
            
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