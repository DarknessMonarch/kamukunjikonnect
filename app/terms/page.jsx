"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function TermsOfUse() {
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
        <h1>Terms of Use</h1>
      </div>
      
      <div className={styles.section}>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using the KamukunjiConnect website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These terms apply to all users of our website, including browsers, customers, and contributors of content.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on KamukunjiConnect's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className={styles.bulletList}>
          <li>Modify or copy the materials without written permission</li>
          <li>Use the materials for commercial purposes or public display</li>
          <li>Attempt to reverse engineer any software on our website</li>
          <li>Remove copyright or proprietary notations from materials</li>
          <li>Transfer materials to another person or mirror on another server</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>User Accounts and Responsibilities</h2>
        <p>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
        </p>
        <ul className={styles.bulletList}>
          <li>Maintain accurate and up-to-date account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any security breaches</li>
          <li>Accept responsibility for all activities under your account</li>
          <li>Use our services only for lawful purposes</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Product Information and Pricing</h2>
        <p>
          We strive to provide accurate product descriptions, images, and pricing for all kitchen appliances and cookware on our website. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information at any time without prior notice.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Orders and Payment</h2>
        <p>
          By placing an order through our website, you offer to purchase products subject to these terms. All orders are subject to availability and confirmation of the order price. We reserve the right to refuse or cancel any order for any reason at any time. Payment must be received before processing and shipping of orders.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Prohibited Uses</h2>
        <p>
          You may not use our website or services for any illegal or unauthorized purpose. You agree not to:
        </p>
        <ul className={styles.bulletList}>
          <li>Violate any applicable laws or regulations</li>
          <li>Transmit viruses, worms, or malicious code</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use our website to spam or send unsolicited communications</li>
          <li>Interfere with or disrupt our website or servers</li>
          <li>Collect user information without consent</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Intellectual Property Rights</h2>
        <p>
          The service and its original content, features, and functionality are and will remain the exclusive property of KamukunjiConnect and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Disclaimer and Limitation of Liability</h2>
        <p>
          The information on this website is provided on an 'as is' basis. To the fullest extent permitted by law, we exclude all representations, warranties, conditions, and other terms which might otherwise have effect in relation to our website and services. We shall not be liable for any damages arising from the use of our website or services.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Privacy Policy</h2>
        <p>
          Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including breach of the Terms. Upon termination, your right to use the service will cease immediately.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of our service after any changes constitutes acceptance of the new Terms.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Last Updated:</strong> January 2025
        </p>
        <p>
          If you have any questions about these Terms of Use, please contact us through our customer service channels. These terms ensure a safe and fair shopping environment for all customers purchasing premium kitchen appliances and cookware from KamukunjiConnect.
        </p>
      </div>
    </div>
  );
}