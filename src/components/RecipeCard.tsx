import { motion } from 'framer-motion';
import type { Cocktail } from '../types';

interface RecipeCardProps {
  cocktail: Cocktail;
  onClick: () => void;
  matchScore?: number;
  matchedIngredients?: string[];
  missingIngredients?: string[];
}

export default function RecipeCard({ cocktail, onClick, matchScore, matchedIngredients, missingIngredients }: RecipeCardProps) {
  const getBadge = () => {
    if (matchScore === undefined) return null;
    if (matchScore >= 1) return { text: 'You can make this!', color: '#22c55e' };
    if (matchScore >= 0.6) return { text: `Missing ${missingIngredients?.length || '?'}`, color: '#eab308' };
    return { text: 'Needs more', color: 'rgba(240,230,255,0.3)' };
  };

  const badge = getBadge();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        padding: '0',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '4px',
          background: `linear-gradient(90deg, ${cocktail.color}, ${cocktail.color}88)`,
        }}
      />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>{cocktail.imageEmoji}</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '6px',
              background: cocktail.difficulty === 'easy'
                ? 'rgba(34,197,94,0.15)'
                : cocktail.difficulty === 'medium'
                ? 'rgba(234,179,8,0.15)'
                : 'rgba(239,68,68,0.15)',
              color: cocktail.difficulty === 'easy'
                ? '#22c55e'
                : cocktail.difficulty === 'medium'
                ? '#eab308'
                : '#ef4444',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {cocktail.difficulty}
          </span>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{cocktail.name}</h3>
        <p style={{ fontSize: '13px', color: 'rgba(240,230,255,0.5)', marginBottom: '12px', lineHeight: 1.5 }}>
          {cocktail.description}
        </p>

        {badge && (
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: badge.color,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: badge.color,
              display: 'inline-block',
            }} />
            {badge.text}
          </div>
        )}

        {matchedIngredients && matchedIngredients.length > 0 && (
          <div style={{ fontSize: '11px', color: 'rgba(240,230,255,0.4)', marginBottom: '8px' }}>
            Matched: {matchedIngredients.join(', ')}
          </div>
        )}

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {cocktail.vibes.map((vibe) => (
            <span
              key={vibe}
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,230,255,0.5)',
              }}
            >
              {vibe}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
