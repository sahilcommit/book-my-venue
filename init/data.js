const sampleListings = [
  {
      title: "The Grand Atrium",
      description: "A massive indoor hall with high ceilings, perfect for conventions and large galas.",
      image: { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800", filename: "hall" },
      price: { value: 95000, unit: "day" },
      location: "Mumbai",
      country: "India",
      category: "Event Halls",
      geometry: { type: "Point", coordinates: [72.8777, 19.0760] }
  },
  {
      title: "Eternal Bloom Gardens",
      description: "A romantic outdoor wedding venue featuring floral arches and vintage stone paths.",
      image: { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800", filename: "wedding" },
      price: { value: 150000, unit: "day" },
      location: "Jaipur",
      country: "India",
      category: "Wedding Venues",
      geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
      title: "Sonic Wave Arena",
      description: "A state-of-the-art concert venue with built-in acoustic treatment and stage lighting.",
      image: { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800", filename: "concert" },
      price: { value: 25000, unit: "hour" },
      location: "Bengaluru",
      country: "India",
      category: "Concert Spaces",
      geometry: { type: "Point", coordinates: [77.5946, 12.9716] }
  },
  {
      title: "The Neon Penthouse",
      description: "Modern rooftop lounge with a neon bar—ideal for cocktail parties and birthdays.",
      image: { url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800", filename: "party" },
      price: { value: 65000, unit: "day" },
      location: "Goa",
      country: "India",
      category: "Party Venues",
      geometry: { type: "Point", coordinates: [73.7731, 15.5101] }
  },
  {
      title: "Apex Boardroom",
      description: "Glass-walled corporate meeting space with 4K display and high-speed connectivity.",
      image: { url: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800", filename: "corp" },
      price: { value: 4500, unit: "hour" },
      location: "Gurugram",
      country: "India",
      category: "Corporate Events",
      geometry: { type: "Point", coordinates: [77.0266, 28.4595] }
  },
  {
      title: "Lumina Daylight Studio",
      description: "Minimalist industrial loft with professional backdrops for high-fashion photography.",
      image: { url: "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?q=80&w=800", filename: "shoot" },
      price: { value: 3000, unit: "hour" },
      location: "Kolkata",
      country: "India",
      category: "Photo Shoots",
      geometry: { type: "Point", coordinates: [88.3639, 22.5726] }
  },
  {
    title: "Royal Sapphire Banquet",
    description: "An opulent banquet hall featuring crystal chandeliers, premium dining arrangements, and customizable décor themes for weddings and receptions.",
    image: { 
        url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800", 
        filename: "banquet" 
    },
    price: { value: 120000, unit: "day" },
    location: "Ahmedabad",
    country: "India",
    category: "Banquet Halls",
    geometry: { type: "Point", coordinates: [72.5714, 23.0225] }
},
{
    title: "Sunset Meadows Lawn",
    description: "A scenic open-air lawn surrounded by greenery and fairy lights, ideal for rustic weddings and cultural celebrations.",
    image: { 
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800", 
        filename: "outdoor" 
    },
    price: { value: 85000, unit: "day" },
    location: "Udaipur",
    country: "India",
    category: "Outdoor Venues",
    geometry: { type: "Point", coordinates: [73.7125, 24.5854] }
},
{
    title: "Pulse Night Club Arena",
    description: "A high-energy nightlife venue with DJ console, dynamic lighting systems, and spacious dance floor for concerts and themed parties.",
    image: { 
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800", 
        filename: "nightclub" 
    },
    price: { value: 18000, unit: "hour" },
    location: "Hyderabad",
    country: "India",
    category: "Concert Spaces",
    geometry: { type: "Point", coordinates: [78.4867, 17.3850] }
},
{
    title: "The Urban Creative Hub",
    description: "A modern multi-purpose co-working and event space with flexible seating, workshop zones, and a minimalist industrial aesthetic.",
    image: { 
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800", 
        filename: "creative" 
    },
    price: { value: 7000, unit: "hour" },
    location: "Pune",
    country: "India",
    category: "Others",
    geometry: { type: "Point", coordinates: [73.8567, 18.5204] }
}

];

module.exports = { data: sampleListings };