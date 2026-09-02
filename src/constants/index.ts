export const DEMO_URL = "https://meetings.hubspot.com/henry-arrowood/quad-p-demo";
export const LOGIN_URL = "https://partners.farmshare.co/";

/**
 * Single source of truth for the Farmshare network figures.
 * These numbers also appear in documents circulated outside the company,
 * so they must never be typed inline anywhere else on the site. The one
 * unavoidable duplicate is the static meta description in index.html, which
 * has to be a literal for crawlers; change it in the same commit.
 * Last verified: 2026-09-02 against the dashboard billing DB (arr_events:
 * 44 customers Active on latest event), with states resolved per customer via
 * processors.json, HubSpot and the wiki. States is 28, not 27: New York
 * (Shale Spring Meats) was missing from the earlier count.
 * NOTE: processors.json is NOT a reliable customer list. It is missing QbarS
 * (UT), Stilson Abattoir (GA) and Northeast Kingdom (VT), and its `status`
 * field mislabels at least one active customer as `prospect`.
 */
export const NETWORK_STATS = {
  facilities: 44,
  states: 28,
  producers: 10228,
} as const;

// Press alias, not a personal mailbox. This must exist in Google Workspace
// before the site ships or press mail bounces.
export const PRESS_EMAIL = "press@farmshare.co";

export const CUSTOMER_LOGOS = [
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/rocky%20mountain%20logo%20(1).jpg",
    alt: "Rocky Mountain Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/sunnyside-meats-logo.svg",
    alt: "Sunnyside Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/heartquist%20hollow%20logo.png",
    alt: "Heartquist Hollow Farm"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/Gores_Meat_Logo.svg",
    alt: "Gore's Processing"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/d&d%20logo.png",
    alt: "D&D Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/HPP%20logo.avif",
    alt: "Homeplace Pastures"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/hurdwell-logo.png",
    alt: "Hurdwell"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/johnson's%20logo.webp",
    alt: "Johnson's Processing"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/lone%20crow%20logo%20(1).jpg",
    alt: "Lone Crow Meat Processing"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/Nadler's%20logo.avif",
    alt: "Nadler's Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/renick%20logo%20(1).jpg",
    alt: "Renick Valley Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/bringhurst%20logo.png",
    alt: "Bringhurst Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/the%20butchers%20block%20logo%20(1).jpg",
    alt: "The Butcher's Block"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/westcliffe%20logo.avif",
    alt: "Westcliffe Meats"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/willie%20joe's%20logo.webp",
    alt: "Willie Joe's Processing"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/customer_logos/zk%20logo.avif",
    alt: "ZK Ranches"
  }
];

export const PARTNER_LOGOS = [
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/NMPA-Logo-Blue.png",
    alt: "NMPA"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/aamp%20logo.png",
    alt: "AAMP"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/csu%20logo.png",
    alt: "CSU"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/Techstars_Logo_Primary_Black.png",
    alt: "Techstars"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/iamp%20logo.png",
    alt: "IAMP"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/impa%20logo.jpg",
    alt: "IMPA"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/KAMP%20logo%20transparent%20(1).png",
    alt: "KAMP"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/MAMP-Logo-Color-Black-Web.avif",
    alt: "MAMP"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/MAMP_logo.jpg",
    alt: "MAMP Alternative"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/mmpa%20logo.avif",
    alt: "MMPA"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/PAMP%20logo.png",
    alt: "PAMP"
  },
  {
    src: "https://vkxvwmvlkitrcfgzwvtl.supabase.co/storage/v1/object/public/content/partner%20logos/WAMPLogo-lines.png.webp",
    alt: "WAMP"
  }
];