import type { Cocktail, FlavorProfile, Vibe } from '../types';
import { FLAVOR_AXES, flavorDistance } from './flavorClustering';

interface KeywordMapping {
  words: string[];
  boosts: Partial<FlavorProfile>;
  vibes?: Vibe[];
}

// Positive mappings
const POSITIVE_MAP: KeywordMapping[] = [
  // Sweet
  {
    words: ['sweet', 'sweetness', 'sweeter', 'sugary', 'sugar', 'dessert', 'candy', 'honeyed', 'honey', 'syrupy', 'syrup', 'indulgent', 'decadent', 'rich', 'smooth'],
    boosts: { sweet: 9 },
  },
  // Sour / tart / citrus
  {
    words: ['sour', 'sourness', 'tart', 'tartness', 'tangy', 'tang', 'acidic', 'acid', 'zippy', 'sharp', 'citrus', 'citrusy', 'citric', 'lemon', 'lemony', 'lime', 'zingy', 'zesty', 'zest', 'bright', 'brisk'],
    boosts: { sour: 9 },
  },
  // Bitter / herbal / complex
  {
    words: ['bitter', 'bitterness', 'dry', 'drier', 'driest', 'herbal', 'herb', 'herbaceous', 'botanical', 'botanicals', 'complex', 'sophisticated', 'refined', 'elegant', 'grown-up', 'adult', 'serious', 'amaro', 'aperitif', 'digestif', 'negroni', 'vermouth', 'campari'],
    boosts: { bitter: 9 },
  },
  // Strong / boozy
  {
    words: ['strong', 'stronger', 'strongest', 'boozy', 'booze', 'spirit', 'spirits', 'spirited', 'potent', 'heavy', 'stiff', 'neat', 'punch', 'punchy', 'bold', 'robust', 'intense', 'kick', 'warming', 'warm', 'cozy', 'whiskey', 'whisky', 'bourbon', 'scotch', 'gin', 'rum', 'vodka', 'tequila', 'mezcal'],
    boosts: { strong: 9 },
  },
  // Fruity / tropical
  {
    words: ['fruity', 'fruit', 'fruits', 'tropical', 'tropics', 'exotic', 'vibrant', 'lush', 'island', 'beach', 'summer', 'summery', 'sunny', 'sunshine', 'mango', 'pineapple', 'passion', 'peach', 'strawberry', 'raspberry', 'berry', 'berries', 'melon', 'coconut', 'hibiscus'],
    boosts: { fruity: 9 },
  },
  // Light / refreshing
  {
    words: ['light', 'lighter', 'lightweight', 'easy', 'refreshing', 'refresh', 'crisp', 'clean', 'cool', 'cooling', 'delicate', 'gentle', 'simple', 'sessionable', 'low-key', 'lowkey', 'casual', 'breezy', 'airy', 'spritz', 'bubbly', 'fizzy', 'sparkling', 'effervescent'],
    boosts: { sweet: 4, sour: 5, fruity: 5, strong: -3, bitter: -2 },
  },
  // Warm / winter / cozy
  {
    words: ['winter', 'wintery', 'cold', 'cold-weather', 'fireside', 'fireplace', 'spiced', 'spice', 'spicy', 'mulled', 'autumnal', 'fall', 'autumn', 'halloween', 'thanksgiving', 'christmas', 'holiday', 'festive', 'cosy', 'nightcap'],
    boosts: { strong: 7, bitter: 4, sweet: 3 },
  },
  // Poolside / summer party
  {
    words: ['poolside', 'pool', 'hot', 'heat', 'sundowner', 'sunset', 'barbecue', 'bbq', 'patio', 'garden', 'outdoor', 'picnic', 'vacation', 'holiday', 'getaway', 'escape'],
    boosts: { fruity: 7, sweet: 5, sour: 4, strong: -2 },
  },
  // After dinner / nightcap
  {
    words: ['dinner', 'after-dinner', 'afterdinner', 'nightcap', 'late', 'evening', 'night', 'midnight', 'slow', 'sipping', 'sipper'],
    boosts: { bitter: 6, strong: 7, sweet: -2 },
  },
  // Brunch / morning / daytime
  {
    words: ['brunch', 'morning', 'breakfast', 'daytime', 'afternoon', 'day', 'mimosa', 'bloody', 'hair-of-the-dog', 'sunday', 'weekend'],
    boosts: { sour: 4, fruity: 5, sweet: 4, strong: -3 },
    vibes: ['brunch'],
  },

  // Vibes
  {
    words: ['party', 'parties', 'crowd', 'crowdpleaser', 'crowd-pleaser', 'group', 'friends', 'celebrate', 'celebration', 'celebratory', 'toast', 'club', 'bar', 'dancing', 'shots'],
    boosts: { sweet: 3, fruity: 3 },
    vibes: ['party'],
  },
  {
    words: ['chill', 'chilled', 'chilling', 'relax', 'relaxed', 'relaxing', 'mellow', 'laidback', 'laid-back', 'lazy', 'slow', 'calm', 'wind-down', 'winddown', 'unwind', 'netflix', 'couch', 'home'],
    boosts: {},
    vibes: ['chill'],
  },
  {
    words: ['date', 'romantic', 'romance', 'impress', 'impressive', 'intimate', 'sexy', 'seductive', 'special', 'fancy', 'upscale', 'nice', 'occasion', 'anniversary', 'valentine'],
    boosts: { bitter: 3, sweet: 3 },
    vibes: ['date-night'],
  },
  {
    words: ['tiki', 'polynesian', 'hawaiian', 'luau', 'mai-tai', 'maitai', 'zombie', 'rum-based', 'umbrella', 'fun'],
    boosts: { fruity: 7, sweet: 6 },
    vibes: ['tiki'],
  },
  {
    words: ['classic', 'timeless', 'traditional', 'vintage', 'old-fashioned', 'oldfashioned', 'historic', 'retro', 'proper', 'bartender', 'canonical', 'legendary', 'famous'],
    boosts: { bitter: 3, strong: 4 },
    vibes: ['classic'],
  },
  // Girly / sweet-forward (no judgment, just what people type)
  {
    words: ['girly', 'cute', 'pink', 'pretty', 'feminine', 'floral', 'flowery', 'delicate', 'soft'],
    boosts: { sweet: 7, fruity: 6, sour: 3, bitter: -3 },
  },
  // Manly / spirit-forward (same)
  {
    words: ['manly', 'masculine', 'rugged', 'no-nonsense', 'straight', 'neat', 'on-the-rocks', 'rocks', 'straight-up'],
    boosts: { strong: 8, bitter: 5, sweet: -4 },
  },
];

