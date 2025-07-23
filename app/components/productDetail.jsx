"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useCartStore } from "@/app/store/Cart";
import styles from "@/app/style/productDetail.module.css";
import { IoCartOutline as CartIcon, IoHeartOutline as HeartIcon, IoAdd as PlusIcon, IoRemove as MinusIcon, IoExpandOutline as ExpandIcon } from "react-icons/io5";

export default function ProductDetail({ productData, loading = false }) {
  const { addItem, openDrawer } = useCartStore();
  
  const [selectedColor, setSelectedColor] = useState(productData?.colors?.[0] || 'black');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productData) {
      setSelectedColor(productData.colors?.[0] || 'black');
      setQuantity(1);
      setSelectedImage(0);
    }
  }, [productData]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: productData.id,
        name: productData.name,
        currentPrice: productData.currentPrice,
        originalPrice: productData.originalPrice,
        image: productData.images[0],
        category: productData.category || "general",
        color: selectedColor,
      });
    }
    
    toast.success(`${quantity} ${productData.name} added to cart!`);
    openDrawer();
  };

  if (loading || !productData) {
    return (
      <div className={styles.container}>
        <div className={styles.productDetailWrapper}>
          <div className={styles.imageSection}>
            <div className={`${styles.mainImageWrapper} skeleton`}></div>
            <div className={styles.thumbnailWrapper}>
              <div className={`${styles.thumbnail} skeleton`}></div>
              <div className={`${styles.thumbnail} skeleton`}></div>
            </div>
          </div>
          <div className={styles.detailSection}>
            <div className={`${styles.skeletonText}`} style={{width: '80%', height: '32px'}}></div>
            <div className={`${styles.skeletonText}`} style={{width: '60%', height: '20px', marginTop: '10px'}}></div>
            <div className={`${styles.skeletonText}`} style={{width: '40%', height: '28px', marginTop: '20px'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.productDetailWrapper}>
        {/* Image Section */}
        <div className={styles.imageSection}>
          <div className={styles.mainImageWrapper}>
            <Image 
              src={productData.images[selectedImage]} 
              alt={productData.name}
              width={400}
              height={400}
              className={styles.mainImage}
            />
            <button className={styles.expandButton} aria-label="Expand image">
              <ExpandIcon size={20} />
            </button>
          </div>
          
          <div className={styles.thumbnailWrapper}>
            {productData.images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailSelected : styles.thumbnailDefault}`}
                onClick={() => setSelectedImage(index)}
              >
                <Image 
                  src={image} 
                  alt={`Product view ${index + 1}`} 
                  width={90}
                  height={70}
                  className={styles.thumbnailImage} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Detail Section */}
        <div className={styles.detailSection}>
          <div className={styles.header}>
            <h1 className={styles.productTitle}>{productData.name}</h1>
            {productData.discount && (
              <span className={styles.discountBadge}>{productData.discount}% OFF</span>
            )}
          </div>

          <div className={styles.ratingWrapper}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(star => (
                <span key={star} className={styles.star}>☆</span>
              ))}
            </div>
            <span className={styles.reviewCount}>({productData.reviews} customer reviews)</span>
            <div className={styles.stockStatus}>
              <span className={styles.stockDot}></span>
              <span className={styles.stockText}>In Stock</span>
            </div>
          </div>

          <div className={styles.priceWrapper}>
            <span className={styles.label}>Price:</span>
            <div className={styles.priceContainer}>
              <span className={styles.originalPrice}>Ksh {productData.originalPrice}</span>
              <span className={styles.currentPrice}>Ksh {productData.currentPrice}</span>
            </div>
          </div>

          <div className={styles.colorWrapper}>
            <span className={styles.label}>Color:</span>
            <div className={styles.colorOptions}>
              {productData.colors.map(color => (
                <button
                  key={color}
                  className={`${styles.colorButton} ${styles[`color${color.charAt(0).toUpperCase() + color.slice(1)}`]} ${selectedColor === color ? styles.colorButtonSelected : ''}`}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                />
              ))}
            </div>
          </div>

          <div className={styles.actionWrapper}>
            <div className={styles.quantityWrapper}>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                <MinusIcon />
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('increase')}
              >
                <PlusIcon />
              </button>
            </div>

            <button 
              className={styles.purchaseButton}
              onClick={handleAddToCart}
            >
              <CartIcon size={20} />
              Add to Cart
            </button>

            <button className={styles.wishlistButton} aria-label="Add to wishlist">
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}