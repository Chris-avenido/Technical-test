import { SupportedLanguage } from '../lib/types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  searchPlaceholder: string;
  searchButton: string;
  searching: string;
  recentSearches: string;
  clearHistory: string;
  noResultsTitle: string;
  noResultsDesc: string;
  resultsFound: string;
  brand: string;
  barcode: string;
  quantity: string;
  categories: string;
  ingredients: string;
  noIngredients: string;
  nutritionalValues: string;
  per100g: string;
  energy: string;
  fat: string;
  saturatedFat: string;
  carbohydrates: string;
  sugars: string;
  fiber: string;
  proteins: string;
  salt: string;
  sodium: string;
  proSubscriber: string;
  freeTier: string;
  lockedNutritionTitle: string;
  lockedNutritionDesc: string;
  subscribeButton: string;
  subscribing: string;
  demoBadge: string;
  togglePro: string;
  toggleFree: string;
  evaluatorMode: string;
  close: string;
  viewDetails: string;
  nutriscoreGrade: string;
  ecoscoreGrade: string;
  novaGroup: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Food Finder',
    appTagline: 'Discover packaged food products, ingredients, and verified nutrition.',
    searchPlaceholder: 'Search products by name or term (e.g., Nutella, Oat milk, Muesli)...',
    searchButton: 'Search',
    searching: 'Searching products...',
    recentSearches: 'Recent Searches',
    clearHistory: 'Clear',
    noResultsTitle: 'No products found',
    noResultsDesc: 'Try searching with different terms or check for spelling mistakes.',
    resultsFound: 'products found',
    brand: 'Brand',
    barcode: 'Barcode',
    quantity: 'Quantity',
    categories: 'Categories',
    ingredients: 'Ingredients',
    noIngredients: 'Ingredient information not available for this product.',
    nutritionalValues: 'Nutritional Values',
    per100g: 'Per 100g / 100ml',
    energy: 'Energy',
    fat: 'Fat',
    saturatedFat: 'Saturated Fat',
    carbohydrates: 'Carbohydrates',
    sugars: 'Sugars',
    fiber: 'Dietary Fiber',
    proteins: 'Proteins',
    salt: 'Salt',
    sodium: 'Sodium',
    proSubscriber: 'PRO SUBSCRIBER',
    freeTier: 'FREE TIER',
    lockedNutritionTitle: 'Nutritional Breakdown Locked',
    lockedNutritionDesc: 'Detailed nutritional values, macro/micro nutrients, and health ratings are reserved for active Pro subscribers.',
    subscribeButton: 'Upgrade to Pro ($9.99/mo)',
    subscribing: 'Redirecting to Stripe...',
    demoBadge: 'Demo User: demo@example.com',
    togglePro: 'Switch to Pro',
    toggleFree: 'Switch to Free',
    evaluatorMode: 'Evaluation Mode',
    close: 'Close',
    viewDetails: 'View Nutrition & Details',
    nutriscoreGrade: 'Nutri-Score',
    ecoscoreGrade: 'Eco-Score',
    novaGroup: 'NOVA Group',
  },
  nl: {
    appName: 'Voedsel Zoeker',
    appTagline: 'Ontdek verpakte voedingsmiddelen, ingrediënten en gecontroleerde voedingswaarden.',
    searchPlaceholder: 'Zoek producten op naam of term (bijv. Nutella, Havermout, Muesli)...',
    searchButton: 'Zoeken',
    searching: 'Producten zoeken...',
    recentSearches: 'Recente Zoekopdrachten',
    clearHistory: 'Wissen',
    noResultsTitle: 'Geen producten gevonden',
    noResultsDesc: 'Probeer andere zoektermen of controleer op spelfouten.',
    resultsFound: 'producten gevonden',
    brand: 'Merk',
    barcode: 'Streepjescode',
    quantity: 'Hoeveelheid',
    categories: 'Categorieën',
    ingredients: 'Ingrediënten',
    noIngredients: 'Ingrediëntinformatie niet beschikbaar voor dit product.',
    nutritionalValues: 'Voedingswaarden',
    per100g: 'Per 100g / 100ml',
    energy: 'Energie',
    fat: 'Vetten',
    saturatedFat: 'Verzadigde vetten',
    carbohydrates: 'Koolhydraten',
    sugars: 'Suikers',
    fiber: 'Voedingsvezels',
    proteins: 'Eiwitten',
    salt: 'Zout',
    sodium: 'Natrium',
    proSubscriber: 'PRO ABONNEE',
    freeTier: 'GRATIS VERSIE',
    lockedNutritionTitle: 'Voedingswaarden Vergrendeld',
    lockedNutritionDesc: 'Gedetailleerde voedingswaarden, macro/micro nutriënten en scores zijn alleen beschikbaar voor Pro abonnees.',
    subscribeButton: 'Upgrade naar Pro (€9,99/mnd)',
    subscribing: 'Doorverwijzen naar Stripe...',
    demoBadge: 'Demo Gebruiker: demo@example.com',
    togglePro: 'Schakel naar Pro',
    toggleFree: 'Schakel naar Gratis',
    evaluatorMode: 'Beoordelingsmodus',
    close: 'Sluiten',
    viewDetails: 'Bekijk Voeding & Details',
    nutriscoreGrade: 'Nutri-Score',
    ecoscoreGrade: 'Eco-Score',
    novaGroup: 'NOVA Groep',
  },
  de: {
    appName: 'Lebensmittel-Finder',
    appTagline: 'Entdecken Sie verpackte Lebensmittel, Zutaten und verifizierte Nährwerte.',
    searchPlaceholder: 'Produkte nach Namen oder Begriff suchen (z.B. Nutella, Hafermilch, Müsli)...',
    searchButton: 'Suchen',
    searching: 'Produkte werden gesucht...',
    recentSearches: 'Letzte Suchanfragen',
    clearHistory: 'Löschen',
    noResultsTitle: 'Keine Produkte gefunden',
    noResultsDesc: 'Versuchen Sie es mit anderen Begriffen oder prüfen Sie die Schreibweise.',
    resultsFound: 'Produkte gefunden',
    brand: 'Marke',
    barcode: 'Barcode',
    quantity: 'Menge',
    categories: 'Kategorien',
    ingredients: 'Zutaten',
    noIngredients: 'Keine Zutateninformationen für dieses Produkt verfügbar.',
    nutritionalValues: 'Nährwertangaben',
    per100g: 'Pro 100g / 100ml',
    energy: 'Energie',
    fat: 'Fett',
    saturatedFat: 'Gesättigte Fettsäuren',
    carbohydrates: 'Kohlenhydrate',
    sugars: 'Zucker',
    fiber: 'Ballaststoffe',
    proteins: 'Eiweiß',
    salt: 'Salz',
    sodium: 'Natrium',
    proSubscriber: 'PRO ABONNENT',
    freeTier: 'KOSTENLOS',
    lockedNutritionTitle: 'Nährwerttabelle Gesperrt',
    lockedNutritionDesc: 'Detaillierte Nährwerte, Makro- und Mikronährstoffe sind aktiven Pro-Abonnenten vorbehalten.',
    subscribeButton: 'Upgrade auf Pro (9,99 €/Monat)',
    subscribing: 'Weiterleitung zu Stripe...',
    demoBadge: 'Demo-Benutzer: demo@example.com',
    togglePro: 'Zu Pro wechseln',
    toggleFree: 'Zu Kostenlos wechseln',
    evaluatorMode: 'Bewertungsmodus',
    close: 'Schließen',
    viewDetails: 'Nährwerte & Details ansehen',
    nutriscoreGrade: 'Nutri-Score',
    ecoscoreGrade: 'Eco-Score',
    novaGroup: 'NOVA Gruppe',
  },
  fr: {
    appName: 'Food Finder',
    appTagline: 'Découvrez les produits alimentaires emballés, leurs ingrédients et valeurs nutritionnelles vérifiées.',
    searchPlaceholder: 'Rechercher des produits par nom ou mot-clé (ex: Nutella, Lait d\'avoine, Muesli)...',
    searchButton: 'Rechercher',
    searching: 'Recherche des produits en cours...',
    recentSearches: 'Recherches Récentes',
    clearHistory: 'Effacer',
    noResultsTitle: 'Aucun produit trouvé',
    noResultsDesc: 'Essayez avec d\'autres termes ou vérifiez l\'orthographe.',
    resultsFound: 'produits trouvés',
    brand: 'Marque',
    barcode: 'Code-barres',
    quantity: 'Quantité',
    categories: 'Catégories',
    ingredients: 'Ingrédients',
    noIngredients: 'Informations sur les ingrédients non disponibles pour ce produit.',
    nutritionalValues: 'Valeurs Nutritionnelles',
    per100g: 'Pour 100g / 100ml',
    energy: 'Énergie',
    fat: 'Matières grasses',
    saturatedFat: 'Acides gras saturés',
    carbohydrates: 'Glucides',
    sugars: 'Sucres',
    fiber: 'Fibres alimentaires',
    proteins: 'Protéines',
    salt: 'Sel',
    sodium: 'Sodium',
    proSubscriber: 'ABONNÉ PRO',
    freeTier: 'COMPTE GRATUIT',
    lockedNutritionTitle: 'Tableau Nutritionnel Verrouillé',
    lockedNutritionDesc: 'Les valeurs nutritionnelles détaillées et scores de santé sont réservés aux abonnés Pro actifs.',
    subscribeButton: 'Passer à Pro (9,99 €/mois)',
    subscribing: 'Redirection vers Stripe...',
    demoBadge: 'Utilisateur Démo: demo@example.com',
    togglePro: 'Passer en Pro',
    toggleFree: 'Passer en Gratuit',
    evaluatorMode: 'Mode Évaluation',
    close: 'Fermer',
    viewDetails: 'Voir Nutrition & Détails',
    nutriscoreGrade: 'Nutri-Score',
    ecoscoreGrade: 'Eco-Score',
    novaGroup: 'Groupe NOVA',
  },
};
