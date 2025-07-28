"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Spoons from "@/public/assets/spoons.png";
import LoadingLogo from "@/app/components/loadingLogo";
import KitchenSet from "@/public/assets/kitchenset.png";
import Plates from "@/public/assets/plates.png";
import Spoon from "@/public/assets/spoons.png";
import Stainless from "@/public/assets/stainless.png";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";


function ProductList() {
  const searchParams = useSearchParams();
  const product = searchParams.get('product');

  const AllProducts = [
    {
      id: 1,
      name: "Digital Smart Toaster - 4 Slice",
      currentPrice: "450",
      originalPrice: "500",
      image: Spoons,
      images: [Spoons],
      category: "kitchen-appliances",
      productType: "kitchen-appliances",
      colors: ["black", "silver"],
      inStock: true,
      reviews: 12,
      discount: 10,
      description: "Premium digital smart toaster with 4-slice capacity, perfect for modern kitchens. Features advanced browning control, cancel function, and removable crumb tray for easy cleaning.",
    },          
    {
      id: 2,
      name: "Premium Kitchen Cookware Set - 12 Pieces",
      currentPrice: "299",
      originalPrice: "399",
      image: KitchenSet,
      images: [KitchenSet],
      category: "cookware",
      productType: "cookware-sets",
      colors: ["black", "red"],
      inStock: true,
      reviews: 8,
      discount: 25,
      description: "Complete 12-piece non-stick cookware set for all your cooking needs",
    },
    {
      id: 3,
      name: "Elegant Ceramic Dinner Plates Set - 6 Pieces",
      currentPrice: "89",
      originalPrice: "120",
      image: Plates,
      images: [Plates],
      category: "dinnerware",
      productType: "dinnerware-sets",
      colors: ["white", "blue"],
      inStock: true,
      reviews: 15,
      discount: 26,
      description: "Beautiful ceramic dinner plates set, dishwasher and microwave safe",
    },
    {
      id: 4,
      name: "Stainless Steel Serving Spoons - 8 Pack",
      currentPrice: "45",
      originalPrice: "65",
      image: Spoon,
      images: [Spoon],
      category: "utensils",
      productType: "serving-utensils",
      colors: ["silver"],
      inStock: true,
      reviews: 6,
      discount: 31,
      description: "Durable stainless steel serving spoons, rust-resistant and dishwasher safe",
    },
    {
      id: 5,
      name: "Professional Stainless Steel Mixing Bowls - 5 Set",
      currentPrice: "125",
      originalPrice: "175",
      image: Stainless,
      images: [Stainless],
      category: "mixing-bowls",
      productType: "mixing-bowls",
      colors: ["silver"],
      inStock: true,
      reviews: 10,
      discount: 29,
      description: "Professional grade stainless steel mixing bowls with non-slip base",
    },
    {
      id: 6,
      name: "Professional Stainless Steel Mixing Bowls - 5 Set",
      currentPrice: "125",
      originalPrice: "175",
      image: Stainless,
      images: [Stainless],
      category: "mixing-bowls",
      productType: "mixing-bowls",
      colors: ["silver"],
      inStock: false,
      reviews: 0,
      discount: 29,
      description: "Professional grade stainless steel mixing bowls with non-slip base",
    },
  ];

  // Filter products based on product query parameter
  const filteredProducts = product 
    ? AllProducts.filter(item => item.productType === product)
    : AllProducts;

  if (filteredProducts.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text={product ? `No products found for "${product}"` : "No products found"}
          Alt="Product not found"
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

function ProductsLoading() {
  return (
    <section className={styles.productWrapper}>
    <LoadingLogo/>
    </section>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductList />
    </Suspense>
  );
}