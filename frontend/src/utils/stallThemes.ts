export interface StallTheme {
  categorySlug: string;
  themeTitle: string;
  headerGradient: string;
  heroBgClass: string;
  accentBadge: string;
  floatingEmojis: string[];
  bannerMotto: string;
  iconName: string;
}

export const getStallTheme = (categoryName?: string, categorySlug?: string): StallTheme => {
  const normalized = (categoryName || categorySlug || '').toLowerCase();

  // 1. Fresh Juices, Shakes, Kulfi & Fruits
  if (
    normalized.includes('juice') ||
    normalized.includes('shake') ||
    normalized.includes('fruit') ||
    normalized.includes('kulfi') ||
    normalized.includes('ice cream') ||
    normalized.includes('coconut')
  ) {
    return {
      categorySlug: 'fruits-juices',
      themeTitle: 'Tropical Fruits & Chilled Refreshments',
      headerGradient: 'from-amber-500 via-orange-500 to-rose-500',
      heroBgClass: 'bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-rose-50/80',
      accentBadge: 'bg-amber-100 text-amber-900 border-amber-300',
      floatingEmojis: ['🥭', '🍉', '🍍', '🍓', '🍦', '🥥', '🍊', '🥤'],
      bannerMotto: 'Freshly pressed seasonal fruits, artisanal kulfis & thick milkshakes',
      iconName: 'Citrus',
    };
  }

  // 2. Tea & Coffee Stall
  if (normalized.includes('tea') || normalized.includes('coffee') || normalized.includes('chai')) {
    return {
      categorySlug: 'tea-coffee',
      themeTitle: 'Aromatic Filter Coffee & Cutting Chai',
      headerGradient: 'from-amber-700 via-yellow-600 to-stone-800',
      heroBgClass: 'bg-gradient-to-br from-stone-50 via-amber-50/70 to-yellow-50/50',
      accentBadge: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      floatingEmojis: ['☕', '🫖', '🍂', '🥛', '🌿', '🍪'],
      bannerMotto: 'Strong degree filter decoctions, steaming masala chai & piping hot ginger tea',
      iconName: 'Coffee',
    };
  }

  // 3. Tiffin & Breakfast
  if (normalized.includes('tiffin') || normalized.includes('breakfast') || normalized.includes('idli') || normalized.includes('dosa')) {
    return {
      categorySlug: 'tiffin-breakfast',
      themeTitle: 'Traditional Hot Tiffin & Breakfast Cart',
      headerGradient: 'from-emerald-600 via-teal-600 to-amber-600',
      heroBgClass: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/60 to-amber-50/50',
      accentBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      floatingEmojis: ['🥞', '🍚', '🥥', '🥣', '🍛', '🌿'],
      bannerMotto: 'Melt-in-mouth soft idlis, golden ghee roast dosas & medu vadas',
      iconName: 'Utensils',
    };
  }

  // 4. Chaat & Street Snacks
  if (normalized.includes('chaat') || normalized.includes('pani puri') || normalized.includes('snack') || normalized.includes('bhel')) {
    return {
      categorySlug: 'chaat-snacks',
      themeTitle: 'Crisp & Tangy Street Chaat Bazaar',
      headerGradient: 'from-rose-600 via-red-500 to-amber-500',
      heroBgClass: 'bg-gradient-to-br from-rose-50/80 via-red-50/50 to-amber-50/50',
      accentBadge: 'bg-rose-100 text-rose-900 border-rose-300',
      floatingEmojis: ['🥟', '🫓', '🥔', '🌶️', '🌿', '🧅'],
      bannerMotto: 'Flavourful spicy mint water, potato masalas & authentic street savories',
      iconName: 'Sparkles',
    };
  }

  // 5. Biryani & Parotta Stall
  if (normalized.includes('biryani') || normalized.includes('parotta') || normalized.includes('chicken') || normalized.includes('meat')) {
    return {
      categorySlug: 'biryani-street',
      themeTitle: 'Street Parotta & Saffron Dum Biryani',
      headerGradient: 'from-red-700 via-amber-600 to-stone-900',
      heroBgClass: 'bg-gradient-to-br from-red-50/80 via-amber-50/50 to-stone-100',
      accentBadge: 'bg-red-100 text-red-900 border-red-300',
      floatingEmojis: ['🍗', '🍚', '🥘', '🧅', '🍋', '🌶️'],
      bannerMotto: 'Flaky hot layered parottas, flavorful spicy salna & fragrant dum biryani',
      iconName: 'Flame',
    };
  }

  // 6. Bakery & Sweets
  if (normalized.includes('bakery') || normalized.includes('cake') || normalized.includes('sweet') || normalized.includes('mithai')) {
    return {
      categorySlug: 'bakery-sweets',
      themeTitle: 'Fresh Bakery & Confectionery Sweets',
      headerGradient: 'from-pink-600 via-purple-500 to-amber-500',
      heroBgClass: 'bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-amber-50/40',
      accentBadge: 'bg-pink-100 text-pink-900 border-pink-300',
      floatingEmojis: ['🧁', '🍰', '🥐', '🍬', '🎂', '🍩'],
      bannerMotto: 'Crisp vegetable puffs, freshly baked buns & traditional handmade sweets',
      iconName: 'Cake',
    };
  }

  // Default Standard Eatery Theme
  return {
    categorySlug: 'general-eatery',
    themeTitle: 'Local Mini Food Stall',
    headerGradient: 'from-amber-500 to-rose-500',
    heroBgClass: 'bg-gradient-to-br from-amber-50 via-white to-slate-50',
    accentBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    floatingEmojis: ['🍽️', '✨', '⚡', '📍', '⭐'],
    bannerMotto: 'Real-time live inventory and availability updates for your loyal customers',
    iconName: 'Store',
  };
};
