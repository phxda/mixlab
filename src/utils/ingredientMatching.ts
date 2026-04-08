import type { Cocktail, Vibe } from '../types';

const aliasMap: Record<string, string> = {
  'lime juice': 'fresh lime juice',
  'lemon juice': 'fresh lemon juice',
  'oj': 'orange juice',
  'soda': 'club soda',
  'soda water': 'club soda',
  'sparkling water': 'club soda',
  'bacardi': 'white rum',
  'bacardi white': 'white rum',
  'bacardi superior': 'white rum',
  'bacardi gold': 'dark rum',
  'bacardi black': 'dark rum',
  'bacardi oakheart': 'spiced rum',
  'bacardi coconut': 'coconut rum',
  'malibu': 'coconut rum',
  'captain morgan': 'spiced rum',
  'havana club': 'white rum',
  'coke': 'cola',
  'pepsi': 'cola',
  'sugar syrup': 'simple syrup',
  'gomme syrup': 'simple syrup',
  'limes': 'fresh lime juice',
  'lemons': 'fresh lemon juice',
  'mint': 'fresh mint leaves',
  'mint leaves': 'fresh mint leaves',
  'bourbon whiskey': 'bourbon',
  'rye': 'rye whiskey',
  'scotch': 'scotch whisky',
  'cointreau': 'triple sec',
  'grand marnier': 'triple sec',
  'curacao': 'orange curaçao',
  'kahlua': 'coffee liqueur',
  'tia maria': 'coffee liqueur',
  'champagne': 'prosecco',
  'sparkling wine': 'prosecco',
  'cava': 'prosecco',
  'cream': 'heavy cream',
  'whipping cream': 'heavy cream',
};

function normalize(name: string): string {
  const lower = name.toLowerCase().trim();
  return aliasMap[lower] || lower;
}

export interface MatchResult {
  cocktail: Cocktail;
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
}

const OPTIONAL_CATEGORIES = new Set(['garnish']);

export function matchCocktails(
  selectedIngredients: string[],
  allCocktails: Cocktail[],
  vibeFilter?: Vibe[],
): MatchResult[] {
  const normalizedSelected = new Set(selectedIngredients.map(normalize));

  const results: MatchResult[] = [];

  for (const cocktail of allCocktails) {
    if (vibeFilter && vibeFilter.length > 0) {
      const hasVibe = cocktail.vibes.some((v) => vibeFilter.includes(v));
      if (!hasVibe) continue;
    }

    const essential = cocktail.ingredients.filter((i) => !OPTIONAL_CATEGORIES.has(i.category));
    const matched: string[] = [];
    const missing: string[] = [];

    for (const ing of essential) {
      const norm = normalize(ing.name);
      if (normalizedSelected.has(norm)) {
        matched.push(ing.name);
      } else {
        missing.push(ing.name);
      }
    }

    const score = essential.length > 0 ? matched.length / essential.length : 0;
    if (score > 0) {
      results.push({
        cocktail,
        score: matched.length === essential.length ? 1 : score,
        matchedIngredients: matched,
        missingIngredients: missing,
      });
    }
  }

  results.sort((a, b) => b.score - a.score || a.cocktail.name.localeCompare(b.cocktail.name));
  return results;
}

export function getAllIngredientNames(cocktails: Cocktail[]): string[] {
  const names = new Set<string>();
  for (const c of cocktails) {
    for (const ing of c.ingredients) {
      if (ing.category !== 'garnish') {
        names.add(ing.name);
      }
    }
  }
  return Array.from(names).sort();
}
