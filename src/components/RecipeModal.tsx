import { motion, AnimatePresence } from 'framer-motion';
import type { Cocktail, FlavorProfile } from '../types';

interface RecipeModalProps {
  cocktail: Cocktail | null;
  onClose: () => void;
}

function RadarChart({ profile }: { profile: FlavorProfile }) {
  const size = 140;
  const center = size / 2;
  const radius = 55;
  const axes: (keyof FlavorProfile)[] = ['sweet', 'sour', 'bitter', 'strong', 'fruity'];
  const colors: Record<string, string> = {
    sweet: '#ff6b9d',
    sour: '#22d3ee',
    bitter: '#fbbf24',
    strong: '#c084fc',
    fruity: '#4ade80',
  };

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / axes.length - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={axes.map((_, i) => {
            const p = getPoint(i, level);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => {
        const p = getPoint(i, 10);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={axes.map((axis, i) => {
          const p = getPoint(i, profile[axis]);
          return `${p.x},${p.y}`;
        }).join(' ')}
        fill="rgba(192,132,252,0.15)"
        stroke="rgba(192,132,252,0.6)"
        strokeWidth="1.5"
      />
      {axes.map((axis, i) => {
        const p = getPoint(i, profile[axis]);
        return (
          <circle key={axis} cx={p.x} cy={p.y} r="3" fill={colors[axis]} />
        );
      })}
      {axes.map((axis, i) => {
        const p = getPoint(i, 12.5);
        return (
          <text
            key={axis}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(240,230,255,0.5)"
            fontSize="9"
            fontFamily="Space Grotesk, sans-serif"
          >
            {axis.charAt(0).toUpperCase() + axis.slice(1)}
          </text>
        );
      })}
    </svg>
  );
}

export default function RecipeModal({ cocktail, onClose }: RecipeModalProps) {
  return (
    <AnimatePresence>
      {cocktail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(20, 18, 40, 0.95)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '6px',
                background: `linear-gradient(90deg, ${cocktail.color}, ${cocktail.color}44)`,
                borderRadius: '20px 20px 0 0',
              }}
            />

            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'rgba(240,230,255,0.6)',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              &times;
            </button>

            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>{cocktail.imageEmoji}</span>
                  <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '4px' }}>
                    {cocktail.name}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'rgba(240,230,255,0.5)', lineHeight: 1.6 }}>
                    {cocktail.description}
                  </p>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: cocktail.difficulty === 'easy'
                          ? 'rgba(34,197,94,0.15)'
                          : cocktail.difficulty === 'medium'
                          ? 'rgba(234,179,8,0.15)'
                          : 'rgba(239,68,68,0.15)',
                        color: cocktail.difficulty === 'easy' ? '#22c55e' : cocktail.difficulty === 'medium' ? '#eab308' : '#ef4444',
                        textTransform: 'uppercase',
                      }}
                    >
                      {cocktail.difficulty}
                    </span>
                    <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'rgba(240,230,255,0.5)' }}>
                      {cocktail.glassType}
                    </span>
                    {cocktail.vibes.map((v) => (
                      <span key={v} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'rgba(240,230,255,0.5)' }}>
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <RadarChart profile={cocktail.flavorProfile} />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(240,230,255,0.4)', marginBottom: '12px' }}>
                  Ingredients
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cocktail.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'rgba(240,230,255,0.8)' }}>{ing.name}</span>
                      <span style={{ color: 'rgba(240,230,255,0.4)', fontWeight: 500 }}>{ing.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(240,230,255,0.4)', marginBottom: '12px' }}>
                  Instructions
                </h3>
                <ol style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '0', listStyle: 'none' }}>
                  {cocktail.instructions.map((step, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        fontSize: '14px',
                        color: 'rgba(240,230,255,0.7)',
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(192,132,252,0.15)',
                          color: '#c084fc',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
