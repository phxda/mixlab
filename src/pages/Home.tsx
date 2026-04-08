import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cocktails } from '../data/cocktails';
import type { Cocktail, Vibe } from '../types';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const VIBES: Vibe[] = ['classic', 'date-night', 'tiki', 'party', 'brunch', 'chill'];

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 20,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 5,
  opacity: 0.03 + Math.random() * 0.08,
}));

const NAV_ITEMS = [
  { to: '/search', emoji: '🧪', label: 'Find Your Drink', desc: 'Search by ingredients or describe what you want' },
  { to: '/explore', emoji: '🗺️', label: 'Explore Flavor Space', desc: 'Map connections between drinks and find your midpoint' },
  { to: '/surprise', emoji: '🎰', label: 'Surprise Me', desc: 'Spin the wheel and let fate choose your drink' },
];

export default function Home() {
  const [modalCocktail, setModalCocktail] = useState<Cocktail | null>(null);

  const featured = useMemo(() => {
    const usedIds = new Set<string>();
    const picks: Cocktail[] = [];
    for (const vibe of VIBES) {
      const match = cocktails.find((c) => c.vibes.includes(vibe) && !usedIds.has(c.id));
      if (match) { picks.push(match); usedIds.add(match.id); }
    }
    return picks;
  }, []);

  return (
    <>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          padding: '0 24px',
        }}
      >
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              bottom: '-50px',
              width: b.size,
              height: b.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(192,132,252,${b.opacity * 3}), rgba(255,107,157,${b.opacity * 2}))`,
              border: `1px solid rgba(255,255,255,${b.opacity})`,
            }}
            animate={{ y: [0, -(window.innerHeight + 100)], x: [0, (Math.random() - 0.5) * 100] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', zIndex: 1 }}
        >
          <motion.div
            style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(240,230,255,0.5)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to
          </motion.div>
          <h1
            style={{
              fontSize: 'clamp(48px, 10vw, 96px)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ff6b9d, #c084fc, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px',
              lineHeight: 1.1,
              marginBottom: '16px',
            }}
          >
            MixLab
          </h1>
          <motion.p
            style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'rgba(240,230,255,0.6)', maxWidth: '500px', lineHeight: 1.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover your next favorite drink. Search by ingredients, explore flavor connections, or let fate decide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/search"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(192,132,252,0.2))',
                border: '1px solid rgba(255,107,157,0.3)',
                borderRadius: '50px',
                color: '#f0e6ff',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,107,157,0.3), rgba(192,132,252,0.3))'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(192,132,252,0.2))'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Mixing
            </Link>
            <Link
              to="/explore"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50px',
                color: 'rgba(240,230,255,0.6)',
                fontSize: '16px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f0e6ff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(240,230,255,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Explore Flavors
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '40px', color: 'rgba(240,230,255,0.3)', fontSize: '24px' }}
        >
          &#8595;
        </motion.div>
      </section>

      {/* Where to go */}
      <section className="section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">What are you after?</h2>
          <p className="section-subtitle">Three ways to find your next drink.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '8px' }}>
          {NAV_ITEMS.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={item.to}
                style={{
                  display: 'block',
                  padding: '28px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(192,132,252,0.25)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.emoji}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0e6ff', marginBottom: '6px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: 'rgba(240,230,255,0.4)', lineHeight: 1.6 }}>{item.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured cocktails */}
      <section className="section" style={{ paddingTop: 0 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Tonight's Picks</h2>
          <p className="section-subtitle">A curated selection across every mood.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {featured.map((c) => (
            <RecipeCard key={c.id} cocktail={c} onClick={() => setModalCocktail(c)} />
          ))}
        </div>
      </section>

      <RecipeModal
        cocktail={modalCocktail}
        onClose={() => setModalCocktail(null)}
        allCocktails={cocktails}
        onSelectCocktail={setModalCocktail}
      />
    </>
  );
}
