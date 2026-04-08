import type { Cocktail, FlavorProfile, Vibe } from '../types';
import { FLAVOR_AXES, flavorDistance } from './flavorClustering';

interface KeywordMapping {
  words: string[];
  boosts: Partial<FlavorProfile>;
  vibes?: Vibe[];
}

const KEYWORD_MAP: KeywordMapping[] = [
  { words: ['sweet', 'sugary', 'dessert', 'candy', 'honeyed', 'syrupy'], boosts: { sweet: 9 } },
  { words: ['sour', 'tart', 'tangy', 'acidic', 'zippy', 'sharp', 'citrusy'], boosts: { sour: 9 } },
  { words: ['bitter', 'dry', 'herbal', 'complex', 'amaro', 'botanical'], boosts: { bitter: 9 } },
  { words: ['strong', 'boozy', 'stiff', 'spirit', 'potent', 'serious', 'heavy'], boosts: { strong: 9 } },
  { words: ['fruity', 'tropical', 'bright', 'vibrant', 'lush', 'exotic'], boosts: { fruity: 9 } },
  { words: ['refreshing', 'light', 'crisp', 'clean', 'cool', 'easy'], boosts: { sour: 5, fruity: 5, sweet: 3 } },
  { words: ['warm', 'warming', 'cozy', 'winter', 'spiced', 'smooth'], boosts: { strong: 7, bitter: 4 } },
  { words: ['summery', 'summer', 'sunny', 'beach', 'poolside'], boosts: { fruity: 7, sweet: 5, sour: 4 } },
  { words: ['sophisticated', 'elegant', 'refined', 'upscale', 'fancy'], boosts: { bitter: 6, strong: 5 } },
  { words: ['party', 'fun', 'festive', 'celebrat', 'crowd'], boosts: {}, vibes: ['party'] },
  { words: ['chill', 'relax', 'mellow', 'laid', 'lazy', 'easy'], boosts: {}, vibes: ['chill'] },
  { words: ['date', 'romantic', 'impress', 'intimate'], boosts: {}, vibes: ['date-night'] },
  { words: ['brunch', 'morning', 'afternoon', 'daytime', 'mimosa'], boosts: {}, vibes: ['brunch'] },
  { words: ['tiki', 'island', 'polynesian', 'luau'], boosts: { fruity: 7, sweet: 6 }, vibes: ['tiki'] },
  { words: ['classic', 'timeless', 'traditional', 'vintage', 'old'], boosts: {}, vibes: ['classic'] },
];

export interface NLResult {
  cocktail: Cocktail;
  score: number;
}

export function parseNaturalLanguage(query: string, allCocktails: Cocktail[]): NLResult[] {
  const words = query.toLowerCase().split(/[\s,!?.;]+/).filter(Boolean);

  const accumulated: FlavorProfile = { sweet: 0, sour: 0, bitter: 0, strong: 0, fruity: 0 };
  const targetVibes = new Set<Vibe>();
  let flavorSignal = false;

  for (const mapping of KEYWORD_MAP) {
    const hit = mapping.words.some((kw) => words.some((w) => w.startsWith(kw) || kw.startsWith(w)));
    if (!hit) continue;

    for (const axis of FLAVOR_AXES) {
      const boost = mapping.boosts[axis];
      if (boost !== undefined) {
        accumulated[axis] += boost;
        flavorSignal = true;
      }
    }
    mapping.vibes?.forEach((v) => targetVibes.add(v));
  }

  if (!flavorSignal && targetVibes.size === 0) return [];

  const vibeArray = [...targetVibes];

  return allCocktails
    .filter((c) => vibeArray.length === 0 || vibeArray.some((v) => c.vibes.includes(v)))
    .map((c) => {
      let score = 0;
      if (flavorSignal) {
        // dot-product: reward cocktails whose high dimensions match our boosts
        for (const axis of FLAVOR_AXES) {
          score += (c.flavorProfile[axis] / 10) * accumulated[axis];
        }
      } else {
        // vibe-only match: use flavorDistance from a neutral profile to rank variety
        score = 1 / (1 + flavorDistance(c.flavorProfile, accumulated));
      }
      return { cocktail: c, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}
