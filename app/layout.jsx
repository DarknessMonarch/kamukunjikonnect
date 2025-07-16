import { Toaster } from "sonner";
import "@/app/style/global.css";
import Script from "next/script";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CartDrawer from "@/app/components/CartDrawer";
import styles from "@/app/style/applayout.module.css";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const SITE_URL = "https://kamukunjikonnect.com";
const BANNER_URL =
  "https://raw.githubusercontent.com/DarknessMonarch/kamukunjikonnect/refs/heads/master/public/assets/banner.png";

export const viewport = {
  themeColor: "#2d2d2d",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "kamukunjikonnect - Premium Kitchen & Cookware Online Store",
    template: "%s | kamukunjikonnect",
  },
  applicationName: "kamukunjikonnect",
  description:
    "Shop premium kitchen appliances, cookware, and kitchenware online. Quality products for modern kitchens with fast delivery and great prices.",
  authors: [{ name: "kamukunjikonnect", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "kamukunjikonnect",
    "kitchen appliances",
    "cookware",
    "kitchenware",
    "kitchen utensils",
    "cooking equipment",
    "kitchen tools",
    "home cooking",
    "kitchen accessories",
    "cooking supplies",
    "kitchen gadgets",
    "pots and pans",
    "kitchen knives",
    "bakeware",
    "small appliances",
    "kitchen decor",
    "cooking essentials",
    "professional cookware",
    "non-stick cookware",
    "stainless steel",
    "kitchen storage",
    "food preparation",
    "kitchen essentials",
    "cooking accessories",
    "kitchen goods",
    "culinary tools",
    "home chef",
    "kitchen equipment",
    "cooking gear",
  ],

  referrer: "origin-when-cross-origin",
  creator: "kamukunjikonnect",
  publisher: "kamukunjikonnect",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "kamukunjikonnect",
    title: "kamukunjikonnect - Premium Kitchen & Cookware Online Store",
    description:
      "Shop premium kitchen appliances, cookware, and kitchenware online. Quality products for modern kitchens with fast delivery.",
    images: [
      {
        url: BANNER_URL,
        width: 1200,
        height: 630,
        alt: "kamukunjikonnect - Premium Kitchen & Cookware Store",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "kamukunjikonnect - Premium Kitchen & Cookware Online Store",
    description:
      "Shop premium kitchen appliances, cookware, and kitchenware online. Quality products for modern kitchens with fast delivery.",
    images: [BANNER_URL],
    creator: "@kamukunjikonnect",
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "",
    yandex: "",
  },

  alternates: {
    canonical: `${SITE_URL}`,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "kamukunjikonnect",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  description: "Premium kitchen appliances and cookware online store",
  sameAs: [
    "https://www.facebook.com/kamukunjikonnect",
    "https://whatsapp.com/channel/kamukunjikonnect",
    "https://twitter.com/kamukunjikonnect",
    "https://instagram.com/kamukunjikonnect",
    "https://www.youtube.com/@kamukunjikonnect",
    "https://t.me/kamukunjikonnect",
    "https://www.tiktok.com/@kamukunjikonnect",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@kamukunjikonnect.com",
    contactType: "Customer Support",
    url: SITE_URL,
    telephone: "254703147237",
    areaServed: "Worldwide",
    availableLanguage: "English",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2500",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Kitchen & Cookware Products",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Kitchen Appliances",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Small Kitchen Appliances",
            },
          },
        ],
      },
      {
        "@type": "OfferCatalog",
        name: "Cookware & Bakeware",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: "Pots, Pans & Baking Equipment",
            },
          },
        ],
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema - Global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K2Z5KL8G');
            `,
          }}
        />

        {/* Paystack SDK for payment processing */}
        <Script
          id="paystack-js"
          strategy="lazyOnload"
          src="https://js.paystack.co/v1/inline.js"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} ${inter.className}`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K2Z5KL8G"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          id="ga-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-SY8V8H1BQ9"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SY8V8H1BQ9', {
                page_path: window.location.pathname,
                custom_map: {
                  'custom_parameter_1': 'ecommerce_category'
                }
              });
              
              gtag('config', 'G-SY8V8H1BQ9', {
                'custom_map.category': 'kitchenware'
              });
            `,
          }}
        />

        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#d4793f",
              color: "#ffffff",
              borderRadius: "15px",
              border: "1px solid #d4793f",
            },
          }}
        />
        <div className={styles.appLayout}>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
