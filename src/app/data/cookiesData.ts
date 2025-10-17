export interface Cookie {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export const cookiesData: Cookie[] = [
  {
    id: 1,
    name: "Le Fleur Noir",
    description: "Dark chocolate cookie with fleur de sel",
    image: "/cookie1.png",
    price: 3.5
  },
  {
    id: 2,
    name: "Le Savane",
    description: "Marbled cookie with vanilla and cocoa base, milk chocolate",
    image: "/cookie2.png",
    price: 3.5
  },
  {
    id: 3,
    name: "Le Trois Choc",
    description: "Triple chocolate cookie: dark, milk, and white chocolate",
    image: "/cookie3.png",
    price: 3.5
  },
  {
    id: 4,
    name: "Le Choco noisette",
    description: "Milk chocolate and hazelnut cookie with praline",
    image: "/cookie4.png",
    price: 3.5
  },
  {
    id: 5,
    name: "Le Snowreo",
    description: "Oreo cookie with white chocolate",
    image: "/cookie5.png",
    price: 3.5
  },
  {
    id: 6,
    name: "Le Spécul'love",
    description: "Speculoos cookie with speculoos spread",
    image: "/cookie6.png",
    price: 3.5
  },
  {
    id: 7,
    name: "Le Cookella",
    description: "Nutella-filled cookie with praline pieces",
    image: "/cookie7.png",
    price: 3.5
  },
  {
    id: 8,
    name: "Le Oh Bueno",
    description: "Cookie with Kinder Bueno pieces and Bueno spread",
    image: "/cookie8.png",
    price: 3.5
  },
  {
    id: 9,
    name: "Le Cacahuète Caramel",
    description: "Peanut cookie with peanut butter and salted caramel",
    image: "/cookie9.png",
    price: 3.5
  },
  {
    id: 10,
    name: "Le Blanc Macadamia",
    description: "White chocolate cookie with macadamia nuts",
    image: "/cookie10.png",
    price: 3.5
  },
  {
    id: 11,
    name: "Le Pistachie",
    description: "Cocoa base cookie with whole pistachios and pistachio spread",
    image: "/cookie11.png",
    price: 3.5
  },
  {
    id: 12,
    name: "Le Framboisie",
    description: "White chocolate cookie with raspberries",
    image: "/cookie12.png",
    price: 3.5
  }
];
