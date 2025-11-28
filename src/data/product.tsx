// src/data/products.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  subcategory: string;
  available: boolean;

  imageUrl: string;
  detailImageUrl?: string;
  thumbnailImageUrl?: string;
  lifestyleImageUrl?: string;

  specificationDescription?: string; // <-- NEW (full paragraph)
}




// Categories + subcategories
const categories = [
  { name: "Electronics", subs: ["Phones", "Laptops", "Audio", "Smart Home"] },
  { name: "Clothing & Apparel", subs: ["Men", "Women", "Kids", "Accessories"] },
  { name: "Home & Living", subs: ["Furniture", "Decor", "Kitchen", "Bedding"] },
  { name: "Beauty & Personal Care", subs: ["Skincare", "Haircare", "Makeup"] },
  { name: "Sports & Outdoors", subs: ["Fitness", "Camping", "Sportswear"] },
  { name: "Books & Media", subs: ["Books", "eBooks", "Music", "Movies"] },
  { name: "Toys & Games", subs: ["Children's toys", "Board games", "Puzzles"] },
];

// Map realistic Unsplash queries for each subcategory
const imagesMap: Record<string, string[]> = {
  // Electronics
  Phones: ["https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D"],
  Laptops: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww"],
  Audio: ["/hh-removebg-preview.png"],
  "Smart Home": ["/Dynamic Snowboarder_ Digital Fusion.jpeg", "/Dynamic Snowboarder_ Digital Fusion.jpeg"],

  // Clothing & Apparel
  Men: ["https://source.unsplash.com/400x400/?men-clothing", "https://source.unsplash.com/400x400/?men-fashion"],
  Women: ["https://source.unsplash.com/400x400/?women-clothing", "https://source.unsplash.com/400x400/?women-fashion"],
  Kids: ["https://source.unsplash.com/400x400/?kids-clothing", "https://source.unsplash.com/400x400/?children-fashion"],
  Accessories: ["/Golden Rings in Sand.png", "/Golden Rings in Sand.png"],

  // Home & Living
  Furniture: ["/Futuristic Capsule Chair.jpeg", ""],
  Decor: ["https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg", "https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg"],
  Kitchen: ["/Coffee Beans and Cup.png", "https://source.unsplash.com/400x400/?cooking"],
  Bedding: ["https://source.unsplash.com/400x400/?bedding", "https://source.unsplash.com/400x400/?bed"],

  // Beauty & Personal Care
  Skincare: ["https://source.unsplash.com/400x400/?skincare", "https://source.unsplash.com/400x400/?face-cream"],
  Haircare: ["https://source.unsplash.com/400x400/?haircare", "https://source.unsplash.com/400x400/?hair-products"],
  Makeup: [ "/Elegant Lipstick Arrangement.jpeg"],

  // Sports & Outdoors
  Fitness: ["https://source.unsplash.com/400x400/?fitness", "https://source.unsplash.com/400x400/?gym"],
  Camping: ["https://source.unsplash.com/400x400/?camping", "https://source.unsplash.com/400x400/?tent"],
  Sportswear: ["https://source.unsplash.com/400x400/?sportswear", "https://source.unsplash.com/400x400/?athletic-clothing"],

  // Books & Media
  Books: ["https://source.unsplash.com/400x400/?books", "https://source.unsplash.com/400x400/?library"],
  eBooks: ["https://source.unsplash.com/400x400/?ebook", "https://source.unsplash.com/400x400/?kindle"],
  Music: ["https://source.unsplash.com/400x400/?music", "https://source.unsplash.com/400x400/?headphones"],
  Movies: ["https://source.unsplash.com/400x400/?movies", "https://source.unsplash.com/400x400/?cinema"],

  // Toys & Games
  "Children's toys": ["/GREOOMI Vintage Handheld Game.jpeg", "/hh-removebg-preview.png"],
  "Board games": ["https://source.unsplash.com/400x400/?board-games", "https://source.unsplash.com/400x400/?tabletop"],
  Puzzles: ["https://source.unsplash.com/400x400/?puzzle", "https://source.unsplash.com/400x400/?brain-game"],
};

// Generate 84 products deterministically
export const products: Product[] = Array.from({ length: 84 }, (_, i) => {
  const catIndex = Math.floor(i / 12) % categories.length;
  const cat = categories[catIndex];
  const subIndex = i % cat.subs.length;
  const sub = cat.subs[subIndex];

  // Choose image
  const images = imagesMap[sub] || [`https://source.unsplash.com/400x400/?${encodeURIComponent(sub)}`];
  const imageUrl = images[i % images.length];

  return {
    id: i + 1,
    name: `${cat.name} ${sub} Product ${i + 1}`,
    description: `High-quality ${sub} from ${cat.name} collection.`,
    price: 50 + (i * 7) % 500,
    rating: +(1 + ((i * 3) % 5)).toFixed(1),
    reviews: 10 + ((i * 13) % 500),
    category: cat.name,
    subcategory: sub,
    available: i % 5 !== 0,
    imageUrl,
  };
});
