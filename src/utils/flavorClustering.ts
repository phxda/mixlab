import type { Cocktail, FlavorProfile } from '../types';

export type FlavorAxis = keyof FlavorProfile;

export const FLAVOR_AXES: FlavorAxis[] = ['sweet', 'sour', 'bitter', 'strong', 'fruity'];

export const FLAVOR_COLORS: Record<FlavorAxis, string> = {
  sweet: '#ff6b9d',
  sour: '#22d3ee',
  bitter: '#fbbf24',
  strong: '#c084fc',
  fruity: '#4ade80',
};

export function dominantFlavor(profile: FlavorProfile): FlavorAxis {
  let max: FlavorAxis = 'sweet';
  let maxVal = -1;
  for (const axis of FLAVOR_AXES) {
    if (profile[axis] > maxVal) {
      maxVal = profile[axis];
      max = axis;
    }
  }
  return max;
}

export function flavorDistance(a: FlavorProfile, b: FlavorProfile): number {
  let sum = 0;
  for (const axis of FLAVOR_AXES) {
    const diff = a[axis] - b[axis];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function getNearestNeighbors(cocktail: Cocktail, allCocktails: Cocktail[], n = 3): Cocktail[] {
  return allCocktails
    .filter((c) => c.id !== cocktail.id)
    .map((c) => ({ cocktail: c, dist: flavorDistance(c.flavorProfile, cocktail.flavorProfile) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, n)
    .map((r) => r.cocktail);
}

export function getFlavorMidpoint(a: FlavorProfile, b: FlavorProfile): FlavorProfile {
  return {
    sweet: (a.sweet + b.sweet) / 2,
    sour: (a.sour + b.sour) / 2,
    bitter: (a.bitter + b.bitter) / 2,
    strong: (a.strong + b.strong) / 2,
    fruity: (a.fruity + b.fruity) / 2,
  };
}

export function getClusterAnchors(width: number, height: number): Record<FlavorAxis, { x: number; y: number }> {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.32;
  const ry = height * 0.32;

  return FLAVOR_AXES.reduce((acc, axis, i) => {
    const angle = (Math.PI * 2 * i) / FLAVOR_AXES.length - Math.PI / 2;
    acc[axis] = {
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    };
    return acc;
  }, {} as Record<FlavorAxis, { x: number; y: number }>);
}
