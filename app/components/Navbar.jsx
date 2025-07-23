"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import Logo from "@/public/assets/logo.png";
import { useAuthStore } from "@/app/store/Auth";
import { useCartStore } from "@/app/store/Cart";
import Dropdown from "@/app/components/Dropdown";
import styles from "@/app/style/navbar.module.css";
import { useDrawerStore } from "@/app/store/Drawer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

import {
  IoClose as CloseIcon,
  IoPersonOutline as PersonIcon,
  IoCartOutline as CartIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoSearchOutline as SearchIcon,
  IoCallOutline as PhoneIcon,
  IoAdd as IoPlusIcon,
  IoRemove as IoMinusIcon,
} from "react-icons/io5";

import { CgMenuGridO as MenuIcon } from "react-icons/cg";

import {
  MdLogout as LogoutIcon,
  MdLocalOffer as OfferIcon,
} from "react-icons/md";

const MOBILE_BREAKPOINT = 768;
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MOCK_CATEGORIES = [
  {
    id: 1,
    name: "Kitchen Appliances",
    slug: "kitchen-appliances",
    href: "/categories?category=kitchen-appliances",
    image:
      "https://cdn.pixabay.com/photo/2018/02/22/15/41/wood-3173282_640.jpg",
    dropdown: [
      {
        name: "Blenders & Mixers",
        href: "/categories?category=kitchen-appliances&subcategory=blenders",
      },
      {
        name: "Coffee Makers",
        href: "/categories?category=kitchen-appliances&subcategory=coffee-makers",
      },
      {
        name: "Food Processors",
        href: "/categories?category=kitchen-appliances&subcategory=food-processors",
      },
      {
        name: "Microwaves",
        href: "/categories?category=kitchen-appliances&subcategory=microwaves",
      },
    ],
    title: "Kitchen Appliances",
    description:
      "Essential kitchen appliances to make cooking easier and more efficient. From coffee makers to food processors, find everything you need for a modern kitchen.",
    imageTitle: "Premium Kitchen Appliances",
    imageDescription:
      "Discover high-quality appliances that combine functionality with style for your dream kitchen.",
  },
  {
    id: 2,
    name: "Cookware & Bakeware",
    slug: "cookware",
    href: "/categories?category=cookware",
    image: "https://cdn.pixabay.com/photo/2017/07/04/07/31/pan-2470217_640.jpg",
    dropdown: [
      {
        name: "Non-Stick Pans",
        href: "/categories?category=cookware&subcategory=non-stick-pans",
      },
      {
        name: "Stainless Steel Pots",
        href: "/categories?category=cookware&subcategory=steel-pots",
      },
      {
        name: "Baking Sheets",
        href: "/categories?category=cookware&subcategory=baking-sheets",
      },
      {
        name: "Cast Iron Cookware",
        href: "/categories?category=cookware&subcategory=cast-iron",
      },
    ],
    title: "Cookware & Bakeware",
    description:
      "Professional-grade cookware and bakeware for every cooking enthusiast. From non-stick pans to cast iron skillets, cook like a pro.",
    imageTitle: "Professional Cookware Collection",
    imageDescription:
      "Elevate your culinary skills with our premium cookware designed for durability and performance.",
  },
  {
    id: 3,
    name: "Dinnerware & Tableware",
    slug: "dinnerware",
    href: "/categories?category=dinnerware",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "Dinner Sets",
        href: "/categories?category=dinnerware&subcategory=dinner-sets",
      },
      {
        name: "Glassware",
        href: "/categories?category=dinnerware&subcategory=glassware",
      },
      {
        name: "Cutlery Sets",
        href: "/categories?category=dinnerware&subcategory=cutlery",
      },
      {
        name: "Serving Dishes",
        href: "/categories?category=dinnerware&subcategory=serving-dishes",
      },
    ],
    title: "Dinnerware & Tableware",
    description:
      "Beautiful dinnerware and tableware sets to make every meal special. From elegant dinner sets to premium cutlery.",
    imageTitle: "Elegant Dining Collection",
    imageDescription:
      "Transform your dining experience with our sophisticated tableware and dinnerware collections.",
  },
  {
    id: 4,
    name: "Storage & Organization",
    slug: "storage",
    href: "/categories?category=storage",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "Food Containers",
        href: "/categories?category=storage&subcategory=food-containers",
      },
      {
        name: "Spice Racks",
        href: "/categories?category=storage&subcategory=spice-racks",
      },
      {
        name: "Pantry Organizers",
        href: "/categories?category=storage&subcategory=pantry-organizers",
      },
      {
        name: "Refrigerator Storage",
        href: "/categories?category=storage&subcategory=fridge-storage",
      },
    ],
    title: "Storage & Organization",
    description:
      "Keep your kitchen organized and efficient with our storage solutions. From food containers to pantry organizers.",
    imageTitle: "Smart Kitchen Storage",
    imageDescription:
      "Maximize your kitchen space with our innovative storage and organization solutions.",
  },
  {
    id: 5,
    name: "Kitchen Tools & Gadgets",
    slug: "tools",
    href: "/categories?category=tools",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "Chef Knives",
        href: "/categories?category=tools&subcategory=chef-knives",
      },
      {
        name: "Cutting Boards",
        href: "/categories?category=tools&subcategory=cutting-boards",
      },
      {
        name: "Kitchen Scales",
        href: "/categories?category=tools&subcategory=kitchen-scales",
      },
      {
        name: "Can Openers",
        href: "/categories?category=tools&subcategory=can-openers",
      },
    ],
    title: "Kitchen Tools & Gadgets",
    description:
      "Essential kitchen tools and innovative gadgets to streamline your cooking process. Quality tools for every kitchen task.",
    imageTitle: "Professional Kitchen Tools",
    imageDescription:
      "Equip your kitchen with professional-grade tools designed for precision and durability.",
  },
];

