"use client";

import Image from "next/image";
import styles from "@/app/style/nothing.module.css";

export default function Nothing({ NothingImage, Text, Alt}) {
  return (
    <div className={styles.emptyState}>
      <Image
        src={NothingImage}
        alt={Alt}
        height={200}
        width={200}
        priority
        className={styles.emptyStateImage}
      />
      <p>{Text}</p>
    </div>
  );
}
