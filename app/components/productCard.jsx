"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/Cart"; // Import cart store
import styles from "@/app/style/productCard.module.css";

import { IoCartOutline as CartIcon } from "react-icons/io5";

export default function ProductCard({ data }) {
  const router = useRouter();
  const { addItem, openDrawer } = useCartStore(); // Get cart actions

  const handleProductClick = () => {
    router.push(`/product/${data.id}`);
  };

  const handleAddtoCart = (e) => {
    e.stopPropagation();
    
    // Add item to cart using cart store
    addItem({
      id: data.id,
      name: data.name,
      currentPrice: data.currentPrice,
      originalPrice: data.originalPrice,
      image: data.image,
      category: data.category || "general"
    });
    
    toast.success(`${data.name} added to cart!`);
    
    // Optionally open the cart drawer to show the added item
    openDrawer();
  };

  return (
    <div className={styles.productCardContainer} onClick={handleProductClick}>
      <div className={styles.productCardImageWrapper}>
        <Image
          src={data.image}
          alt={data.name}
          width={120}
          height={120}
          className={styles.productImage}
        />
        <div className={styles.cartIconContainer}>
          <CartIcon
            className={styles.cartIcon}
            onClick={handleAddtoCart}
            aria-label={`Add ${data.name} to cart`}
          />
        </div>
      </div>
      <h1>{data.name}</h1>
      <div className={styles.productCardPrice}>
        <h3>Ksh {data.currentPrice}</h3>
        {data.originalPrice && data.originalPrice !== data.currentPrice && (
          <h4>Ksh {data.originalPrice}</h4>
        )}
      </div>
    </div>
  );
}