// BLUSH Stone+ Product Catalog
// Authentic Handcrafted Jewelry Collection

const PRODUCTS = [
  {
    id: 1,
    name: "Aurelia Hammered Gold Bangle",
    subtitle: "Organic Hand-Forged 18k Gold Vermeil Cuff",
    category: "bracelets",
    price: 88,
    originalPrice: 115,
    image: "images/bangle-hammered-gold.jpg",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 128,
    featured: true,
    inStock: 7,
    materials: ["18k Gold Vermeil", "14k Solid Gold (+ $180)", "925 Sterling Silver"],
    sizes: ["Small (5.8\")", "Medium (6.3\") - Standard", "Large (6.8\")"],
    description: "Hand-forged with an undulating, organic hammered texture that catches the light from every angle. Finished in luminous 18k gold vermeil over sterling silver, this statement cuff embodies artisan sophistication for daily wear or elevated evening layering.",
    details: [
      "18k Heavy Gold Vermeil (2.5 microns thick)",
      "Recycled 925 Sterling Silver core",
      "Tarnish-resistant, shower-proof protective seal",
      "Band width: 8mm | Weight: 16.4g",
      "Gently adjustable for the perfect custom fit",
      "Hypoallergenic & 100% Nickel-free"
    ],
    reviews: [
      { name: "Elena R.", date: "2 days ago", rating: 5, comment: "The light reflection is breathtaking. I haven't taken it off in weeks and zero tarnishing!" },
      { name: "Camilla V.", date: "1 week ago", rating: 5, comment: "Heavier than expected in the best way. Feels like genuine high luxury." }
    ]
  },
  {
    id: 2,
    name: "The Coastal Odyssey Talisman Bangle",
    subtitle: "Marine Engraved Gold Cuff with Pavé Gems",
    category: "bracelets",
    price: 94,
    originalPrice: 120,
    image: "images/bangle-ocean-charms.jpg",
    badge: "Signature Piece",
    rating: 5.0,
    reviewCount: 94,
    featured: true,
    inStock: 5,
    materials: ["18k Gold Plated Brass", "18k Gold Vermeil (+ $45)"],
    sizes: ["Standard Oval (60mm x 50mm)"],
    description: "A timeless ocean story rendered in warm brushed gold. Features intricately etched marine symbols — the sea turtle, scallop shell, and palm frond — paired with delicate flush-set pavé crystals. Designed to bring oceanic wanderlust and good fortune to your everyday stack.",
    details: [
      "Rich 18k Warm Gold plating with protective anti-scratch nano-coating",
      "Bezel-flush AAA+ cubic zirconia star accents",
      "Discreet push-release safety clasp mechanism",
      "Oval silhouette designed to prevent spinning on the wrist",
      "Water-resistant & designed for everyday adventures"
    ],
    reviews: [
      { name: "Sofia T.", date: "3 days ago", rating: 5, comment: "I get asked where I got this every single day! The sea turtle engraving is so delicate." },
      { name: "Maya D.", date: "2 weeks ago", rating: 5, comment: "Looks stunning with white linen. Incredible quality for this price." }
    ]
  },
  {
    id: 3,
    name: "Solitaire Sparkle Drop Huggies",
    subtitle: "18k Gold Minimalist Clicker Hoops with CZ Drop",
    category: "earrings",
    price: 62,
    originalPrice: 78,
    image: "images/earrings-solitaire-hoops.jpg",
    badge: "Trending",
    rating: 4.8,
    reviewCount: 216,
    featured: true,
    inStock: 12,
    materials: ["18k Gold Vermeil", "14k Solid Yellow Gold (+ $120)", "Rose Gold Vermeil"],
    sizes: ["10mm Inner Diameter", "12mm Inner Diameter"],
    description: "Dainty meets captivating brilliance. Sleek 18k gold clicker huggie hoops suspend a brilliant-cut solitaire crystal droplet that catches the gentlest rays of sunlight. Designed for sensitive ears with secure click-close comfort.",
    details: [
      "18k Yellow Gold Vermeil over 925 Sterling Silver",
      "AAA+ Brilliant Round Cut Solitaire Zirconia (4mm)",
      "Secure hinge clicker closure (won't snag in hair or clothes)",
      "Featherlight 1.6g per hoop for all-day and sleep comfort",
      "Hypoallergenic, dermatologist-approved post"
    ],
    reviews: [
      { name: "Chloe M.", date: "Yesterday", rating: 5, comment: "I have ultra sensitive ears that react to everything — these are a dream. Pure elegance!" },
      { name: "Aria K.", date: "4 days ago", rating: 5, comment: "The sparkle is unreal. Perfect everyday earrings." }
    ]
  },
  {
    id: 4,
    name: "Solar Amber Eye Medallion Necklace",
    subtitle: "Celestial Evil Eye Amulet with Honey Amber Stone",
    category: "necklaces",
    price: 105,
    originalPrice: 135,
    image: "images/necklace-amber-sun.jpg",
    badge: "Limited Edition",
    rating: 4.9,
    reviewCount: 82,
    featured: true,
    inStock: 4,
    materials: ["18k Gold Vermeil", "925 Sterling Silver"],
    sizes: ["18\" + 2\" Extender (Adjustable)"],
    description: "An emblem of celestial protection and radiant warmth. Featuring a smooth honey-amber tiger’s eye cabochon at the center, framed by an eyelash starburst halo of sparkling marquise crystals on a diamond-cut cable chain.",
    details: [
      "Center Natural Honey Amber Cabochon with golden undertones",
      "Micro-pavé marquise and round cut brilliant stones",
      "18k Solid Gold plating with protective anti-tarnish barrier",
      "Subtle shimmer diamond-cut chain with lobster clasp",
      "Includes 2-inch extender chain for versatile neckline styling"
    ],
    reviews: [
      { name: "Isabella N.", date: "5 days ago", rating: 5, comment: "A true talisman. The amber stone glows warmly in the sunlight. Beyond impressed!" }
    ]
  },
  {
    id: 5,
    name: "Étoile Pavé Eternity Band",
    subtitle: "Micro-Pavé Simulated Diamond Stacking Ring",
    category: "rings",
    price: 68,
    originalPrice: 85,
    image: "images/ring-diamond-eternity.jpg",
    badge: "Essential",
    rating: 4.9,
    reviewCount: 174,
    featured: true,
    inStock: 9,
    materials: ["18k Yellow Gold Vermeil", "Rose Gold Vermeil", "Sterling Silver 925"],
    sizes: ["Size 5", "Size 6", "Size 7", "Size 8", "Size 9"],
    description: "The quintessential gold band reimagined. Micro-pavé crystals set seamlessly around a comfortable contoured 18k gold band. Worn alone for understated luxury or stacked effortlessly.",
    details: [
      "18k Thick Gold Vermeil finish",
      "Continuous 360° micro-pavé prong setting",
      "Slim 1.8mm band profile for seamless stacking",
      "Comfort-fit beveled interior edges"
    ],
    reviews: [
      { name: "Hannah W.", date: "1 week ago", rating: 5, comment: "Matches my solid gold wedding set flawlessly. Stunning craftsmanship." }
    ]
  },
  {
    id: 6,
    name: "Isla Baroque Pearl Pendant",
    subtitle: "Organic Luminous Freshwater Pearl on 18k Gold Chain",
    category: "necklaces",
    price: 79,
    originalPrice: 98,
    image: "images/necklace-pearl-drop.jpg",
    badge: "New Arrival",
    rating: 4.8,
    reviewCount: 67,
    featured: true,
    inStock: 6,
    materials: ["18k Solid Gold Fill", "18k Solid Yellow Gold (+ $140)"],
    sizes: ["16\" Choker Length", "18\" Classic Length", "20\" Layering Length"],
    description: "Organic perfection celebrated in gold. Each luminous freshwater baroque pearl possesses a unique, one-of-a-kind silhouette, hand-wrapped with fine 18k gold wire onto an elegant shimmer chain.",
    details: [
      "100% Genuine Cultured Freshwater Baroque Pearl (Approx 11-13mm)",
      "High natural luster with iridescence",
      "Hand-wound 18k gold wire bail",
      "18k Gold Fill delicate diamond-cut chain",
      "Every single piece is completely unique by nature"
    ],
    reviews: [
      { name: "Grace L.", date: "3 days ago", rating: 5, comment: "The pearl has the most gorgeous iridescent glow! Fast shipping too." }
    ]
  }
];

// Curated Lookbooks & Sets
const CURATED_SETS = [
  {
    id: "set-1",
    title: "The Golden Hour Stacking Duo",
    tagline: "The Artisan Pair",
    description: "Aurelia Hammered Cuff + Coastal Odyssey Talisman Bangle",
    price: 155,
    originalPrice: 182,
    savings: "$27 OFF",
    image: "images/bangle-hammered-gold.jpg",
    productIds: [1, 2]
  },
  {
    id: "set-2",
    title: "The Celestial Sparkle Trio",
    tagline: "Day to Evening Radiance",
    description: "Solitaire Huggies + Solar Amber Medallion + Étoile Band",
    price: 205,
    originalPrice: 235,
    savings: "$30 OFF",
    image: "images/necklace-amber-sun.jpg",
    productIds: [3, 4, 5]
  }
];
