"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function About() {
  useEffect(() => {
    const sections = document.querySelectorAll(`.${styles.section}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(20px)";
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.info}>
      <div className={styles.infoHeader}>
        <h1>About Kamukunjikonnect</h1>
      </div>
      <div className={styles.section}>
        <h2>
          KamukunjiConnect is your premier destination for quality kitchen appliances and cookware.
        </h2>
        <p>
          We specialize in providing modern kitchens with premium appliances, cookware, and kitchenware that combine functionality with style. Our carefully curated selection features top-quality products designed to enhance your culinary experience. From professional-grade cookware to innovative kitchen gadgets, we offer everything you need to create the perfect cooking environment. Our user-friendly online platform ensures a seamless shopping experience across all devices, making it easy to find and purchase the kitchen essentials you need.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Why Choose KamukunjiConnect?</h2>
        <p>
          At KamukunjiConnect, we are committed to delivering exceptional quality and value to our customers. Our products are sourced from trusted manufacturers and undergo rigorous quality checks to ensure they meet our high standards. We offer competitive prices, fast delivery, and excellent customer service to make your shopping experience as smooth as possible. Whether you're a professional chef or a home cooking enthusiast, our extensive range of kitchen products caters to all skill levels and culinary needs.
        </p>
      </div>
      <div className={styles.section}>
        <h2>The Importance of Quality Kitchen Equipment</h2>
        <p>
          Investing in quality kitchen appliances and cookware is essential for anyone who values cooking and food preparation. Good equipment not only makes cooking more enjoyable but also produces better results and lasts longer, providing excellent value for money. At KamukunjiConnect, we understand that the right tools can transform your cooking experience, whether you're preparing a quick weekday meal or hosting an elaborate dinner party. Our products are designed to withstand daily use while maintaining their performance and appearance over time.
        </p>
      </div>
       
      <div className={styles.section}>
        <h2>
          Why Quality Kitchen Appliances Matter for Your Home
        </h2>
        <p>
          Quality kitchen appliances are the foundation of an efficient and enjoyable cooking experience. They offer reliability, durability, and superior performance that make meal preparation easier and more satisfying. Here's why investing in premium kitchen equipment is worthwhile:
        </p>

        <ul className={styles.bulletList}>
          <li>
            Durability and Longevity: High-quality appliances and cookware are built to last, offering years of reliable service and reducing the need for frequent replacements.
          </li>
          <li>
            Enhanced Cooking Performance: Premium equipment provides better heat distribution, temperature control, and cooking results, helping you create restaurant-quality meals at home.
          </li>
          <li>
            Energy Efficiency: Modern quality appliances are designed to be energy-efficient, helping you save on utility bills while reducing your environmental footprint.
          </li>
          <li>
            Safety Features: Quality kitchen equipment includes advanced safety features that protect you and your family during food preparation and cooking.
          </li>
          <li>
            Time-Saving Convenience: Well-designed appliances and tools streamline cooking processes, making meal preparation faster and more efficient.
          </li>
        </ul>
        <p>
          Transform your kitchen into a culinary haven with our premium selection of appliances and cookware. Every product in our collection is chosen for its quality, functionality, and ability to enhance your cooking experience.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Shopping Tips for Kitchen Equipment</h2>
        <p>
          When shopping for kitchen appliances and cookware, consider your cooking habits, kitchen space, and budget. We recommend starting with essential items like quality cookware sets, reliable appliances, and versatile tools that serve multiple purposes. Our product descriptions include detailed specifications and usage recommendations to help you make informed decisions. Take advantage of our customer reviews and expert recommendations to find products that best suit your needs. Remember that investing in quality equipment upfront often saves money in the long run through durability and performance.
        </p>
      </div>
      <div className={styles.section}>
        <h2>Our Product Categories</h2>
        <p>
          Explore our comprehensive range of kitchen essentials across these categories:
        </p>
        <ul className={styles.bulletList}>
          <li>Premium Cookware Sets</li>
          <li>Kitchen Appliances</li>
          <li>Bakeware & Baking Tools</li>
          <li>Kitchen Gadgets & Accessories</li>
          <li>Professional Chef Tools</li>
        </ul>
      </div>
      <div className={styles.section}>
        <p>
          KamukunjiConnect is your trusted partner in creating the perfect kitchen. We provide quality products, competitive prices, and exceptional service to help you build a kitchen that inspires culinary creativity. With fast delivery and comprehensive customer support, we make it easy to upgrade your kitchen with confidence.
        </p>
      </div>
    </div>
  );
}