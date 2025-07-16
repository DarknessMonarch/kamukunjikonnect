"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import Advert from "@/app/components/Advert";
import Product from "@/app/components/Product";
import Category from "@/app/components/Category";
import styles from "@/app/style/home.module.css";
import Washing from "@/public/assets/washing.png";
import Toaster from "@/public/assets/toaster.png";
import Product1 from "@/public/assets/product1.jpg";
import Product2 from "@/public/assets/product2.jpg";
import Testimonials from "./components/Testimonials";
import NewProduct from "@/app/components/NewProduct";
import LimitedOffers from "./components/LimitedOffers";

import { BiSupport as SupportIcon } from "react-icons/bi";
import { FaShippingFast as ShippingIcon } from "react-icons/fa";
import { PiDiamondsFourFill as QualityIcon } from "react-icons/pi";
import { RiSecurePaymentLine as ShieldIcon } from "react-icons/ri";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const mockFeaturedProducts = [
    {
      id: 1,
      name: "Premium Non-Stick Cookware Set",
      description:
        "Professional-grade non-stick cookware set with heat-resistant handles and durable coating for everyday cooking",
      discount: 30,
      image: Product1,
      brand: "ChefMaster",
    },
    {
      id: 2,
      name: "Stainless Steel Kitchen Utensil Set",
      description:
        "Complete kitchen utensil set with ergonomic handles and premium stainless steel construction for modern kitchens",
      discount: 25,
      image: Product2,
      brand: "KitchenPro",
    },
  ];

  const mockProducts = [
    {
      id: 1,
      name: "Digital Smart Toaster - 4 Slice",
      currentPrice: 450,
      originalPrice: 500,
      image: Toaster,
      category: "appliances",
    },
    {
      id: 2,
      name: "Compact Dishwasher - Energy Efficient",
      currentPrice: 600,
      originalPrice: 899,
      image: Washing,
      category: "appliances",
    },
  ];

  const Features = [
    {
      id: 1,
      icon: ShippingIcon,
      title: "Free Shipping",
      description: "coming soon",
    },
    {
      id: 2,
      icon: QualityIcon,
      title: "High Quality",
      description: "all products are high quality",
    },
    {
      id: 3,
      icon: ShieldIcon,
      title: "Secure Payments",
      description: "Guarantee secure payments",
    },
    {
      id: 4,
      icon: SupportIcon,
      title: "Fulltime Customer Support",
      description: "Anywhere & anytime",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFeaturedProducts(mockFeaturedProducts);
        setProducts(mockProducts);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {


    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleShopNow = (productId) => {
    console.log(`Shopping for product ${productId}`);
    alert(`Added product ${productId} to cart!`);
  };

  const handleProductClick = (product) => {
    // Simulate product click
    console.log(`Clicked on ${product.name}`);
    alert(`Viewing ${product.name}`);
  };

  const currentProduct = featuredProducts[currentSlide] || featuredProducts[0];

  const HeroSkeleton = () => (
    <div className={`${styles.heroCard} skeleton`}></div>
  );

  const SideProductsSkeleton = () => (
    <div className={styles.sideProducts}>
      {[1, 2].map((index) => (
        <div key={index} className={`${styles.loadingProductCard} skeleton`}></div>
      ))}
    </div>
  );

  return (
    <main className={styles.homeContainer}>
      <div className={styles.mainContent}>
        {loading ? (
          <>
            <HeroSkeleton />
            <SideProductsSkeleton />
          </>
        ) : (
          <>
            {/* Hero Section */}
            <div className={styles.heroCard}>
              <div className={styles.productInfo}>
                <h2>{currentProduct?.name}</h2>
                <p>{currentProduct?.description}</p>
                <button
                  className={styles.shopButton}
                  onClick={() => handleShopNow(currentProduct?.id)}
                >
                  Shop Now
                </button>
              </div>
              {currentProduct && (
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  sizes="100%"
                  quality={100}
                  style={{ objectFit: "cover" }}
                  priority={true}
                  className={styles.herocardImage}
                />
              )}

              <div className={styles.pagination}>
                {featuredProducts.map((_, index) => (
                  <div
                    key={index}
                    className={`${styles.paginationDot} ${
                      index === currentSlide ? styles.active : ""
                    }`}
                    onClick={() => handleSlideChange(index)}
                  ></div>
                ))}
              </div>
            </div>

            {/* Side Products */}
            <div className={styles.sideProducts}>
              {products.map((product) => (
                <div
                  key={product.id}
                  className={styles.productCard}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles.productDetails}>
                    <h3>{product.name}</h3>
                    <div className={styles.pricing}>
                      <span>Ksh {product.currentPrice}</span>
                      <span>Ksh {product.originalPrice}</span>
                    </div>
                  </div>
                  <div className={styles.productImageContainer}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="100%"
                      quality={100}
                      style={{ objectFit: "contain" }}
                      priority={true}
                      className={styles.productImage}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Static content that renders immediately */}
      <div className={styles.features}>
        {Features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className={styles.featureItem}>
              <IconComponent className={styles.featureIcon} />
              <div className={styles.featureText}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Category />
      <Product />
      <Advert />
      <NewProduct />
      <LimitedOffers />
      <Testimonials />
    </main>
  );
}