const CATEGORY_OPTIONS = [
  { id: "all", name: "All Categories", value: "all" },
  ...MOCK_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    value: cat.slug,
  })),
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Professional Chef Knife",
    slug: "chef-knife",
    href: "/products?product=chef-knife",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "8-inch Chef Knife",
        href: "/products?product=chef-knife&variant=8-inch",
      },
      {
        name: "10-inch Chef Knife",
        href: "/products?product=chef-knife&variant=10-inch",
      },
      {
        name: "Santoku Knife",
        href: "/products?product=chef-knife&variant=santoku",
      },
      {
        name: "Paring Knife",
        href: "/products?product=chef-knife&variant=paring",
      },
    ],
    title: "Professional Chef Knives",
    description:
      "Premium chef knives crafted from high-carbon steel for superior sharpness and durability. Essential tools for professional and home chefs.",
    imageTitle: "Master Chef Collection",
    imageDescription:
      "Experience precision cutting with our professional-grade chef knives designed for culinary excellence.",
  },
  {
    id: 2,
    name: "Non-Stick Cookware Sets",
    slug: "cookware-sets",
    href: "/products?product=cookware-sets",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "5-Piece Cookware Set",
        href: "/products?product=cookware-sets&variant=5-piece",
      },
      {
        name: "10-Piece Cookware Set",
        href: "/products?product=cookware-sets&variant=10-piece",
      },
      {
        name: "Ceramic Non-Stick Set",
        href: "/products?product=cookware-sets&variant=ceramic",
      },
      {
        name: "Hard-Anodized Set",
        href: "/products?product=cookware-sets&variant=hard-anodized",
      },
    ],
    title: "Non-Stick Cookware Sets",
    description:
      "Complete cookware sets featuring advanced non-stick coating for healthy cooking and easy cleanup. Perfect for every cooking style.",
    imageTitle: "Premium Cookware Collections",
    imageDescription:
      "Cook with confidence using our durable non-stick cookware designed for everyday cooking excellence.",
  },
  {
    id: 3,
    name: "Coffee & Espresso Makers",
    slug: "coffee-makers",
    href: "/products?product=coffee-makers",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "Drip Coffee Makers",
        href: "/products?product=coffee-makers&variant=drip",
      },
      {
        name: "Espresso Machines",
        href: "/products?product=coffee-makers&variant=espresso",
      },
      {
        name: "French Press",
        href: "/products?product=coffee-makers&variant=french-press",
      },
      {
        name: "Pour Over Sets",
        href: "/products?product=coffee-makers&variant=pour-over",
      },
    ],
    title: "Coffee & Espresso Makers",
    description:
      "Brew the perfect cup every time with our selection of coffee and espresso makers. From simple drip coffee to professional espresso.",
    imageTitle: "Barista Quality Coffee",
    imageDescription:
      "Enjoy café-quality coffee at home with our professional-grade coffee and espresso equipment.",
  },
  {
    id: 4,
    name: "Kitchen Storage Solutions",
    slug: "storage-solutions",
    href: "/products?product=storage-solutions",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
    dropdown: [
      {
        name: "Glass Storage Containers",
        href: "/products?product=storage-solutions&variant=glass-containers",
      },
      {
        name: "Plastic Food Containers",
        href: "/products?product=storage-solutions&variant=plastic-containers",
      },
      {
        name: "Vacuum Seal Bags",
        href: "/products?product=storage-solutions&variant=vacuum-bags",
      },
      {
        name: "Pantry Organization",
        href: "/products?product=storage-solutions&variant=pantry",
      },
    ],
    title: "Kitchen Storage Solutions",
    description:
      "Keep your kitchen organized and food fresh with our comprehensive storage solutions. From containers to pantry organizers.",
    imageTitle: "Organized Kitchen Living",
    imageDescription:
      "Maximize your kitchen efficiency with our smart storage solutions designed for modern living.",
  },
];

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About Us", matchPattern: "/about" },
  {
    href: "/categories",
    label: "Categories",
    hasDropdown: true,
    dropdown: MOCK_CATEGORIES.map((cat) => ({
      name: cat.name,
      href: cat.href,
    })),
    title: "Shop by Category",
    description:
      "Explore our comprehensive range of kitchen essentials organized by category. Find exactly what you need for your culinary adventures.",
    image:
      "https://cdn.pixabay.com/photo/2018/02/22/15/41/wood-3173282_640.jpg",
    imageTitle: "Complete Kitchen Solutions",
    imageDescription:
      "From appliances to utensils, discover everything you need to create your perfect kitchen.",
  },
  {
    href: "/products",
    label: "Products",
    hasDropdown: true,
    dropdown: MOCK_PRODUCTS.map((product) => ({
      name: product.name,
      href: product.href,
    })),
    title: "Featured Products",
    description:
      "Discover our most popular and highest-rated kitchen products. Quality items that professional chefs and home cooks love.",
    image: "https://cdn.pixabay.com/photo/2017/07/04/07/31/pan-2470217_640.jpg",
    imageTitle: "Best-Selling Kitchen Items",
    imageDescription:
      "Shop our top-rated products trusted by thousands of satisfied customers worldwide.",
  },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

