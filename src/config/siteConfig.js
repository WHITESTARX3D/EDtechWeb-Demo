/**
 * config/siteConfig.js
 * ------------------------------------------------------------------
 * Single source of truth for brand identity, contact details and
 * navigation. The client replaces "Brand Name" here and it updates
 * across every page, meta tag, footer and schema block.
 */

const siteConfig = {
  // // PLACEHOLDER: client replaces brand + URL before go-live.
  brand: "Brand Name",
  tagline: "Future-ready skills for young learners",
  url: "https://www.brandname.example",

  // Logo mark: two overlapping circles (violet + orange) + wordmark.
  logo: { circleA: "#7B4FD8", circleB: "#FF6B0A" },

  contact: {
    phone: "+91 98765 43210",
    phoneHref: "tel:+919876543210",
    whatsapp: "+91 98765 43210",
    whatsappHref: "https://wa.me/919876543210?text=Hi%20Brand%20Name%2C%20I%27d%20like%20to%20book%20a%20free%20demo%20class.",
    email: "hello@brandname.example",
    address: "3rd Floor, Sunrise Tower, MG Road, Bengaluru, Karnataka 560001",
    hours: "Mon – Sat · 9:00 AM – 7:00 PM IST",
  },

  // Main nav — React Router owns these URLs.
  nav: [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "About", to: "/about" },
    { label: "Admissions", to: "/admissions" },
    { label: "Contact", to: "/contact" },
  ],

  // Hindi (हिंदी) UI-switch placeholder labels for nav chrome only.
  navHi: ["होम", "कोर्सेज़", "हमारे बारे में", "एडमिशन", "संपर्क"],

  socials: [
    { label: "Instagram", href: "#", icon: "Instagram" },
    { label: "YouTube", href: "#", icon: "Youtube" },
    { label: "LinkedIn", href: "#", icon: "Linkedin" },
    { label: "Facebook", href: "#", icon: "Facebook" },
  ],
};

export default siteConfig;
