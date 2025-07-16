"use client";

import Spoons from "@/public/assets/spoons.png";
import KitchenSet from "@/public/assets/kitchenset.png";
import Plates from "@/public/assets/plates.png";
import Spoon from "@/public/assets/spoons.png";
import Stainless from "@/public/assets/stainless.png";
import styles from "@/app/style/product.module.css";
import ProductCard from "@/app/components/productCard";
import Nothing from "@/app/components/Nothing";
import EmptyCart from "@/public/assets/emptycart.png";

export default function NewProduct() {
  const Products = [
 {
      id: 1,
      name: "Digital Smart Toaster - 4 Slice",
      currentPrice: "450",
      originalPrice: "500",
      image: Spoons,
      category: "appliances",
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
        "Complete 12-piece non-stick cookware set for all your cooking needs",
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

  if (Products.length === 0) {
    return (
      <section className={styles.emptyProductWrapper}>
        <Nothing
          NothingImage={EmptyCart}
          Text="No products added yet"
          Alt="No products added yet"
        />
      </section>
    );
  }
  return (
    <section className={styles.productWrapper}>
      <div className={styles.productHeader}>
        <h2>New Arrival</h2>
        <button
          aria-label="View All Products"
          disabled={!Products}
          className={styles.viewAllButton}
        >
          View All
        </button>
      </div>

      <div className={styles.productGrid}>
        {Products.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </section>
  );
}
