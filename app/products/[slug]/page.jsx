"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";
import LoadingLogo from "@/app/components/loadingLogo";
import styles from "@/app/style/productInfo.module.css";
import ProductDetail from "@/app/components/productDetail";

import Spoons from "@/public/assets/spoons.png";

const products = [
  {
    id: 1,
    name: "Digital Smart Toaster - 4 Slice",
    currentPrice: "450",
    originalPrice: "500",
    images: [
      Spoons,
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    ],
    colors: ["black", "silver"],
    inStock: true,
    reviews: 12,
    discount: 10,
    category: "appliances",
    description: "Premium digital smart toaster with 4-slice capacity, perfect for modern kitchens. Features advanced browning control, cancel function, and removable crumb tray for easy cleaning.",
  }
];

export default function ProductSpecific() {
  const params = useParams();
  const slug = params.slug;

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 800));

        const decodedSlug = decodeURIComponent(slug);
        
        const product = products.find(p => 
          p.name === decodedSlug || // if using product name (decoded)
          p.id.toString() === slug || // if using product ID
          p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug // if using name-based slug
        );

        if (!product) {
          setError("Product not found");
          setProductData(null);
        } else {
          setProductData(product);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load product");
        setProductData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Handler for tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingLogo />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.productEmptyInfo}>
        <Nothing
          NothingImage={EmptyCart}
          Text="Product not found"
          Alt="Product not found"
        />
      </div>
    );
  }

  // Don't render anything if no product data
  if (!productData) {
    return null;
  }

  return (
    <div className={styles.productinfo}>
      <ProductDetail productData={productData} loading={false} />
      
      <div className={styles.productnavinfo}>
        <button 
          className={`${styles.productNavButton} ${activeTab === "description" ? styles.active : ""}`}
          onClick={() => handleTabClick("description")}
        >
          Description
        </button>
        <button 
          className={`${styles.productNavButton} ${activeTab === "reviews" ? styles.active : ""}`}
          onClick={() => handleTabClick("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className={styles.productContent}>
        {activeTab === "description" && (
          <div className={styles.productDescription}>
            <p>{productData.description}</p>
          </div>
        )}
        
        {activeTab === "reviews" && (
          <div className={styles.productReviews}>
            {productData.reviews > 0 ? (
              <div>
                <h3>Customer Reviews ({productData.reviews})</h3>
                <p>Reviews will be displayed here...</p>
              </div>
            ) : (
              <div>
                <h3>No Reviews Yet</h3>
                <p>Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}