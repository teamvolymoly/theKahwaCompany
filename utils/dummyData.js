export const dummyCategories = [
  {
    id: 1,
    name: "Signature Kahwa",
    slug: "signature-kahwa",
    description: "Classic blends with saffron, cardamom, and almonds.",
    image: "/products/tin/BLTIN1.png",
  },
  {
    id: 2,
    name: "Herbal Infusions",
    slug: "herbal-infusions",
    description: "Caffeine-free comforts for calm evenings.",
    image: "/products/tin/HLTIN1.png",
  },
  {
    id: 3,
    name: "Spiced Blends",
    slug: "spiced-blends",
    description: "Warming notes with cinnamon, clove, and ginger.",
    image: "/products/tin/OTTIN1.png",
  },
  {
    id: 4,
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Curated kahwa collections for gifting.",
    image: "/products/tin/KLTIN1.png",
  },
  {
    id: 5,
    name: "Seasonal Harvests",
    slug: "seasonal-harvests",
    description: "Limited batches inspired by the seasons.",
    image: "/products/tin/MLTIN1.png",
  },
  {
    id: 6,
    name: "Tea Accessories",
    slug: "tea-accessories",
    description: "Infusers, mugs, and steeping essentials.",
    image: "/products/W2.png",
  },
];

export const dummyProducts = [
  {
    id: 101,
    name: "Kashmiri Kahwa Premium Green Tea",
    slug: "kashmiri-kahwa-premium-green-tea",
    short_description: "30 Pyramid Tea Bags",
    description:
      "A fragrant Kashmiri kahwa with saffron, cardamom, and almonds for a warm, aromatic cup.",
    category_id: 1,
    price: 499,
    oldPrice: 599,
    badge: "10% OFF",
    image: "/products/tin/BLTIN1.png",
    images: [
      { id: 1, image_url: "/products/tin/BLTIN1.png" },
      { id: 2, image_url: "/products/W1.png" },
      { id: 3, image_url: "/products/W2.png" },
    ],
    variants: [
      { id: 1001, variant_name: "30 Bags", price: 499 },
      { id: 1002, variant_name: "60 Bags", price: 899 },
    ],
  },
  {
    id: 102,
    name: "Saffron & Spices Kahwa Blend",
    slug: "saffron-spices-kahwa-blend",
    short_description: "With Almonds & Cardamom",
    description:
      "Bold saffron notes with a spice-forward finish, perfect for evening unwinds.",
    category_id: 3,
    price: 525,
    oldPrice: 649,
    badge: "Bestseller",
    image: "/products/tin/HLTIN1.png",
    images: [
      { id: 4, image_url: "/products/tin/HLTIN1.png" },
      { id: 5, image_url: "/products/W3.png" },
    ],
    variants: [
      { id: 1003, variant_name: "100g Tin", price: 525 },
      { id: 1004, variant_name: "200g Tin", price: 949 },
    ],
  },
  {
    id: 103,
    name: "Classic Kashmiri Kahwa",
    slug: "classic-kashmiri-kahwa",
    short_description: "Traditional Herbal Infusion",
    description:
      "A timeless kahwa blend with citrus peel and whole spices for a classic sip.",
    category_id: 1,
    price: 475,
    oldPrice: 599,
    badge: "New",
    image: "/products/tin/OTTIN1.png",
    images: [
      { id: 6, image_url: "/products/tin/OTTIN1.png" },
      { id: 7, image_url: "/products/W4.png" },
    ],
    variants: [{ id: 1005, variant_name: "100g Tin", price: 475 }],
  },
  {
    id: 104,
    name: "Kahwa Sampler Set",
    slug: "kahwa-sampler-set",
    short_description: "Assorted Signature Blends",
    description:
      "A tasting flight of signature kahwa blends to explore aromas and flavors.",
    category_id: 4,
    price: 799,
    oldPrice: 899,
    badge: "Sampler",
    image: "/products/tin/KLTIN1.png",
    images: [
      { id: 8, image_url: "/products/tin/KLTIN1.png" },
      { id: 9, image_url: "/products/W5.png" },
    ],
    variants: [{ id: 1006, variant_name: "Sampler Box", price: 799 }],
  },
  {
    id: 105,
    name: "Mint & Saffron Kahwa",
    slug: "mint-saffron-kahwa",
    short_description: "Refreshing Evening Brew",
    description:
      "Cooling mint with a saffron lift for a bright, soothing cup.",
    category_id: 2,
    price: 459,
    oldPrice: 549,
    badge: "10% OFF",
    image: "/products/tin/MLTIN1.png",
    images: [
      { id: 10, image_url: "/products/tin/MLTIN1.png" },
      { id: 11, image_url: "/products/W2.png" },
    ],
    variants: [{ id: 1007, variant_name: "75g Tin", price: 459 }],
  },
];

export const dummyReviews = [
  { id: 1, rating: 5, review: "Aromatic and soothing, perfect for evenings." },
  { id: 2, rating: 4, review: "Loved the saffron notes and warm finish." },
  { id: 3, rating: 5, review: "Great balance of spices, very comforting." },
];

export const dummySubcategories = [
  { id: 201, name: "Bestsellers", slug: "bestsellers" },
  { id: 202, name: "Sampler Packs", slug: "samplers" },
  { id: 203, name: "Wellness Blends", slug: "wellness" },
];
