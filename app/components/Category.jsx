"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCategoryStore } from "@/app/store/category";
import styles from "@/app/style/category.module.css";
import { MdOutlineKeyboardArrowLeft as LeftIcon } from "react-icons/md";
import { MdOutlineKeyboardArrowRight as RightIcon } from "react-icons/md";

const CategorySkeleton = () => (
  <div className={styles.categoryImageContainer}>
    <div className={`${styles.categoryWrapperImageLoading} skeleton`}></div>
  </div>
);

export default function Category() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const gridRef = useRef(null);

  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories({
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    });
  }, [fetchCategories]);

  useEffect(() => {
    const checkOverflow = () => {
      if (gridRef.current) {
        const container = gridRef.current;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const overflow = scrollWidth > clientWidth;

        setHasOverflow(overflow);
        setMaxScroll(overflow ? scrollWidth - clientWidth : 0);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  const handlePrevious = () => {
    if (!hasOverflow || loading) return;

    const scrollAmount = 300;
    const newPosition = Math.max(0, scrollPosition - scrollAmount);
    setScrollPosition(newPosition);

    if (gridRef.current) {
      gridRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (!hasOverflow || loading) return;

    const scrollAmount = 100;
    const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    setScrollPosition(newPosition);

    if (gridRef.current) {
      gridRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const canGoPrevious = hasOverflow && scrollPosition > 0 && !loading;
  const canGoNext = hasOverflow && scrollPosition < maxScroll && !loading;

  if (error) {
    return (
      <section className={styles.Categorycontainer}>
        <div className={styles.CategoryHeader}>
          <h1>Filter by Category</h1>
        </div>
        <div className={styles.errorMessage}>
          <p>Failed to load categories. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.Categorycontainer}>
      <div className={styles.CategoryHeader}>
        <h1>Filter by Category</h1>
        <div className={styles.CategoryController}>
          <button
            className={`${styles.navButton} ${
              !canGoPrevious ? styles.disabled : ""
            }`}
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            aria-label="Previous categories"
          >
            <LeftIcon className={styles.navBtnIcon} />
          </button>
          <button
            className={`${styles.navButton} ${
              !canGoNext ? styles.disabled : ""
            }`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Next categories"
          >
            <RightIcon className={styles.navBtnIcon} />
          </button>
        </div>
      </div>

      <div
        ref={gridRef}
        className={styles.categoriesGrid}
        onScroll={() => {
          if (gridRef.current && !loading) {
            setScrollPosition(gridRef.current.scrollLeft);
          }
        }}
      >
        {loading || categories.length === 0
          ? Array.from({ length: 6 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          : categories.map((category) => (
              <Link 
                key={category._id} 
                href={`/categories/${category.slug}`}
                className={styles.categoryImageContainer}
              >
                <div className={styles.categoryWrapperImage}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={120}
                    height={120}
                    className={styles.categoryImage}
                  />
                </div>
                <h3 className={styles.categoryName}>{category.name}</h3>
              </Link>
            ))}
      </div>
    </section>
  );
}