// Negative/dampening mappings — "not too X" reduces that axis
const NEGATIVE_MAP: KeywordMapping[] = [
  {
    words: ['sweet', 'sugary', 'sugar', 'syrupy'],
    boosts: { sweet: -8 },
  },
  {
    words: ['sour', 'tart', 'acidic', 'citrus', 'citrusy'],
    boosts: { sour: -8 },
  },
  {
    words: ['bitter', 'dry'],
    boosts: { bitter: -8 },
  },
  {
    words: ['strong', 'boozy', 'heavy', 'potent', 'stiff'],
    boosts: { strong: -8, sweet: 3, fruity: 3 },
  },
  {
    words: ['fruity', 'tropical', 'fruit'],
    boosts: { fruity: -8 },
  },
];

// Negation trigger words — when found immediately before a flavor word, flip the signal
const NEGATION_WORDS = new Set(['not', "don't", 'dont', 'no', 'without', 'avoid', 'less', 'lighter', 'low', 'mild', 'nothing', 'skip', 'hate', 'dislike']);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/['']/g, '')        // smart quotes
    .replace(/[-]/g, ' ')        // hyphens → spaces
    .split(/[\s,!?.;:]+/)
    .filter(Boolean);
}

function matches(word: string, keywords: string[]): boolean {
  return keywords.some(
    (kw) =>
      word === kw ||
      word.startsWith(kw) ||
      kw.startsWith(word) ||
      (word.length > 4 && kw.includes(word)) ||
      (kw.length > 4 && word.includes(kw)),
  );
}

export interface NLResult {
  cocktail: Cocktail;
  score: number;
}

export function parseNaturalLanguage(query: string, allCocktails: Cocktail[]): NLResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const accumulated: FlavorProfile = { sweet: 0, sour: 0, bitter: 0, strong: 0, fruity: 0 };
  const targetVibes = new Set<Vibe>();
  let flavorSignal = false;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    const prevWord = i > 0 ? tokens[i - 1] : '';
    const isNegated = NEGATION_WORDS.has(prevWord);

    if (isNegated) {
      // Check if this word triggers a negative mapping
      for (const mapping of NEGATIVE_MAP) {
        if (matches(word, mapping.words)) {
          for (const axis of FLAVOR_AXES) {
            const boost = mapping.boosts[axis];
            if (boost !== undefined) {
              accumulated[axis] += boost;
              flavorSignal = true;
            }
          }
        }
      }
    }

    // Always check positive mappings (even after negation words, since "not sweet" already handled above)
    if (!isNegated) {
      for (const mapping of POSITIVE_MAP) {
        if (matches(word, mapping.words)) {
          for (const axis of FLAVOR_AXES) {
            const boost = mapping.boosts[axis];
            if (boost !== undefined) {
              accumulated[axis] += boost;
              flavorSignal = true;
            }
          }
          mapping.vibes?.forEach((v) => targetVibes.add(v));
        }
      }
    }
  }

  if (!flavorSignal && targetVibes.size === 0) return [];

  const vibeArray = [...targetVibes];

  return allCocktails
    .filter((c) => vibeArray.length === 0 || vibeArray.some((v) => c.vibes.includes(v)))
    .map((c) => {
      let score = 0;
      if (flavorSignal) {
        for (const axis of FLAVOR_AXES) {
          const weight = accumulated[axis];
          if (weight > 0) {
            // reward cocktails with high values on boosted axes
            score += (c.flavorProfile[axis] / 10) * weight;
          } else if (weight < 0) {
            // penalise cocktails with high values on negated axes
            score += (1 - c.flavorProfile[axis] / 10) * Math.abs(weight) * 0.5;
          }
        }
      } else {
        score = 1 / (1 + flavorDistance(c.flavorProfile, accumulated));
      }
      return { cocktail: c, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
