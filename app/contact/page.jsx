"use client";

import { useEffect, useState } from "react";
import styles from "@/app/style/contact.module.css";
import Dropdown from "@/app/components/Dropdown"; 

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const subjectOptions = [
    { value: "product-inquiry", label: "Product Inquiry" },
    { value: "order-status", label: "Order Status" },
    { value: "returns-exchanges", label: "Returns & Exchanges" },
    { value: "technical-support", label: "Technical Support" },
    { value: "bulk-orders", label: "Bulk Orders" },
    { value: "feedback", label: "Feedback" },
    { value: "other", label: "Other" },
  ];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectSelect = (option) => {
    setFormData((prev) => ({
      ...prev,
      subject: option.value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject) {
      alert("Please select a subject");
      return;
    }
    
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const selectedSubject = subjectOptions.find(option => option.value === formData.subject);

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactHeader}>
        <h1>Contact Us</h1>
      </div>

      <div className={styles.section}>
        <h2>Get in Touch with KamukunjiConnect</h2>
        <p>
          We're here to help you find the perfect kitchen appliances and
          cookware for your culinary needs. Whether you have questions about our
          products, need assistance with an order, or want to provide feedback,
          our customer service team is ready to assist you. Reach out to us
          through any of the methods below.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Contact Information</h2>
        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <h3>Customer Service</h3>
            <p>
              <strong>Phone:</strong> (+254) 743 161 569
            </p>
            <p>
              <strong>Email:</strong> kamukunjikonnect@gmail.com
            </p>
            <p>
              <strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM EAT
            </p>
          </div>

          <div className={styles.contactItem}>
            <h3>Sales Inquiries</h3>
            <p>
              <strong>Phone:</strong>(+254) 743 161 569
            </p>
            <p>
              <strong>Email:</strong>  kamukunjikonnect@gmail.com
            </p>
            <p>
              <strong>Hours:</strong> Monday - Saturday, 9:00 AM - 7:00 PM EAT
            </p>
          </div>

          <div className={styles.contactItem}>
            <h3>Business Address</h3>
            <p>Kamukunjikonnect Ltd.</p>
            <p>Nairobi, Kenya</p>
            <p>
              <strong>Postal Code:</strong> 00100
            </p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Send Us a Message</h2>
        <p>
          Have a specific question or need personalized assistance? Fill out the
          form below and we'll get back to you within 24 hours during business
          days.
        </p>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subject">Subject *</label>
            <div className={styles.dropdownContainer}>
    <Dropdown
              options={subjectOptions}
              onSelect={handleSubjectSelect}
              dropPlaceHolder="Select a subject"
              value={selectedSubject}
            />
            </div>
        
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="6"
              placeholder="Please provide details about your inquiry..."
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Send Message
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <p>
          Before contacting us, you might find the answer to your question in
          our FAQ section:
        </p>
        <ul className={styles.bulletList}>
          <li>
            <strong>Order Processing:</strong> Orders are typically processed
            within 1-2 business days
          </li>
          <li>
            <strong>Shipping:</strong> We offer free shipping on orders over KSh
            5,000 within Nairobi
          </li>
          <li>
            <strong>Returns:</strong> 30-day return policy on all unused items
            in original packaging
          </li>
          <li>
            <strong>Warranty:</strong> All appliances come with manufacturer
            warranty coverage
          </li>
          <li>
            <strong>Payment:</strong> We accept M-Pesa, bank transfers, and
            major credit cards
          </li>
        </ul>
      </div>


      <div className={styles.section}>
        <p>
          <strong>Response Time:</strong> We aim to respond to all inquiries
          within 24 hours during business days. For urgent matters, please call
          our customer service line directly.
        </p>
      </div>
    </div>
  );
}