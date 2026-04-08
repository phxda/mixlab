export interface FlavorProfile {
  sweet: number;
  sour: number;
  bitter: number;
  strong: number;
  fruity: number;
}

export interface Ingredient {
  name: string;
  amount: string;
  category: IngredientCategory;
}

export type IngredientCategory =
  | 'spirit'
  | 'liqueur'
  | 'mixer'
  | 'juice'
  | 'syrup'
  | 'garnish'
  | 'bitter'
  | 'other';

export type Vibe = 'party' | 'chill' | 'date-night' | 'brunch' | 'tiki' | 'classic';
export type Difficulty = 'easy' | 'medium' | 'advanced';

export interface Cocktail {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  flavorProfile: FlavorProfile;
  color: string;
  difficulty: Difficulty;
  vibes: Vibe[];
  glassType: string;
  imageEmoji: string;
  description: string;
}
