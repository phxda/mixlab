import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cocktails } from '../data/cocktails';
import type { Vibe, Cocktail } from '../types';
import { matchCocktails, getAllIngredientNames } from '../utils/ingredientMatching';
import { parseNaturalLanguage } from '../utils/naturalLanguage';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';
import VibeFilter from './VibeFilter';

export default function IngredientSearch() {
  const [mode, setMode] = useState<'ingredients' | 'describe'>('ingredients');
  const [query, setQuery] = useState('');
  const [nlQuery, setNlQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [vibeFilter, setVibeFilter] = useState<Vibe[]>([]);
  const [modalCocktail, setModalCocktail] = useState<Cocktail | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const allIngredients = useMemo(() => getAllIngredientNames(cocktails), []);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return allIngredients.filter((i) => !selected.includes(i)).slice(0, 12);
    const q = query.toLowerCase();
    return allIngredients
      .filter((i) => i.toLowerCase().includes(q) && !selected.includes(i))
      .slice(0, 8);
  }, [query, allIngredients, selected]);

  const results = useMemo(
    () => matchCocktails(selected, cocktails, vibeFilter.length > 0 ? vibeFilter : undefined),
    [selected, vibeFilter],
  );

  const nlResults = useMemo(
    () => (nlQuery.trim().length > 2 ? parseNaturalLanguage(nlQuery, cocktails) : []),
    [nlQuery],
  );

  const addIngredient = (name: string) => {
    if (!selected.includes(name)) {
      setSelected([...selected, name]);
    }
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeIngredient = (name: string) => {
    setSelected(selected.filter((s) => s !== name));
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <section id="search" className="section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">What's in Your Bar?</h2>
        <p className="section-subtitle">
          {mode === 'ingredients'
            ? 'Add the ingredients you have and we\'ll show you what you can make.'
            : 'Describe what you\'re in the mood for and we\'ll find the right drink.'}
        </p>
      </motion.div>

      <div style={{ maxWidth: '600px', margin: '0 auto 8px', display: 'flex', gap: '8px' }}>
        {(['ingredients', 'describe'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '8px 20px',
              borderRadius: '50px',
              border: '1px solid',
              borderColor: mode === m ? 'rgba(192,132,252,0.5)' : 'rgba(255,255,255,0.1)',
              background: mode === m ? 'rgba(192,132,252,0.15)' : 'transparent',
              color: mode === m ? '#c084fc' : 'rgba(240,230,255,0.4)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            {m === 'ingredients' ? '🧪 By Ingredient' : '✨ Describe It'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
        {mode === 'ingredients' && (
          <div style={{ position: 'relative' }}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                  addIngredient(filteredSuggestions[0]);
                }
              }}
              placeholder="Type an ingredient... (e.g. white rum, lime juice)"
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#f0e6ff',
                fontSize: '16px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(192,132,252,0.3)')}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }
              }}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'rgba(20, 18, 40, 0.98)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  zIndex: 50,
                  maxHeight: '240px',
                  overflowY: 'auto',
                }}
              >
                {filteredSuggestions.map((name) => (
                  <div
                    key={name}
                    onClick={() => addIngredient(name)}
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      color: 'rgba(240,230,255,0.7)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'describe' && (
          <div>
            <input
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="e.g. something tropical and refreshing, or warm and boozy..."
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                color: '#f0e6ff',
                fontSize: '16px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(192,132,252,0.3)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
            <p style={{ fontSize: '12px', color: 'rgba(240,230,255,0.25)', marginTop: '8px' }}>
              Try: "sweet and fruity", "something classic for a date night", "strong and bitter"
            </p>
          </div>
        )}

        {mode === 'ingredients' && selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}
          >
            {selected.map((name) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '50px',
                  background: 'rgba(192,132,252,0.15)',
                  border: '1px solid rgba(192,132,252,0.3)',
                  color: '#c084fc',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {name}
                <button
                  onClick={() => removeIngredient(name)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c084fc',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '0',
                    lineHeight: 1,
                    opacity: 0.6,
                  }}
                >
                  &times;
                </button>
              </motion.span>
            ))}
            <button
              onClick={() => setSelected([])}
              style={{
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,230,255,0.4)',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Clear all
            </button>
          </motion.div>
        )}
      </div>

      {mode === 'ingredients' && <VibeFilter selected={vibeFilter} onChange={setVibeFilter} />}

      {mode === 'ingredients' && selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '32px' }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(240,230,255,0.5)', marginBottom: '24px' }}>
            Found <span style={{ color: '#c084fc', fontWeight: 600 }}>{results.length}</span> cocktails
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {results.map((r) => (
                <RecipeCard
                  key={r.cocktail.id}
                  cocktail={r.cocktail}
                  onClick={() => setModalCocktail(r.cocktail)}
                  matchScore={r.score}
                  matchedIngredients={r.matchedIngredients}
                  missingIngredients={r.missingIngredients}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {mode === 'ingredients' && selected.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: '48px' }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(240,230,255,0.3)', marginBottom: '24px' }}>
            Popular cocktails to get you started
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {cocktails.slice(0, 8).map((c) => (
              <RecipeCard key={c.id} cocktail={c} onClick={() => setModalCocktail(c)} />
            ))}
          </div>
        </motion.div>
      )}

      {mode === 'describe' && nlResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '32px' }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(240,230,255,0.5)', marginBottom: '24px' }}>
            Found <span style={{ color: '#c084fc', fontWeight: 600 }}>{nlResults.length}</span> matches
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {nlResults.map((r) => (
                <RecipeCard
                  key={r.cocktail.id}
                  cocktail={r.cocktail}
                  onClick={() => setModalCocktail(r.cocktail)}
                />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {mode === 'describe' && nlQuery.trim().length > 2 && nlResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginTop: '48px', textAlign: 'center' }}
        >
          <p style={{ fontSize: '14px', color: 'rgba(240,230,255,0.3)' }}>
            No matches found. Try different words like "fruity", "strong", "tropical", or "classic".
          </p>
        </motion.div>
      )}

      <RecipeModal
        cocktail={modalCocktail}
        onClose={() => setModalCocktail(null)}
        allCocktails={cocktails}
        onSelectCocktail={setModalCocktail}
      />
    </section>
  );
}
