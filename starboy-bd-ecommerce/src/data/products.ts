import { Product, Category, Review, UserProfile, Announcement, Message } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Urban Street",
    slug: "urban-street",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600&auto=format&fit=crop",
    description: "Contemporary street style essentials for the modern man.",
    featured: true,
    priority: 1,
  },
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "Pink Poplin Shirt",
    slug: "pink-poplin-shirt",
    shortDescription: "Premium pink poplin cotton shirt with tailored fit.",
    fullDescription:
      "Crafted from 100% Egyptian cotton poplin, this shirt features a tailored modern fit, spread collar, and genuine mother-of-pearl buttons.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1200&auto=format&fit=crop",
    ],
    originalPrice: 2800,
    offerPrice: 2200,
    categories: ["cat-2", "cat-4"],
    tags: ["shirt", "cotton", "formal", "new"],

    availability: "in_stock",
    stockQuantity: 10,

    featured: true,
    trending: false,
    bestSeller: true,

    specs: {
      Fabric: "Egyptian Cotton",
      Fit: "Tailored",
      Collar: "Spread",
      Buttons: "Mother of Pearl",
    },
  },

  {
    id: "prod-2",
    name: "M&S Light Blue Oxford",
    slug: "ms-light-blue-oxford",
    shortDescription: "Classic light blue oxford shirt with modern silhouette.",
    fullDescription:
      "The timeless Oxford shirt reimagined for the modern wardrobe.",
    images: [
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=1200&auto=format&fit=crop",
    ],
    originalPrice: 2600,

    categories: ["cat-2", "cat-4"],
    tags: ["shirt", "oxford", "classic"],

    availability: "in_stock",
    stockQuantity: 15,

    featured: true,
    trending: true,
    bestSeller: false,

    specs: {
      Fabric: "Oxford Cotton",
      Fit: "Regular",
    },
  },

  {
    id: "prod-3",
    name: "Charcoal Premium Shirt",
    slug: "charcoal-premium-shirt",

    shortDescription: "Dark charcoal premium shirt.",
    fullDescription: "Premium charcoal shirt.",

    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
    ],

    originalPrice: 3200,
    offerPrice: 2700,

    categories: ["cat-2"],
    tags: ["shirt", "premium"],

    availability: "in_stock",
    stockQuantity: 8,

    featured: true,
    trending: false,
    bestSeller: false,

    specs: {
      Fit: "Slim",
    },
  },
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    userId: "u1",
    userName: "Rafiq Hossain",
    rating: 5,
    comment: "Amazing quality.",
    createdAt: "2026-05-20T10:00:00Z",
    productId: "prod-1",
  },
];

export const mockUser: UserProfile = {
  id: "u-admin",
  username: "Starboy Admin",
  phone: "+8801XXXXXXXXX",
  email: "admin@starboybd.com",
  role: "admin",
  createdAt: "2024-01-01T00:00:00Z",
};

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "Free Delivery",
    content: "FREE DELIVERY ON ORDERS OVER 5,000 BDT",
    type: "bar",
    active: true,
    priority: 1,
    createdAt: "2026-05-01T00:00:00Z",
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    userId: "u1",
    userName: "Rafiq Hossain",
    productId: "prod-1",
    productName: "Pink Poplin Shirt",
    text: "Hi, do you have this in size L?",
    sender: "user",
    createdAt: "2026-05-25T10:00:00Z",
    read: true,
  },
];
