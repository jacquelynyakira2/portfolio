import type { MapsData } from "~/types";

const maps: MapsData = {
  places: [
    {
      id: "new-york",
      name: "New York City",
      city: "New York",
      country: "United States",
      lat: 40.7128,
      lng: -74.006,
      visitedOn: "2019, 2023",
      notes: "The city never sleeps."
    },
    {
      id: "san-francisco",
      name: "San Francisco",
      city: "San Francisco",
      country: "United States",
      lat: 37.7749,
      lng: -122.4194,
      visitedOn: "Yearly",
      notes: "Golden Gate views."
    },
    {
      id: "mexico-city",
      name: "Mexico City",
      city: "Mexico City",
      country: "Mexico",
      lat: 19.4326,
      lng: -99.1332,
      visitedOn: "2021",
      notes: "Street food tour."
    },
    {
      id: "london",
      name: "London",
      city: "London",
      country: "United Kingdom",
      lat: 51.5074,
      lng: -0.1278,
      visitedOn: "2023",
      notes: "Museum day in Bloomsbury."
    },
    {
      id: "cotswolds",
      name: "Cotswolds",
      city: "Cotswolds",
      country: "United Kingdom",
      lat: 51.93,
      lng: -1.72,
      visitedOn: "2023",
      notes: "Quaint villages and rolling hills."
    },
    {
      id: "bath",
      name: "Bath",
      city: "Bath",
      country: "United Kingdom",
      lat: 51.3758,
      lng: -2.3599,
      visitedOn: "2023",
      notes: "Roman baths and Georgian architecture."
    },
    {
      id: "rome",
      name: "Rome",
      city: "Rome",
      country: "Italy",
      lat: 41.9028,
      lng: 12.4964,
      visitedOn: "2025",
      notes: "Colosseum and gelato."
    },
    {
      id: "tokyo",
      name: "Tokyo",
      city: "Tokyo",
      country: "Japan",
      lat: 35.6762,
      lng: 139.6503,
      visitedOn: "2025",
      notes: "Late-night ramen."
    },
    {
      id: "nagoya",
      name: "Nagoya",
      city: "Nagoya",
      country: "Japan",
      lat: 35.1815,
      lng: 136.9066,
      visitedOn: "2023",
      notes: "Castle and modern city."
    },
    {
      id: "kyoto",
      name: "Kyoto",
      city: "Kyoto",
      country: "Japan",
      lat: 35.0116,
      lng: 135.7681,
      visitedOn: "2023",
      notes: "Temples and traditional culture."
    },
    {
      id: "osaka",
      name: "Osaka",
      city: "Osaka",
      country: "Japan",
      lat: 34.6937,
      lng: 135.5023,
      visitedOn: "2023",
      notes: "Best street food in Japan.",
      favorite: true
    },
    {
      id: "jaipur",
      name: "Jaipur",
      city: "Jaipur",
      country: "India",
      lat: 26.9124,
      lng: 75.7873,
      visitedOn: "2016",
      notes: "The Pink City.",
      favorite: true
    },
    {
      id: "malta",
      name: "Malta",
      city: "Valletta",
      country: "Malta",
      lat: 35.8989,
      lng: 14.5146,
      visitedOn: "2025",
      notes: "Mediterranean island paradise.",
      favorite: true
    },
    {
      id: "phagwara",
      name: "Phagwara",
      city: "Phagwara",
      country: "India",
      lat: 31.224,
      lng: 75.77,
      visitedOn: "2016",
      notes: "Northern India stop."
    },
    {
      id: "agra",
      name: "Agra",
      city: "Agra",
      country: "India",
      lat: 27.1767,
      lng: 78.0081,
      visitedOn: "2016",
      notes: "Taj Mahal visit."
    },
    {
      id: "tulum",
      name: "Tulum",
      city: "Tulum",
      country: "Mexico",
      lat: 20.2114,
      lng: -87.4654,
      visitedOn: "2021",
      notes: "Beachside Mayan ruins."
    },
    {
      id: "san-jose-costa-rica",
      name: "San Jose",
      city: "San Jose",
      country: "Costa Rica",
      lat: 9.9281,
      lng: -84.0907,
      visitedOn: "2022",
      notes: "Capital city exploration."
    },
    {
      id: "monteverde",
      name: "Monteverde",
      city: "Monteverde",
      country: "Costa Rica",
      lat: 10.3067,
      lng: -84.8225,
      visitedOn: "2022",
      notes: "Cloud forest adventure."
    },
    {
      id: "budapest",
      name: "Budapest",
      city: "Budapest",
      country: "Hungary",
      lat: 47.4979,
      lng: 19.0402,
      visitedOn: "2023",
      notes: "Danube views and thermal baths."
    },
    {
      id: "tel-aviv",
      name: "Tel Aviv",
      city: "Tel Aviv",
      country: "Israel",
      lat: 32.0853,
      lng: 34.7818,
      visitedOn: "2024",
      notes: "Mediterranean beach city."
    },
    {
      id: "jerusalem",
      name: "Jerusalem",
      city: "Jerusalem",
      country: "Israel",
      lat: 31.7683,
      lng: 35.2137,
      visitedOn: "2024",
      notes: "Historic Old City."
    },
    {
      id: "split",
      name: "Split",
      city: "Split",
      country: "Croatia",
      lat: 43.5081,
      lng: 16.4402,
      visitedOn: "2023",
      notes: "Diocletian's Palace."
    },
    {
      id: "zadar",
      name: "Zadar",
      city: "Zadar",
      country: "Croatia",
      lat: 44.1194,
      lng: 15.2314,
      visitedOn: "2023",
      notes: "Sea organ and sunset."
    },
    {
      id: "dubrovnik",
      name: "Dubrovnik",
      city: "Dubrovnik",
      country: "Croatia",
      lat: 42.6507,
      lng: 18.0944,
      visitedOn: "2023",
      notes: "Adriatic walled city."
    },
    {
      id: "bari",
      name: "Bari",
      city: "Bari",
      country: "Italy",
      lat: 41.1177,
      lng: 16.8719,
      visitedOn: "2023",
      notes: "Puglia gateway."
    },
    {
      id: "oxford",
      name: "Oxford",
      city: "Oxford",
      country: "United Kingdom",
      lat: 51.752,
      lng: -1.2577,
      notes: "University city."
    },
    {
      id: "hollywood-beach-fl",
      name: "Hollywood Beach",
      city: "Hollywood",
      country: "United States",
      lat: 25.9879,
      lng: -80.1203,
      notes: "Atlantic coast, Broward County."
    },
    {
      id: "miami",
      name: "Miami",
      city: "Miami",
      country: "United States",
      lat: 25.7617,
      lng: -80.1918,
      notes: "South Florida."
    },
    {
      id: "montana",
      name: "Montana",
      city: "Helena",
      country: "United States",
      lat: 46.5891,
      lng: -112.0391,
      notes: "Big Sky Country."
    },
    {
      id: "north-carolina",
      name: "North Carolina",
      city: "Raleigh",
      country: "United States",
      lat: 35.7796,
      lng: -78.6382,
      notes: "Tar Heel State."
    },
    {
      id: "austin",
      name: "Austin",
      city: "Austin",
      country: "United States",
      lat: 30.2672,
      lng: -97.7431,
      notes: "Live music and tacos."
    },
    {
      id: "south-carolina",
      name: "South Carolina",
      city: "Columbia",
      country: "United States",
      lat: 34.0007,
      lng: -81.0348,
      notes: "Palmetto State."
    },
    {
      id: "chicago",
      name: "Chicago",
      city: "Chicago",
      country: "United States",
      lat: 41.8781,
      lng: -87.6298,
      notes: "Lakefront and deep dish."
    },
    {
      id: "tennessee",
      name: "Tennessee",
      city: "Nashville",
      country: "United States",
      lat: 36.1627,
      lng: -86.7816,
      notes: "Volunteer State."
    },
    {
      id: "ohio",
      name: "Ohio",
      city: "Columbus",
      country: "United States",
      lat: 39.9612,
      lng: -82.9988,
      notes: "Buckeye State."
    },
    {
      id: "denver",
      name: "Denver",
      city: "Denver",
      country: "United States",
      lat: 39.7392,
      lng: -104.9903,
      notes: "Mile High City."
    },
    {
      id: "colorado-springs",
      name: "Colorado Springs",
      city: "Colorado Springs",
      country: "United States",
      lat: 38.8339,
      lng: -104.8214,
      notes: "Pikes Peak and Garden of the Gods."
    },
    {
      id: "michigan",
      name: "Michigan",
      city: "Lansing",
      country: "United States",
      lat: 42.7325,
      lng: -84.5555,
      notes: "Great Lakes state."
    }
  ]
};

export default maps;
