"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingLogo from "@/app/components/loadingLogo";
import Spoons from "@/public/assets/spoons.png";
import KitchenSet from "@/public/assets/kitchenset.png";
import Plates from "@/public/assets/plates.png";
import Spoon from "@/public/assets/spoons.png";
import Stainless from "@/public/assets/stainless.png";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";

// Separate component that uses useSearchParams
function CategoryContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const AllProducts = [
    {
      id: 1,
      name: "Digital Smart Toaster - 4 Slice",
      currentPrice: "450",
      originalPrice: "500",
      image: Spoons,
      category: "kitchen-appliances",
      description:
        "Premium digital smart toaster with 4-slice capacity, perfect for modern kitchens",
    },
    {
      id: 2,
      name: "Premium Kitchen Cookware Set - 12 Pieces",
      currentPrice: "299",
      originalPrice: "399",
      image: KitchenSet,
      category: "cookware",
      description:
        "Complete 12-piece non-stick cookware set for all your coding needs",
    },
    {
      id: 3,
      name: "Elegant Ceramic Dinner Plates Set - 6 Pieces",
      currentPrice: "89",
      originalPrice: "120",
      image: Plates,
      category: "dinnerware",
      description:
        "Beautiful ceramic dinner plates set, dishwasher and microwave safe",
    },
    {
      id: 4,
      name: "Stainless Steel Serving Spoons - 8 Pack",
      currentPrice: "45",
      originalPrice: "65",
      image: Spoon,
      category: "utensils",
      description:
        "Durable stainless steel serving spoons, rust-resistant and dishwasher safe",
    },
    {
      id: 5,
      name: "Professional Stainless Steel Mixing Bowls - 5 Set",
      currentPrice: "125",
      originalPrice: "175",
      image: Stainless,
      category: "mixing-bowls",
      description:
        "Professional grade stainless steel mixing bowls with non-slip base",
    },
    {
      id: 6,
      name: "Professional Stainless Steel Mixing Bowls - 5 Set",
      currentPrice: "125",
      originalPrice: "175",
      image: Stainless,
      category: "mixing-bowls",
      description:
        "Professional grade stainless steel mixing bowls with non-slip base",
    },
  ];

  // Filter products based on category query parameter
  const filteredProducts = category 
    ? AllProducts.filter(product => product.category === category)
    : AllProducts;

  if (filteredProducts.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text={category ? `No products found in "${category}" category` : "No products found"}
          Alt="Category not found"
        />
      </section>
    );
  }

  return (
    <section className={styles.productWrapper}>
      <div className={styles.productGrid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
}

// Loading fallback component
function CategoryFallback() {
  return (
    <section className={styles.productWrapper}>
      <LoadingLogo />
    </section>
  );
}

export default function Category() {
  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryContent />
    </Suspense>
  );
}