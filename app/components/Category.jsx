"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "@/app/style/category.module.css";
import { MdOutlineKeyboardArrowLeft as LeftIcon } from "react-icons/md";
import { MdOutlineKeyboardArrowRight as RightIcon } from "react-icons/md";

const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Appliances",
    href: "/categories/kitchen-appliances",
    image:
      "https://cdn.pixabay.com/photo/2018/02/22/15/41/wood-3173282_640.jpg",
  },
  {
    id: 2,
    name: "Cookware",
    href: "/categories/cookware",
    image: "https://cdn.pixabay.com/photo/2017/07/04/07/31/pan-2470217_640.jpg",
  },
  {
    id: 3,
    name: "Dinnerware",
    href: "/categories/dinnerware",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 4,
    name: "Storage",
    href: "/categories/storage",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 5,
    name: "Utensils",
    href: "/categories/utensils",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 6,
    name: "Bakeware",
    href: "/categories/bakeware",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
];

export default function Category() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  const gridRef = useRef(null);

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
  }, []);

  const handlePrevious = () => {
    if (!hasOverflow) return;

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
    if (!hasOverflow) return;

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

  const canGoPrevious = hasOverflow && scrollPosition > 0;
  const canGoNext = hasOverflow && scrollPosition < maxScroll;

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
          className={`${styles.navButton} ${!canGoNext ? styles.disabled : ""}`}
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
          if (gridRef.current) {
            setScrollPosition(gridRef.current.scrollLeft);
          }
        }}
      >
        {MOCK_CATEGORIES.map((category) => (
          <div key={category.id} className={styles.categoryImageContainer}>
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
          </div>
        ))}
      </div>
    </section>
  );
}