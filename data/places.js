/**
 * data/places.js
 * - Projet statique : pas de modules ES
 * - On expose `window.places` pour app.js
 *
 * Champs utilisés par app.js :
 * - id (string)
 * - name (string)
 * - category (string)
 * - cuisines (string[])
 * - tags (string[])
 * - address (string)
 * - arrondissement (number)
 * - lat, lng (number)
 * - description (string, optionnel)
 * - priceNote (string, optionnel)
 * - openingHoursNote (string, optionnel)
 * - links: { website, maps, instagram, other[] } (optionnel)
 * - images: string[] (optionnel)
 */

window.places = [
  {
    id: "crispy-soul-paris-11",
    name: "Crispy Soul (Paris 11)",
    category: "restaurant",
    cuisines: ["burger", "fried-chicken"],
    tags: ["waffle-burger", "street-food", "poulet-frit"],
    address: "75 Rue Léon Frot, 75011 Paris",
    arrondissement: 11,
    lat: 48.8574,
    lng: 2.3839,
    description: "Waffle burgers (burger dans une gaufre) + poulet frit.",
    priceNote: "≈ 13€ / personne",
    openingHoursNote: "Horaires variables — vérifier en ligne.",
    links: {
      website: "https://restaurants.crispysoul.fr/paris-11/",
      maps: "https://www.google.com/maps/search/?api=1&query=75%20Rue%20L%C3%A9on%20Frot%2C%2075011%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "reys-glaces-marais",
    name: "REŸS — Glaces Éternelles (Marais)",
    category: "glacier",
    cuisines: ["dessert"],
    tags: ["glace", "parfums-originaux", "a-emporter"],
    address: "4 Rue du Bourg Tibourg, 75004 Paris",
    arrondissement: 4,
    lat: 48.8573,
    lng: 2.3569,
    description: "Glaces avec des parfums originaux (concept “Glaces Éternelles”).",
    priceNote: "≈ 7€",
    openingHoursNote: "Horaires et saisonnalité : vérifier avant d’y aller.",
    links: {
      website: "https://wearereys.com/contact",
      maps: "https://www.google.com/maps/search/?api=1&query=4%20Rue%20du%20Bourg%20Tibourg%2C%2075004%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "the-fridge-comedy-club",
    name: "The Fridge Comedy Club",
    category: "comedy_club",
    cuisines: [],
    tags: ["stand-up", "bar", "show"],
    address: "164 Rue Saint-Denis, 75002 Paris",
    arrondissement: 2,
    lat: 48.8645,
    lng: 2.3496,
    description: "Comedy club / bar avec programmation stand-up.",
    priceNote: "≈ 20€ / personne",
    openingHoursNote: "Séances selon programmation — vérifier la billetterie.",
    links: {
      website: "https://lefridgecomedy.com/",
      maps: "https://www.google.com/maps/search/?api=1&query=164%20Rue%20Saint-Denis%2C%2075002%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "marco-polo-comedy-club",
    name: "Marco Polo Comedy Club",
    category: "comedy_club",
    cuisines: [],
    tags: ["stand-up", "humour"],
    address: "33 Rue Berger, 75001 Paris (secteur Châtelet/Les Halles)",
    arrondissement: 1,
    lat: 48.8622,
    lng: 2.3471,
    description: "Comedy club (shows selon programmation).",
    priceNote: "≈ 10€ / personne",
    openingHoursNote: "Séances selon programmation.",
    links: {
      website: "",
      maps: "https://www.google.com/maps/search/?api=1&query=33%20Rue%20Berger%2C%2075001%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "the-joke-comedy-club",
    name: "The Joke Comedy Club",
    category: "comedy_club",
    cuisines: [],
    tags: ["stand-up", "comedy-club"],
    address: "37 Rue Quincampoix, 75004 Paris (proche Châtelet)",
    arrondissement: 4,
    lat: 48.8600,
    lng: 2.3515,
    description: "Comedy club avec soirées stand-up.",
    priceNote: "≈ 15€ / personne",
    openingHoursNote: "Séances selon programmation — vérifier la billetterie.",
    links: {
      website: "https://thejoke.fr/",
      maps: "https://www.google.com/maps/search/?api=1&query=37%20Rue%20Quincampoix%2C%2075004%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "atelier-des-lumieres",
    name: "Atelier des Lumières",
    category: "exposition",
    cuisines: [],
    tags: ["immersif", "art-numerique", "expo"],
    address: "38 Rue Saint-Maur, 75011 Paris",
    arrondissement: 11,
    lat: 48.8619,
    lng: 2.3809,
    description: "Centre d’art numérique immersif (expositions projetées).",
    priceNote: "≈ 18€",
    openingHoursNote: "Horaires variables selon la période/exposition — vérifier en ligne.",
    links: {
      website: "https://www.atelier-lumieres.com/fr/visiter/horaires-tarifs",
      maps: "https://www.google.com/maps/search/?api=1&query=38%20Rue%20Saint-Maur%2C%2075011%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "tete-dans-les-nuages-opera",
    name: "La Tête dans les Nuages (Paris Opéra)",
    category: "arcade",
    cuisines: [],
    tags: ["arcade", "jeux", "loisir"],
    address: "5 Boulevard des Italiens, 75002 Paris",
    arrondissement: 2,
    lat: 48.8700,
    lng: 2.3329,
    description: "Grande salle d’arcade (jeux, machines, activités).",
    priceNote: "≈ 20–30€",
    openingHoursNote: "Horaires variables — vérifier sur le site.",
    links: {
      website: "https://latetedanslesnuages.com/centres/parisopera/",
      maps: "https://www.google.com/maps/search/?api=1&query=5%20Boulevard%20des%20Italiens%2C%2075002%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "sanukiya",
    name: "Sanukiya",
    category: "restaurant",
    cuisines: ["japonaise"],
    tags: ["udon", "cantine-japonaise"],
    address: "9 Rue d’Argenteuil, 75001 Paris",
    arrondissement: 1,
    lat: 48.8646,
    lng: 2.3323,
    description: "Udon et cuisine japonaise (format cantine).",
    priceNote: "≈ 15–20€ / personne",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "",
      maps: "https://www.google.com/maps/search/?api=1&query=Sanukiya%209%20Rue%20d%27Argenteuil%2075001%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "yoru",
    name: "Yoru",
    category: "restaurant",
    cuisines: ["japonaise"],
    tags: ["japonais-moderne", "diner"],
    address: "62 Rue de la Roquette, 75011 Paris",
    arrondissement: 11,
    lat: 48.8544,
    lng: 2.3717,
    description: "Restaurant japonais moderne (sur place).",
    priceNote: "≈ 20–30€ / personne",
    openingHoursNote: "Horaires variables — vérifier en ligne.",
    links: {
      website: "https://yoru.fr/",
      maps: "https://www.google.com/maps/search/?api=1&query=62%20Rue%20de%20la%20Roquette%2C%2075011%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "atelier-durum",
    name: "L’Atelier Dürüm",
    category: "restaurant",
    cuisines: ["turque"],
    tags: ["durum", "lahmacun", "sandwich"],
    address: "41 Rue de Clignancourt, 75018 Paris",
    arrondissement: 18,
    lat: 48.8840,
    lng: 2.3492,
    description: "Dürüm / lahmacun (cuisine turque).",
    priceNote: "≈ 10–20€ / personne",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "https://latelierdurum.fr/",
      maps: "https://www.google.com/maps/search/?api=1&query=41%20Rue%20de%20Clignancourt%2C%2075018%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "le-wok-saint-germain",
    name: "Le Wok Saint Germain",
    category: "restaurant",
    cuisines: ["thaï", "asiatique"],
    tags: ["formule", "plats-thai"],
    address: "45 Rue Dauphine, 75006 Paris",
    arrondissement: 6,
    lat: 48.8540,
    lng: 2.3393,
    description: "Restaurant asiatique/thaï (plats classiques, formules).",
    priceNote: "≈ 25€ (formule)",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "https://lewoksaintgermain.fr/",
      maps: "https://www.google.com/maps/search/?api=1&query=45%20Rue%20Dauphine%2C%2075006%20Paris",
      instagram: "",
      other: []
    },
    images: []
  },

  {
    id: "noodle-inn-opera",
    name: "Noodle Inn (Opéra)",
    category: "restaurant",
    cuisines: ["chinoise"],
    tags: ["nouilles", "raviolis"],
    address: "23 Boulevard des Italiens, 75002 Paris",
    arrondissement: 2,
    lat: 48.8702,
    lng: 2.3322,
    description: "Nouilles et raviolis (style chinois).",
    priceNote: "≈ 15–20€ / personne",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "",
      maps: "https://www.google.com/maps/search/?api=1&query=23%20Boulevard%20des%20Italiens%2C%2075002%20Paris",
      instagram: "https://www.instagram.com/noodleinn.officiel/",
      other: []
    },
    images: []
  },

  {
    id: "a-fole-paris-19",
    name: "A Folé (Paris 19)",
    category: "restaurant",
    cuisines: ["africaine"],
    tags: ["afrique-de-louest", "plats-traditionnels"],
    address: "187 Avenue Jean Jaurès, 75019 Paris",
    arrondissement: 19,
    lat: 48.8899,
    lng: 2.3891,
    description: "Cuisine ouest-africaine (plats traditionnels).",
    priceNote: "≈ 15–20€ / personne",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "",
      maps: "https://www.google.com/maps/search/?api=1&query=187%20Avenue%20Jean%20Jaur%C3%A8s%2C%2075019%20Paris",
      instagram: "https://www.instagram.com/afole.africanfood/",
      other: []
    },
    images: []
  },

  {
    id: "pocha-montparnasse",
    name: "Pocha! (Montparnasse)",
    category: "restaurant",
    cuisines: ["coréenne"],
    tags: ["bbq-coreen", "partage"],
    address: "82 Boulevard du Montparnasse, 75014 Paris",
    arrondissement: 14,
    lat: 48.8438,
    lng: 2.3247,
    description: "Restaurant coréen (plats à partager, ambiance conviviale).",
    priceNote: "≈ 20–40€ pour 2",
    openingHoursNote: "Horaires variables — vérifier avant d’y aller.",
    links: {
      website: "https://pocha-restaurant.fr/",
      maps: "https://www.google.com/maps/search/?api=1&query=82%20Boulevard%20du%20Montparnasse%2C%2075014%20Paris",
      instagram: "https://www.instagram.com/pocha.officiel/",
      other: []
    },
    images: []
  }
];

/**
 * Exemple (optionnel) : ajouter un nouveau lieu
 * -> Tu ajoutes juste un objet dans window.places ci-dessus.
 * -> Aucun changement à faire ailleurs.
 */
window.addPlace = function addPlace(place) {
  window.places.push(place);
};