const useResponsive = () => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isMobile };
};

const useImageUpload = (updateProfileImage) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP or GIF)");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 100MB");
      return false;
    }

    return true;
  }, []);

  const uploadImage = useCallback(
    async (file) => {
      if (!validateFile(file)) return;

      setIsUploadingImage(true);

      try {
        const reader = new FileReader();

        reader.onload = async (e) => {
          try {
            const result = await updateProfileImage(e.target.result);

            if (result.success) {
              toast.success("Profile image updated successfully!");
            } else {
              toast.error(result.message || "Failed to update profile image");
            }
          } catch (error) {
            console.error("Profile image update error:", error);
            toast.error("Failed to update profile image");
          } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        };

        reader.onerror = () => {
          toast.error("Failed to read the image file");
          setIsUploadingImage(false);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process the image");
        setIsUploadingImage(false);
      }
    },
    [updateProfileImage, validateFile]
  );

  const handleProfileImageClick = useCallback(() => {
    if (fileInputRef.current && !isUploadingImage) {
      fileInputRef.current.click();
    }
  }, [isUploadingImage]);

  const handleFileChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (file) {
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  return {
    isUploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleFileChange,
  };
};

const isLinkActive = (pathname, searchParams, link) => {
  if (link.exact) {
    return pathname === link.href;
  }

  if (link.href === "/categories") {
    if (pathname === "/categories") return true;

    if (pathname.startsWith("/products/")) {
      const categoryParam = searchParams?.get?.("category");
      if (categoryParam) {
        return MOCK_CATEGORIES.some((cat) => cat.slug === categoryParam);
      }
    }

    return false;
  }

  if (link.href === "/products") {
    if (pathname === "/products") return true;

    if (pathname.startsWith("/products/")) {
      return true;
    }

    return false;
  }

  const patternToCheck = link.matchPattern || link.href;
  return (
    pathname === patternToCheck || pathname.startsWith(`${patternToCheck}/`)
  );
};

const NavItemDropdown = ({
  item,
  setActiveDropdown,
  isMobile,
  onNavItemClick,
}) => {
  const handleDropdownItemClick = () => {
    setActiveDropdown(null);
    if (isMobile) {
      onNavItemClick();
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownContent}>
        <div className={styles.dropdownInfo}>
          {item.title && <h2>{item.title}</h2>}
          {item.description && <p>{item.description}</p>}
          <div className={styles.dropdownLinks}>
            {item.dropdown?.map((dropdownItem, dropIndex) => (
              <Link
                key={dropIndex}
                href={dropdownItem.href}
                className={styles.dropdownItem}
                onClick={handleDropdownItemClick}
              >
                {dropdownItem.name}
              </Link>
            ))}
            {isMobile && (
              <Link
                href={item.href}
                className={styles.dropdownItem}
                onClick={handleDropdownItemClick}
              >
                See more info
              </Link>
            )}
          </div>
        </div>

        {item.image && (
          <div className={styles.dropdownImageContainer}>
            <Image
              className={styles.dropdownImage}
              src={item.image}
              alt={item.imageTitle || "Dropdown Image"}
              width={250}
              height={250}
            />
            {item.imageTitle && <h3>{item.imageTitle}</h3>}
            {item.imageDescription && <p>{item.imageDescription}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileImageComponent = ({ profileImage, onImageClick, isUploading }) => (
  <>
    {profileImage?.startsWith("https://") ? (
      <div className={styles.profileImgContainer}>
        <Image
          className={styles.profileImg}
          title="Click to change profile picture"
          src={profileImage}
          alt="Profile picture"
          fill
          sizes="100%"
          quality={100}
          priority={true}
          onClick={onImageClick}
          objectFit="cover"
          style={{
            cursor: isUploading ? "not-allowed" : "pointer",
            opacity: isUploading ? 0.7 : 1,
          }}
        />
      </div>
    ) : (
      <div className={`${styles.profileImgContainer} skeleton`} />
    )}
  </>
);

const NavigationLinks = ({
  pathname,
  searchParams,
  onLinkClick,
  activeDropdown,
  setActiveDropdown,
  isMobile,
}) => {
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, setActiveDropdown]);

  const handleInteraction = (link, index) => {
    if (link.hasDropdown) {
      if (isMobile) {
        setActiveDropdown(activeDropdown === index ? null : index);
      } else {
        router.push(link.href);
      }
    } else {
      if (isMobile) {
        onLinkClick();
      }
    }
  };

  const handleMouseEnter = (index, hasDropdown) => {
    if (!isMobile && hasDropdown) {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  return (
    <div className={styles.navigationLinks} ref={dropdownRef}>
      {NAV_LINKS.map((link, index) => {
        const isActive = activeDropdown === index;
        const isCurrentPage = isLinkActive(pathname, searchParams, link);

        return (
          <div
            key={link.href}
            className={styles.navLinkWrapper}
            onMouseEnter={() => handleMouseEnter(index, link.hasDropdown)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={styles.navItemLinkContainer}
              onClick={() => handleInteraction(link, index)}
            >
              <Link
                href={link.href}
                className={`${styles.navLink} ${
                  isCurrentPage ? styles.activeNavLink : ""
                }`}
                onClick={(e) => {
                  if (isMobile && link.hasDropdown) {
                    e.preventDefault();
                  } else if (!link.hasDropdown) {
                    onLinkClick();
                  }
                }}
              >
                {link.label}
                {link.hasDropdown && (
                  <>
                    {isMobile ? (
                      isActive ? (
                        <IoMinusIcon className={styles.mobileIcon} />
                      ) : (
                        <IoPlusIcon className={styles.mobileIcon} />
                      )
                    ) : (
                      <ChevronDownIcon
                        className={`${styles.chevron} ${
                          isActive ? styles.chevronOpen : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </Link>
            </div>

            {link.hasDropdown && isActive && (
              <NavItemDropdown
                item={link}
                setActiveDropdown={setActiveDropdown}
                isMobile={isMobile}
                onNavItemClick={onLinkClick}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

const LogoSection = ({ onLogoClick }) => (
  <div className={styles.logoContainer}>
    <Image
      src={Logo}
      alt="Company Logo"
      height={32}
      width={32}
      onClick={onLogoClick}
      priority={true}
      className={styles.logoImage}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onLogoClick();
        }
      }}
      style={{ cursor: "pointer" }}
    />
    <span
      className={styles.logoText}
      onClick={onLogoClick}
      style={{ cursor: "pointer" }}
    >
      KamukunjiKonnect
    </span>
  </div>
);

const SearchSection = ({ isMobile }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  if (isMobile) return null;

  return (
    <form onSubmit={handleSearch} className={styles.searchContainer}>
      <div className={styles.categorySelector}>
        <Dropdown
          options={CATEGORY_OPTIONS}
          onSelect={handleCategorySelect}
          dropPlaceHolder="Select Category"
          value={selectedCategory}
        />
      </div>
      <div className={styles.searchInputContainer}>
        <input
          type="text"
          placeholder="I am shopping for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button
          type="submit"
          className={styles.searchButton}
          aria-label="Search"
        >
          <SearchIcon className={styles.searchIcon} />
        </button>
      </div>
    </form>
  );
};

const RightSection = ({
  isAuth,
  username,
  profileImage,
  onImageClick,
  isUploadingImage,
  onLogout,
  isLoggingOut,
  isMobile,
}) => (
  <div className={styles.rightSection}>
    {!isMobile && (
      <div className={styles.supportSection}>
        <PhoneIcon className={styles.supportIcon} />
        <div className={styles.supportText}>
          <span>24/7 SUPPORT</span>
          <span>(+254) 743-161-569</span>
        </div>
      </div>
    )}

    {isAuth ? (
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <ProfileImageComponent
            profileImage={profileImage}
            onImageClick={onImageClick}
            isUploading={isUploadingImage}
          />
          <span>{username || "Guest"}</span>
        </div>
        <button
          onClick={onLogout}
          className={styles.logoutButton}
          disabled={isLoggingOut}
          aria-label={isLoggingOut ? "Logging out..." : "Logout"}
        >
          <LogoutIcon className={styles.logoutIcon} />
        </button>
      </div>
    ) : (
      <Link href="/login" className={styles.accountSection}>
        <PersonIcon className={styles.accountIcon} />
      </Link>
    )}
  </div>
);

const CartSection = ({ onCartClick }) => {
  const { getItemCount, getSubtotal } = useCartStore();
  const itemCount = getItemCount() || 0;
  const subtotal = getSubtotal() || 0;

  return (
    <div
      className={styles.cartSection}
      onClick={onCartClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCartClick();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.cartInfo}>
        <CartIcon className={styles.cartIcon} />
        <span className={styles.cartCount}>{itemCount}</span>
      </div>
      <span className={styles.cartPrice}>Ksh {subtotal.toFixed(2)}</span>
    </div>
  );
};

export default function Navbar() {
  const {
    isOpen: isMobileMenuOpen,
    toggleOpen: toggleMobileMenu,
    setClose: closeMobileMenu,
  } = useDrawerStore();
  const { isDrawerOpen: isCartOpen, toggleDrawer: toggleCart } = useCartStore();

  const { isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const {
    isAuth,
    username,
    profileImage,
    logout,
    clearUser,
    updateProfileImage,
  } = useAuthStore();

  const {
    isUploadingImage,
    fileInputRef,
    handleProfileImageClick,
    handleFileChange,
  } = useImageUpload(updateProfileImage);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      closeMobileMenu();
    }
    setActiveDropdown(null);
  }, [isMobile, closeMobileMenu]);

  const handleLogoClick = useCallback(() => {
    setActiveDropdown(null);
    if (isMobile) {
      closeMobileMenu();
    }
    router.push("/");
  }, [isMobile, router, closeMobileMenu]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      const result = await logout();

      if (result.success) {
        toast.success(result.message || "Logged out successfully");
        closeMobileMenu();
        router.push("/");
      } else {
        toast.error(result.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");

      clearUser();
      closeMobileMenu();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, logout, closeMobileMenu, router, clearUser]);

  const handleMobileMenuToggle = useCallback(() => {
    setActiveDropdown(null);
    toggleMobileMenu();
  }, [toggleMobileMenu]);

  const handleCartClick = useCallback(() => {
    setActiveDropdown(null);
    toggleCart();
  }, [toggleCart]);

  const fileInputProps = useMemo(
    () => ({
      ref: fileInputRef,
      type: "file",
      accept: ALLOWED_IMAGE_TYPES.join(","),
      onChange: handleFileChange,
      style: { display: "none" },
      disabled: isUploadingImage,
      "aria-hidden": true,
    }),
    [fileInputRef, handleFileChange, isUploadingImage]
  );

  return (
    <>
      <input {...fileInputProps} />

      <nav
        className={`${styles.navbarWrapper} ${
          isMobileMenuOpen ? styles.mobileNavOpen : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.navbarOffer}>
          <OfferIcon className={styles.offerIcon} aria-hidden="true" />
          <span className={styles.offerText}>
            Your best kitchenware deals are here
          </span>
        </div>
        <div className={styles.navbarContainerWrapper}>
          <div className={styles.navbarContainer}>
            <LogoSection onLogoClick={handleLogoClick} />
            <SearchSection isMobile={isMobile} />
            <RightSection
              isAuth={isAuth}
              username={username}
              profileImage={profileImage}
              onImageClick={handleProfileImageClick}
              isUploadingImage={isUploadingImage}
              onLogout={handleLogout}
              isLoggingOut={isLoggingOut}
              isMobile={isMobile}
            />
          </div>
        </div>

        <div className={styles.secondaryNav}>
          {isMobile && (
            <button
              className={styles.mobileMenuButton}
              onClick={handleMobileMenuToggle}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
              type="button"
            >
              {!isMobileMenuOpen ? (
                <MenuIcon className={styles.menuIcon} aria-hidden="true" />
              ) : (
                <CloseIcon className={styles.closeIcon} aria-hidden="true" />
              )}
            </button>
          )}
          {!isMobile && (
            <NavigationLinks
              pathname={pathname}
              searchParams={searchParams || new URLSearchParams()}
              onLinkClick={handleLinkClick}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              isMobile={isMobile}
            />
          )}

          <CartSection onCartClick={handleCartClick} />
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className={styles.mobileMenuOverlay}>
            <div className={styles.mobileMenuContent}>
              <NavigationLinks
                pathname={pathname}
                searchParams={searchParams || new URLSearchParams()}
                onLinkClick={handleLinkClick}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
