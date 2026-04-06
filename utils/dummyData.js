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
    name: "Kashmiri Kahwa",
    slug: "kashmiri-kahwa-premium-green-tea",
    short_description: "A MYSTICAL BLEND OF BLUE PEA & BOTANICALS",
    tag_line: "Citrusy, Cool and Deeply Aromatic",
    description:
      "Infused with the vivid hues of butterfly pea flower, this herbal kahwa features a medley of fragrant spices, mint, floral notes, and a gentle citrus twist. A naturally caffeine-free blend that brings together tradition and visual wonder. Sourced from select Indian gardens and hand-blended with whole botanicals, with no tea dust or additives, just pure ingredients and clean taste in every cup.",
    category_id: 1,
    price: 499,
    oldPrice: 599,
    badge: "10% OFF",
    image: "/products/tin/BLTIN1.png",
    images: [
      { id: 1, image_url: "/products/tin/BLTIN1.png" },
      { id: 2, image_url: "/products/packets/17.png" },
      { id: 4, image_url: "/products/amazon/blue/B2.png" },
      { id: 5, image_url: "/products/amazon/blue/Blue.png" },
      { id: 6, image_url: "/products/amazon/blue/Resizing_Amazon3.png" },
    ],
    variants: [
      { id: 1001, variant_name: "30 Bags", price: 499, weight_g: 60 },
      { id: 1002, variant_name: "60 Bags", price: 899, weight_g: 120 },
    ],
  },
  {
    id: 102,
    name: "Hibiscus Kahwa",
    slug: "hibiscus-kahwa-rosehip-tea",
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
      { id: 5, image_url: "/products/packets/15.png" },
    ],
    variants: [
      { id: 1003, variant_name: "100g Tin", price: 525, weight_g: 100 },
      { id: 1004, variant_name: "200g Tin", price: 949, weight_g: 200 },
    ],
  },
  {
    id: 103,
    name: "Oolong Kahwa",
    slug: "oolong-kahwa",
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
      { id: 7, image_url: "/products/packets/13.png" },
    ],
    variants: [
      { id: 1005, variant_name: "100g Tin", price: 475, weight_g: 100 },
    ],
  },
  {
    id: 104,
    name: "Kashmiri Kahwa",
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
      { id: 9, image_url: "/products/packets/18.png" },
    ],
    variants: [
      { id: 1006, variant_name: "Sampler Box", price: 799, weight_g: 150 },
    ],
  },
  {
    id: 105,
    name: "Mint Kahwa",
    slug: "mint-saffron-kahwa",
    short_description: "Refreshing Evening Brew",
    description: "Cooling mint with a saffron lift for a bright, soothing cup.",
    category_id: 2,
    price: 459,
    oldPrice: 549,
    badge: "10% OFF",
    image: "/products/tin/MLTIN1.png",
    images: [
      { id: 10, image_url: "/products/tin/MLTIN1.png" },
      { id: 11, image_url: "/products/packets/12.png" },
    ],
    variants: [{ id: 1007, variant_name: "75g Tin", price: 459, weight_g: 75 }],
  },
];

export const dummyReviews = [
  {
    id: 1,
    rating: 5,
    review:
      "I rarely post reviews but I gotta say, I was so impressed by the taste and quality that I had to do one. The packaging was beautiful and the tea bags looked premium which is quite unusual for teas as they look quite simple but this one looked like fairy potions. I loved it and so did quite a few of my friends and office mates and would highly recommend it.",
    title: "The quality and taste won my heart",
    name: "Anukriti Kumar",
    location: "India",
    date: "14 February 2026",
    variant: "30 Tea Bags",
    flavor: "Blue Kahwa",
    verified: true,
    helpful: 2,
    images: [
      "/products/amazon/blue/B2.png",
      "/products/amazon/blue/Blue.png",
      "/products/amazon/blue/Resizing_Amazon3.png",
      "/products/packets/18.png",
    ],
  },
  {
    id: 2,
    rating: 4,
    review:
      "Loved the saffron notes and warm finish. The aroma is soothing and the flavor stays clean even on the second steep.",
    title: "Warm, fragrant, and calming",
    name: "Rohit Sharma",
    location: "India",
    date: "03 March 2026",
    variant: "60 Tea Bags",
    flavor: "Kashmiri Kahwa",
    verified: true,
    helpful: 1,
    images: [
      "/products/tin/BLTIN1.png",
      "/products/packets/17.png",
      "/products/packets/16.png",
    ],
  },
  {
    id: 3,
    rating: 5,
    review:
      "Great balance of spices, very comforting. The mint finish is fresh and not overpowering.",
    title: "Comforting with a fresh finish",
    name: "Neha Verma",
    location: "India",
    date: "21 January 2026",
    variant: "100g Tin",
    flavor: "Mint Kahwa",
    verified: true,
    helpful: 0,
    images: [
      "/products/packets/11.png",
      "/products/packets/12.png",
      "/products/packets/13.png",
    ],
  },
  {
    id: 4,
    rating: 4,
    review:
      "Smooth and clean, with a gentle citrus lift. I like it most in the evening when I want something light.",
    title: "Light, citrusy, and smooth",
    name: "Aditi Singh",
    location: "India",
    date: "29 February 2026",
    variant: "75g Tin",
    flavor: "Hibiscus Kahwa",
    verified: true,
    helpful: 0,
    images: [
      "/products/packets/14.png",
      "/products/packets/15.png",
    ],
  },
  {
    id: 5,
    rating: 5,
    review:
      "Beautiful aroma and the color is stunning. Served it to guests and everyone asked for seconds.",
    title: "A stunning tea for guests",
    name: "Karan Mehta",
    location: "India",
    date: "08 April 2026",
    variant: "Sampler Box",
    flavor: "Signature Kahwa",
    verified: true,
    helpful: 0,
    images: [
      "/products/packets/19.png",
      "/products/packets/20.png",
      "/products/tin/MLTIN1.png",
    ],
  },
];

export const dummySubcategories = [
  { id: 201, name: "Bestsellers", slug: "bestsellers" },
  { id: 202, name: "Sampler Packs", slug: "samplers" },
  { id: 203, name: "Wellness Blends", slug: "wellness" },
];
