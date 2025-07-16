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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";

import {
  IoClose as CloseIcon,
  IoPersonOutline as PersonIcon,
  IoCartOutline as CartIcon,
  IoChevronDownOutline as ChevronDownIcon,
  IoSearchOutline as SearchIcon,
  IoCallOutline as PhoneIcon,
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

const CATEGORY_OPTIONS = [
  { id: "all", name: "All Categories", value: "all" },
  ...MOCK_CATEGORIES.map((cat) => ({
    id: cat.id,
    name: cat.name,
    value: cat.name.toLowerCase().replace(/\s+/g, "-"),
  })),
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Professional Chef Knife",
    href: "/products/chef-knife",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 2,
    name: "Non-Stick Pan Set",
    href: "/products/pan-set",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 3,
    name: "Stainless Steel Pot",
    href: "/products/steel-pot",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
  {
    id: 4,
    name: "Kitchen Scale",
    href: "/products/kitchen-scale",
    image:
      "https://cdn.pixabay.com/photo/2020/02/07/07/18/kitchen-4826379_640.jpg",
  },
];

const NAV_LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/about", label: "About Us", matchPattern: "/about" },
  { href: "/categories", label: "Categories", hasDropdown: true },
  { href: "/products", label: "Products", hasDropdown: true },
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

const isLinkActive = (pathname, link) => {
  if (link.exact) {
    return pathname === link.href;
  }

  const patternToCheck = link.matchPattern || link.href;
  return (
    pathname === patternToCheck || pathname.startsWith(`${patternToCheck}/`)
  );
};

const CategoryDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownContent}>
        <div className={styles.dropdownGrid}>
          {MOCK_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={styles.dropdownItem}
              onClick={onClose}
            >
              <div className={styles.dropdownItemImage}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="100%"
                  quality={100}
                  objectFit="cover"
                  priority={true}
                  className={styles.dropdownImage}
                />
              </div>
              <span className={styles.dropdownItemName}>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductDropdown = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownContent}>
        <div className={styles.dropdownGrid}>
          {MOCK_PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className={styles.dropdownItem}
              onClick={onClose}
            >
              <div className={styles.dropdownItemImage}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="100%"
                  quality={100}
                  objectFit="cover"
                  priority={true}
                  className={styles.dropdownImage}
                />
              </div>
              <div className={styles.dropdownItemDetails}>
                <span>{product.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.dropdownFooter}>
          <Link
            href="/products"
            className={styles.seeMoreLink}
            onClick={onClose}
          >
            View More →
          </Link>
        </div>
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
  onLinkClick,
  activeDropdown,
  setActiveDropdown,
}) => {
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

  const handleDropdownToggle = (linkLabel, hasDropdown) => {
    if (hasDropdown) {
      setActiveDropdown(activeDropdown === linkLabel ? null : linkLabel);
    } else {
      setActiveDropdown(null);
      onLinkClick();
    }
  };

  const handleDropdownClose = () => {
    setActiveDropdown(null);
    onLinkClick();
  };

  return (
    <div className={styles.navigationLinks} ref={dropdownRef}>
      {NAV_LINKS.map((link) => (
        <div key={link.href} className={styles.navLinkWrapper}>
          {link.hasDropdown ? (
            <div
              className={`${styles.navLink} ${styles.dropdownTrigger} ${
                isLinkActive(pathname, link) ? styles.activeNavLink : ""
              }`}
              onClick={() => handleDropdownToggle(link.label, link.hasDropdown)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDropdownToggle(link.label, link.hasDropdown);
                }
              }}
            >
              <span>{link.label}</span>
              <ChevronDownIcon
                className={`${styles.chevronIcon} ${
                  activeDropdown === link.label ? styles.chevronUp : ""
                }`}
              />
            </div>
          ) : (
            <Link
              href={link.href}
              className={`${styles.navLink} ${
                isLinkActive(pathname, link) ? styles.activeNavLink : ""
              }`}
              onClick={() => handleDropdownToggle(link.label, link.hasDropdown)}
              aria-current={isLinkActive(pathname, link) ? "page" : undefined}
            >
              <span>{link.label}</span>
            </Link>
          )}

          {link.label === "Categories" && (
            <CategoryDropdown
              isOpen={activeDropdown === "Categories"}
              onClose={handleDropdownClose}
            />
          )}

          {link.label === "Products" && (
            <ProductDropdown
              isOpen={activeDropdown === "Products"}
              onClose={handleDropdownClose}
            />
          )}
        </div>
      ))}
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
          dropPlaceHolder="All Categories"
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
  // Using drawer store for mobile menu functionality
  const { isOpen: isMobileMenuOpen, toggleOpen: toggleMobileMenu, setClose: closeMobileMenu } = useDrawerStore();
  
  // Using cart store only for cart functionality
  const { isDrawerOpen: isCartOpen, toggleDrawer: toggleCart } = useCartStore();

  const { isMobile } = useResponsive();
  const router = useRouter();
  const pathname = usePathname();
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

  // Cart drawer toggle handler - only for cart functionality
  const handleCartClick = useCallback(() => {
    setActiveDropdown(null);
    toggleCart(); // This will open/close the cart drawer
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
            Your best kitcheware deals are here
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
                isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
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
              onLinkClick={handleLinkClick}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
            />
          )}

          <CartSection onCartClick={handleCartClick} />
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className={styles.mobileMenuOverlay}>
            <div className={styles.mobileMenuContent}>
              <NavigationLinks
                pathname={pathname}
                onLinkClick={handleLinkClick}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />
            </div>
          </div>
        )}
      </nav>
    </>
  );
}