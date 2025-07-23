"use client";

import { useEffect } from "react";
import styles from "@/app/style/info.module.css";

export default function PrivacyPolicy() {
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
        <h1>Privacy Policy</h1>
      </div>
      <div className={styles.section}>
        <h2>Information We Collect</h2>
        <p>
          At KamukunjiConnect, we are committed to protecting your privacy and ensuring the security of your personal information. We collect information that you provide directly to us when you create an account, make a purchase, subscribe to our newsletter, or contact our customer service team. This includes your name, email address, phone number, billing and shipping addresses, and payment information.
        </p>
      </div>
      
      <div className={styles.section}>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services. This includes processing your orders, communicating with you about your purchases, providing customer support, and sending you updates about new products and promotions (with your consent).
        </p>
        <ul className={styles.bulletList}>
          <li>Processing and fulfilling your orders for kitchen appliances and cookware</li>
          <li>Providing customer support and responding to your inquiries</li>
          <li>Sending order confirmations and shipping notifications</li>
          <li>Improving our website functionality and user experience</li>
          <li>Sending promotional emails and newsletters (with your consent)</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Information Sharing and Disclosure</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, provided they agree to keep this information confidential.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. We use SSL encryption for all transactions and store your data on secure servers. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Cookies and Tracking Technologies</h2>
        <p>
          Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our website.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Your Rights and Choices</h2>
        <p>
          You have the right to access, update, or delete your personal information. You can also opt out of receiving promotional communications from us at any time. To exercise these rights, please contact us using the information provided in our Contact Us section.
        </p>
        <ul className={styles.bulletList}>
          <li>Access and review your personal information</li>
          <li>Update or correct your account information</li>
          <li>Delete your account and personal data</li>
          <li>Opt out of marketing communications</li>
          <li>Request a copy of your data in a portable format</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the effective date. Your continued use of our services after any changes constitutes acceptance of the updated privacy policy.
        </p>
      </div>

      <div className={styles.section}>
        <p>
          <strong>Last Updated:</strong> January 2025
        </p>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our customer service channels. We are committed to addressing your concerns and ensuring your privacy is protected while you shop for premium kitchen appliances and cookware at KamukunjiConnect.
        </p>
      </div>
    </div>
  );
}