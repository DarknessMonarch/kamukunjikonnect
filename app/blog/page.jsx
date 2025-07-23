"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Nothing from "@/app/components/Nothing";
import styles from "@/app/style/blog.module.css";
import EmptyBlog from "@/public/assets/emptyblog.png";
import KitchenHero from "@/public/assets/kitchenset.png";

export default function Blog() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const featuredArticle = {
    id: 1,
    title: "10 Essential Kitchen Appliances Every Modern Cook Needs in 2025",
    excerpt:
      "Discover the must-have kitchen appliances that will transform your cooking experience. From smart pressure cookers to professional-grade blenders, we've curated the ultimate list for culinary enthusiasts.",
    author: "Chef Sarah Johnson",
    date: "July 20, 2025",
    readTime: "12 min read",
    category: "Kitchen Essentials",
    slug: "essential-kitchen-appliances-2025",
    image: KitchenHero,
    featured: true,
  };

  const cookingArticles = [
    {
      id: 2,
      title: "How to Choose the Perfect Non-Stick Cookware Set",
      excerpt:
        "Learn the key factors to consider when selecting non-stick cookware that will last for years. Our comprehensive guide covers materials, coatings, and maintenance tips.",
      author: "Mike Chen",
      date: "July 18, 2025",
      readTime: "8 min read",
      category: "Cookware Guide",
      slug: "choosing-perfect-nonstick-cookware",
      image: KitchenHero,
    },
    {
      id: 3,
      title: "Smart Kitchen Technology: The Future of Home Cooking",
      excerpt:
        "Explore the latest smart kitchen gadgets and appliances that are revolutionizing how we cook, from WiFi-enabled ovens to AI-powered meal planning assistants.",
      author: "Emma Rodriguez",
      date: "July 15, 2025",
      readTime: "10 min read",
      category: "Smart Kitchen",
      slug: "smart-kitchen-technology-future",
      image: KitchenHero,
    },
    {
      id: 4,
      title: "Knife Skills 101: Mastering Basic Cutting Techniques",
      excerpt:
        "Master essential knife skills with our step-by-step guide. Learn proper grip, cutting techniques, and how to maintain your knives for optimal performance.",
      author: "Chef Maria Lopez",
      date: "July 12, 2025",
      readTime: "15 min read",
      category: "Cooking Skills",
      slug: "knife-skills-cutting-techniques",
      image: KitchenHero,
    },
  ];

  const blogCategories = [
    "All Articles",
    "Kitchen Essentials",
    "Cookware Guide",
    "Smart Kitchen",
    "Cooking Skills",
    "Recipe Tips",
    "Product Reviews",
    "Kitchen Design",
  ];

    if (!cookingArticles || cookingArticles.length === 0) {
      return (
        <section className={styles.emptyProductWrapper}>
          <Nothing
            NothingImage={EmptyBlog}
            Text="No blog posted yet"
            Alt="No blog posted yet"
          />
        </section>
      );
    }
  

  if (loading) {
    return (
      <section className={styles.kitchenBlogContainer}>
        <div className={styles.blogHeroSection}>
          <h1>Kitchen Insights & Tips</h1>
          <p>
            Discover expert cooking tips, kitchen appliance reviews, and
            culinary inspiration.
          </p>
        </div>

        <div className={styles.blogMainContent}>
          <div
            className={`${styles.categoryNavigation} ${styles.fadeInAnimation}`}
          >
            <div className={styles.categoryButtonGroup}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={`${styles.categoryButtonSkeleton} skeleton`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    height: "36px",
                    minWidth: "80px",
                    maxWidth: "120px",
                    flex: "1 1 auto",
                    borderRadius: "5px",
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Featured Article Skeleton */}
          <div
            className={`${styles.featuredArticleSection} ${styles.fadeInAnimation}`}
          >
            <article className={styles.featuredArticleCard}>
              <div className={styles.featuredImageWrapper}>
                <div
                  className={`${styles.featuredArticleImageSkeleton} skeleton`}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "0",
                  }}
                ></div>
              </div>

              <div className={styles.featuredArticleContent}>
                <div className={styles.articleMetaInfo}>
                  <div
                    className={`${styles.categoryTagSkeleton} skeleton`}
                    style={{
                      height: "24px",
                      width: "90px",
                      borderRadius: "5px",
                    }}
                  ></div>
                  <div
                    className={`${styles.readingTimeSkeleton} skeleton`}
                    style={{
                      height: "16px",
                      width: "60px",
                      borderRadius: "3px",
                    }}
                  ></div>
                </div>

                <div
                  className={`${styles.featuredTitleSkeleton} skeleton`}
                  style={{
                    height: "2.5rem",
                    width: "95%",
                    borderRadius: "4px",
                    marginBottom: "8px",
                  }}
                ></div>

                <div
                  className={`${styles.featuredExcerptSkeleton} skeleton`}
                  style={{
                    height: "1.2rem",
                    width: "100%",
                    borderRadius: "3px",
                    marginBottom: "8px",
                  }}
                ></div>
                <div
                  className={`${styles.featuredExcerptSkeleton} skeleton`}
                  style={{
                    height: "1.2rem",
                    width: "80%",
                    borderRadius: "3px",
                  }}
                ></div>

                <div className={styles.authorInfoSection}>
                  <div className={styles.authorDetailsWrapper}>
                    <div
                      className={`${styles.authorNameSkeleton} skeleton`}
                      style={{
                        height: "18px",
                        width: "120px",
                        borderRadius: "3px",
                        marginBottom: "4px",
                      }}
                    ></div>
                    <div
                      className={`${styles.publishDateSkeleton} skeleton`}
                      style={{
                        height: "14px",
                        width: "100px",
                        borderRadius: "3px",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div
            className={`${styles.recentArticlesSection} ${styles.fadeInAnimation}`}
          >
            <div className={styles.articlesGridLayout}>
              {Array.from({ length: 3 }).map((_, index) => (
                <article
                  key={index}
                  className={`${styles.articleCard} ${styles.fadeInAnimation}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={styles.articleImageWrapper}>
                    <div
                      className={`${styles.articleImageSkeleton} skeleton`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "inherit",
                      }}
                    ></div>
                  </div>

                  <div className={styles.articleCardContent}>
                    <div className={styles.articleMetaInfo}>
                      <div
                        className={`${styles.categoryTagSkeleton} skeleton`}
                        style={{
                          height: "20px",
                          width: "75px",
                          borderRadius: "5px",
                        }}
                      ></div>
                      <div
                        className={`${styles.readingTimeSkeleton} skeleton`}
                        style={{
                          height: "14px",
                          width: "50px",
                          borderRadius: "3px",
                        }}
                      ></div>
                    </div>

                    <div
                      className={`${styles.articleTitleSkeleton} skeleton`}
                      style={{
                        height: "1.8rem",
                        width: "90%",
                        borderRadius: "4px",
                        marginBottom: "8px",
                      }}
                    ></div>

                    <div
                      className={`${styles.articleExcerptSkeleton} skeleton`}
                      style={{
                        height: "1rem",
                        width: "100%",
                        borderRadius: "3px",
                        marginBottom: "6px",
                      }}
                    ></div>
                    <div
                      className={`${styles.articleExcerptSkeleton} skeleton`}
                      style={{
                        height: "1rem",
                        width: "75%",
                        borderRadius: "3px",
                      }}
                    ></div>

                    <div className={styles.articleCardFooter}>
                      <div className={styles.authorInfoSection}>
                        <div
                          className={`${styles.authorNameSkeleton} skeleton`}
                          style={{
                            height: "16px",
                            width: "100px",
                            borderRadius: "3px",
                            marginBottom: "4px",
                          }}
                        ></div>
                        <div
                          className={`${styles.publishDateSkeleton} skeleton`}
                          style={{
                            height: "12px",
                            width: "80px",
                            borderRadius: "3px",
                          }}
                        ></div>
                      </div>

                      <div
                        className={`${styles.readMoreSkeleton} skeleton`}
                        style={{
                          height: "36px",
                          width: "100px",
                          borderRadius: "5px",
                        }}
                      ></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.kitchenBlogContainer}>
      <div className={styles.blogHeroSection}>
        <h1>Kitchen Insights & Tips</h1>
        <p>
          Discover expert cooking tips, kitchen appliance reviews, and culinary
          inspiration.
        </p>
      </div>

      <div className={styles.blogMainContent}>
        <div
          className={`${styles.categoryNavigation} ${styles.fadeInAnimation}`}
        >
          <div className={styles.categoryButtonGroup}>
            {blogCategories.map((category, index) => (
              <button
                key={category}
                className={`${styles.categoryFilterButton} ${
                  index === 0 ? styles.activeCategory : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`${styles.featuredArticleSection} ${styles.fadeInAnimation}`}
        >
          <article className={styles.featuredArticleCard}>
            <div className={styles.featuredImageWrapper}>
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className={styles.featuredArticleImage}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={100}
                priority={true}
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className={styles.featuredArticleContent}>
              <div className={styles.articleMetaInfo}>
                <span className={styles.categoryTag}>
                  {featuredArticle.category}
                </span>
                <span className={styles.readingTime}>
                  {featuredArticle.readTime}
                </span>
              </div>

              <h3>
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h3>

              <p>{featuredArticle.excerpt}</p>

              <div className={styles.authorInfoSection}>
                <div className={styles.authorDetailsWrapper}>
                  <span className={styles.authorNameText}>
                    {featuredArticle.author}
                  </span>
                  <span className={styles.publishDate}>
                    {featuredArticle.date}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div
          className={`${styles.recentArticlesSection} ${styles.fadeInAnimation}`}
        >
          <div className={styles.articlesGridLayout}>
            {cookingArticles.map((article, index) => (
              <article
                key={article.id}
                className={`${styles.articleCard} ${styles.fadeInAnimation}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={styles.articleImageWrapper}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    className={styles.articleCardImage}
                    width={400}
                    height={250}
                  />
                </div>

                <div className={styles.articleCardContent}>
                  <div className={styles.articleMetaInfo}>
                    <span className={styles.categoryTag}>
                      {article.category}
                    </span>
                    <span className={styles.readingTime}>
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className={styles.articleCardTitle}>
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className={styles.articleCardExcerpt}>{article.excerpt}</p>

                  <div className={styles.articleCardFooter}>
                    <div className={styles.authorInfoSection}>
                      <span className={styles.authorNameText}>
                        {article.author}
                      </span>
                      <span className={styles.publishDate}>{article.date}</span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className={styles.readMoreLink}
                    >
                      Read Article
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
