"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function RefundPolicy() {
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
        <h1>Refund Policy</h1>  
      </div>
      
      <div className={styles.section}>
        <h2>Our 30-Day Return Guarantee</h2>
        <p>
          At KamukunjiConnect, we stand behind the quality of our kitchen appliances and cookware. We offer a comprehensive 30-day return policy to ensure your complete satisfaction. If you're not entirely happy with your purchase, you can return it within 30 days of delivery for a full refund or exchange.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Return Eligibility Requirements</h2>
        <p>
          To be eligible for a return, items must meet the following conditions:
        </p>
        <ul className={styles.bulletList}>
          <li>Items must be returned within 30 days of delivery date</li>
          <li>Products must be in original, unused condition with all accessories</li>
          <li>Original packaging and documentation must be included</li>
          <li>Items must not show signs of wear, damage, or misuse</li>
          <li>Personalized or custom-made items are not eligible for return</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Non-Returnable Items</h2>
        <p>
          Certain items cannot be returned for health and safety reasons or due to their nature:
        </p>
        <ul className={styles.bulletList}>
          <li>Perishable goods and food items</li>
          <li>Personal care items that have been opened or used</li>
          <li>Custom or personalized kitchenware</li>
          <li>Items damaged by misuse or normal wear and tear</li>
          <li>Products purchased with special promotional discounts (case-by-case basis)</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>How to Initiate a Return</h2>
        <p>
          Starting your return is simple and convenient. Contact our customer service team within 30 days of receiving your order to initiate the return process. We'll provide you with a return authorization number and detailed instructions for shipping your item back to us.
        </p>
        <ul className={styles.bulletList}>
          <li>Contact customer service via email or phone</li>
          <li>Provide your order number and reason for return</li>
          <li>Receive return authorization and shipping instructions</li>
          <li>Package items securely with original materials</li>
          <li>Ship using provided return label or approved carrier</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Refund Processing Time</h2>
        <p>
          Once we receive your returned item, we'll inspect it and process your refund within 5-7 business days. Refunds will be issued to the original payment method used for the purchase. Please note that it may take an additional 3-5 business days for the refund to appear in your account, depending on your bank or credit card company.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Exchange Policy</h2>
        <p>
          We're happy to exchange items for a different size, color, or model within our 30-day return window. Exchanges follow the same eligibility requirements as returns. If there's a price difference, we'll either refund the difference or request additional payment as needed.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Damaged or Defective Items</h2>
        <p>
          If you receive a damaged or defective item, please contact us immediately. We'll arrange for a replacement or immediate refund at no cost to you. Take photos of the damage and keep all packaging materials for our inspection. We may arrange for pickup of damaged items at our expense.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Return Shipping Costs</h2>
        <p>
          Return shipping costs vary depending on the reason for return. If the item is defective or we made an error, we'll cover all return shipping costs. For other returns, customers are responsible for return shipping fees unless the item qualifies for our free return shipping promotion.
        </p>
      </div>

      <div className={styles.section}>
        <h2>International Returns</h2>
        <p>
          International customers can return items following the same 30-day policy. However, customers are responsible for return shipping costs and any customs duties or taxes. We recommend using a trackable shipping method and purchasing shipping insurance for valuable items.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Questions about returns?</strong> Our customer service team is here to help! Contact us with any questions about our return policy or to start a return. We're committed to making your experience with KamukunjiConnect as smooth and satisfying as possible.
        </p>
      </div>
    </div>
  );
}