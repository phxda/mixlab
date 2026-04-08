import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cocktails } from '../data/cocktails';
import type { Cocktail } from '../types';
import { flavorDistance, getFlavorMidpoint, FLAVOR_COLORS, dominantFlavor } from '../utils/flavorClustering';
import RecipeModal from './RecipeModal';

function CocktailPicker({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: Cocktail | null;
  onSelect: (c: Cocktail) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return cocktails
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(240,230,255,0.35)', marginBottom: '8px' }}>
        {label}
      </p>

      {selected && !open ? (
        <button
          onClick={() => { setOpen(true); setQuery(''); }}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: `${selected.color}18`,
            border: `1px solid ${selected.color}50`,
            borderRadius: '12px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '28px' }}>{selected.imageEmoji}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0e6ff' }}>{selected.name}</div>
            <div style={{ fontSize: '11px', color: FLAVOR_COLORS[dominantFlavor(selected.flavorProfile)], marginTop: '2px', fontWeight: 500 }}>
              {dominantFlavor(selected.flavorProfile)}
            </div>
          </div>
        </button>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            autoFocus={open}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={(e) => { setOpen(true); e.currentTarget.style.borderColor = 'rgba(192,132,252,0.4)'; }}
            placeholder="Search cocktails..."
            style={{
              width: '100%',
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: '#f0e6ff',
              fontSize: '14px',
              fontFamily: 'Space Grotesk, sans-serif',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            onBlur={(e) => {
              setTimeout(() => setOpen(false), 150);
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          />
          {open && filtered.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'rgba(20,18,40,0.98)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              overflow: 'hidden',
              zIndex: 50,
            }}>
              {filtered.map((c) => (
                <div
                  key={c.id}
                  onMouseDown={() => { onSelect(c); setOpen(false); setQuery(''); }}
                  style={{
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '20px' }}>{c.imageEmoji}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(240,230,255,0.8)' }}>{c.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlavorCompass() {
  const [cocktailA, setCocktailA] = useState<Cocktail | null>(null);
  const [cocktailB, setCocktailB] = useState<Cocktail | null>(null);
  const [modalCocktail, setModalCocktail] = useState<Cocktail | null>(null);

  const result = useMemo(() => {
    if (!cocktailA || !cocktailB) return null;
    const midpoint = getFlavorMidpoint(cocktailA.flavorProfile, cocktailB.flavorProfile);
    return cocktails
      .filter((c) => c.id !== cocktailA.id && c.id !== cocktailB.id)
      .map((c) => ({ cocktail: c, dist: flavorDistance(c.flavorProfile, midpoint) }))
      .sort((a, b) => a.dist - b.dist)[0]?.cocktail ?? null;
  }, [cocktailA, cocktailB]);

  return (
    <section id="flavor-compass" className="section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Flavor Compass</h2>
        <p className="section-subtitle">
          Pick two cocktails and we'll find the drink that lives exactly between them in flavor space.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <CocktailPicker label="First drink" selected={cocktailA} onSelect={setCocktailA} />

          <div style={{ paddingTop: '36px', color: 'rgba(240,230,255,0.2)', fontSize: '20px', flexShrink: 0 }}>
            ↔
          </div>

          <CocktailPicker label="Second drink" selected={cocktailB} onSelect={setCocktailB} />
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              style={{ marginTop: '32px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                <span style={{ fontSize: '12px', color: 'rgba(240,230,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  The Middle Ground
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              </div>

              <button
                onClick={() => setModalCocktail(result)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  background: `${result.color}12`,
                  border: `1px solid ${result.color}40`,
                  borderRadius: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'background 0.2s, border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${result.color}20`;
                  e.currentTarget.style.borderColor = `${result.color}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${result.color}12`;
                  e.currentTarget.style.borderColor = `${result.color}40`;
                }}
              >
                <span style={{ fontSize: '44px' }}>{result.imageEmoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#f0e6ff', marginBottom: '4px' }}>
                    {result.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(240,230,255,0.5)', marginBottom: '8px', lineHeight: 1.5 }}>
                    {result.description}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {result.vibes.map((v) => (
                      <span key={v} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'rgba(240,230,255,0.4)' }}>
                        {v}
                      </span>
                    ))}
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: `${FLAVOR_COLORS[dominantFlavor(result.flavorProfile)]}20`,
                      color: FLAVOR_COLORS[dominantFlavor(result.flavorProfile)],
                      fontWeight: 600,
                    }}>
                      {dominantFlavor(result.flavorProfile)}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(240,230,255,0.3)', flexShrink: 0 }}>
                  View recipe →
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!cocktailA && !cocktailB && (
          <p style={{ fontSize: '13px', color: 'rgba(240,230,255,0.2)', marginTop: '24px', textAlign: 'center' }}>
            Select two cocktails above to find your midpoint
          </p>
        )}
      </motion.div>

      <RecipeModal
        cocktail={modalCocktail}
        onClose={() => setModalCocktail(null)}
        allCocktails={cocktails}
        onSelectCocktail={setModalCocktail}
      />
    </section>
  );
}
