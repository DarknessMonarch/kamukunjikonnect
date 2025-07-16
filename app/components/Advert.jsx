"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "@/app/style/advert.module.css";
import Spoons from "@/public/assets/spoons.png";
import KitchenSet from "@/public/assets/kitchenset.png";
import Plates from "@/public/assets/plates.png";
import Spoon from "@/public/assets/spoons.png";

export default function Advert() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slideTransition, setSlideTransition] = useState(false);

  const mockFeaturedProducts = [
    {
      id: 1,
      name: "Premium Stainless Steel Spoon Set",
      description:
        "- Professional-grade stainless steel construction with elegant mirror finish for modern dining experiences",
      discount: 35,
      image: Spoons,
      brand: "ChefMaster",
    },
    {
      id: 2,
      name: "Complete Kitchen Utensil Collection",
      description:
        "- Everything you need for your kitchen with premium materials and ergonomic design for everyday cooking",
      discount: 40,
      image: KitchenSet,
      brand: "KitchenPro",
    },
    {
      id: 3,
      name: "Elegant Ceramic Plate Set",
      description:
        "- Beautiful ceramic dinnerware set with timeless design perfect for any dining occasion and easy maintenance",
      discount: 25,
      image: Plates,
      brand: "DiningElite",
    },
  ];

  const mockProducts = [
    {
      id: 1,
      name: "Premium Stainless Steel Spoon Set",
      currentPrice: 280,
      originalPrice: 400,
      image: Spoons,
      category: "cutlery",
    },
    {
      id: 2,
      name: "Complete Kitchen Utensil Collection",
      currentPrice: 850,
      originalPrice: 1200,
      image: KitchenSet,
      category: "kitchen-tools",
    },
    {
      id: 3,
      name: "Elegant Ceramic Plate Set",
      currentPrice: 320,
      originalPrice: 450,
      image: Plates,
      category: "dinnerware",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFeaturedProducts(mockFeaturedProducts);
      setProducts(mockProducts);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (featuredProducts.length > 1) {
      const interval = setInterval(() => {
        setSlideTransition(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
          setSlideTransition(false);
        }, 250);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  const handleSlideChange = (index) => {
    if (index !== currentSlide) {
      setSlideTransition(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setSlideTransition(false);
      }, 250);
    }
  };

  const handleShopNow = (productId) => {
    // Handle shop now action
    console.log(`Shopping for product: ${productId}`);
  };

  if (loading) {
    return (
      <div className={styles.advertContainer}>
        <div className={styles.advertContent}>
          <div className={styles.advertLoadingState}>
            <div className={styles.advertLoadingSpinner}></div>
          </div>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className={styles.advertContainer}>
        <div className={styles.advertContent}>
          <div className={styles.advertLoadingState}>
            <p>No featured products available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentSlide];

  return (
    <div className={styles.advertHero}>
      <div className={styles.advertTextSection}>
        <span>{currentProduct?.brand}</span>
        <h1>UP TO {currentProduct?.discount}% OFF</h1>
        <p className={styles.advertDescription}>
          {currentProduct?.name} {currentProduct?.description}
        </p>
        <button
          className={styles.advertButton}
          onClick={() => handleShopNow(currentProduct?.id)}
        >
          Buy Now
        </button>
      </div>

      <div className={styles.advertImageSection}>
        <Image
          src={currentProduct?.image}
          alt={currentProduct?.name || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={100}
          priority={true}
          className={`${styles.advertImage} ${
            slideTransition ? styles.advertSlideTransition : ""
          }`}
        />
      </div>

      {featuredProducts.length > 1 && (
        <div className={styles.advertPagination}>
          {featuredProducts.map((_, index) => (
            <div
              key={index}
              className={`${styles.advertPaginationDot} ${
                index === currentSlide ? styles.active : ""
              }`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
