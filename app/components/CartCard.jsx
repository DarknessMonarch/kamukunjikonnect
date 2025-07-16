"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/app/store/Cart"; // Import cart store
import styles from "@/app/style/cartCard.module.css";

import {
  IoAdd as AddIcon,
  IoRemove as RemoveIcon,
} from "react-icons/io5";
import { MdDeleteOutline as DeleteIcon } from "react-icons/md";

export default function CartCard({ data, onUpdateQuantity, onRemoveItem }) {
  const router = useRouter();
  const { isLoading } = useCartStore();
  const [quantity, setQuantity] = useState(data.quantity || 1);
  const [isUpdating, setIsUpdating] = useState(false);
b
  const handleProductClick = () => {
    router.push(`/product/${data.id}`);
  };

  const handleIncreaseQuantity = async (e) => {
    e.stopPropagation();
    if (isUpdating || isLoading) return;

    setIsUpdating(true);
    const newQuantity = quantity + 1;
    
    try {
      setQuantity(newQuantity);
      await onUpdateQuantity?.(data.id, newQuantity);
    } catch (error) {
      setQuantity(quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecreaseQuantity = async (e) => {
    e.stopPropagation();
    if (isUpdating || isLoading || quantity <= 1) return;

    setIsUpdating(true);
    const newQuantity = quantity - 1;
    
    try {
      setQuantity(newQuantity);
      await onUpdateQuantity?.(data.id, newQuantity);
    } catch (error) {
      setQuantity(quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveFromCart = async (e) => {
    e.stopPropagation();
    if (isUpdating || isLoading) return;

    setIsUpdating(true);
    
    try {
      await onRemoveItem?.(data.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPrice = (data.currentPrice * quantity).toFixed(2);

  return (
    <div className={styles.cartItemContainer} onClick={handleProductClick}>
      <div className={styles.cartItemImageWrapper}>
        <Image
          src={data.image}
          alt={data.name}
          width={120}
          height={120}
          className={styles.cartItemImage}
        />
      </div>

      <div className={styles.cartItemDetails}>
        <h1 className={styles.cartItemName}>{data.name}</h1>
        <div className={styles.cartItemPricing}>
          <h3 className={styles.cartItemPrice}>Ksh {data.currentPrice}</h3>
        </div>
        <div className={styles.cartItemTotal}>
          Total: Ksh {totalPrice}
        </div>
      </div>

      <div className={styles.cartItemActions}>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityButton}
            onClick={handleDecreaseQuantity}
            disabled={quantity <= 1 || isUpdating || isLoading}
            aria-label={`Decrease ${data.name} quantity`}
          >
            <RemoveIcon className={styles.quantityIcon} />
          </button>
          
          <span className={styles.quantityDisplay}>{quantity}</span>
          
          <button
            className={styles.quantityButton}
            onClick={handleIncreaseQuantity}
            disabled={isUpdating || isLoading}
            aria-label={`Increase ${data.name} quantity`}
          >
            <AddIcon className={styles.quantityIcon} />
          </button>
        </div>

        <button
          className={styles.removeButton}
          onClick={handleRemoveFromCart}
          disabled={isUpdating || isLoading}
          aria-label={`Remove ${data.name} from cart`}
        >
          <DeleteIcon className={styles.removeIcon} />
        </button>
      </div>
    </div>
  );
}