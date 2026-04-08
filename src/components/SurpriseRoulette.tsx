import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cocktails } from '../data/cocktails';
import type { Cocktail } from '../types';
import RecipeCard from './RecipeCard';
import RecipeModal from './RecipeModal';

function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 500,
        y: -(100 + Math.random() * 300),
        rotate: Math.random() * 720,
        color: ['#ff6b9d', '#c084fc', '#22d3ee', '#fbbf24', '#4ade80'][Math.floor(Math.random() * 5)],
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.3,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {show &&
        pieces.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: p.size,
              height: p.size,
              borderRadius: p.size > 8 ? '2px' : '50%',
              background: p.color,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        ))}
    </AnimatePresence>
  );
}

export default function SurpriseRoulette() {
  const [spinning, setSpinning] = useState(false);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalCocktail, setModalCocktail] = useState<Cocktail | null>(null);

  const wheelCocktails = useMemo(() => {
    const shuffled = [...cocktails].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 16);
  }, []);

  const segmentAngle = 360 / wheelCocktails.length;

  const conicGradient = useMemo(() => {
    const stops = wheelCocktails.map((c, i) => {
      const start = (i * segmentAngle).toFixed(1);
      const end = ((i + 1) * segmentAngle).toFixed(1);
      return `${c.color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from 0deg, ${stops.join(', ')})`;
  }, [wheelCocktails, segmentAngle]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setSelectedCocktail(null);
    setShowConfetti(false);

    const randomIndex = Math.floor(Math.random() * wheelCocktails.length);
    const targetAngle = 360 * 5 + (360 - randomIndex * segmentAngle - segmentAngle / 2);
    const newRotation = rotation + targetAngle;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedCocktail(wheelCocktails[randomIndex]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }, 3500);
  };

  return (
    <section id="surprise-me" className="section">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Surprise Me</h2>
        <p className="section-subtitle">
          Can't decide? Let the wheel of fate choose your next drink.
        </p>
      </motion.div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Confetti show={showConfetti} />

          <div
            style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '20px solid #c084fc',
              zIndex: 5,
              filter: 'drop-shadow(0 2px 8px rgba(192,132,252,0.5))',
            }}
          />

          <motion.div
            animate={{ rotate: rotation }}
            transition={{
              type: 'spring',
              damping: 18,
              stiffness: 30,
              duration: 3.5,
            }}
            style={{
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: conicGradient,
              border: '3px solid rgba(255,255,255,0.15)',
              boxShadow: '0 0 40px rgba(192,132,252,0.15), inset 0 0 30px rgba(0,0,0,0.3)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(20, 18, 40, 0.95)',
                border: '2px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              🎲
            </div>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '16px 40px',
            borderRadius: '50px',
            background: spinning
              ? 'rgba(255,255,255,0.06)'
              : 'linear-gradient(135deg, rgba(255,107,157,0.25), rgba(192,132,252,0.25))',
            border: `1px solid ${spinning ? 'rgba(255,255,255,0.08)' : 'rgba(255,107,157,0.3)'}`,
            color: spinning ? 'rgba(240,230,255,0.4)' : '#f0e6ff',
            fontSize: '18px',
            fontWeight: 600,
            cursor: spinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {spinning ? 'Spinning...' : 'Spin the Wheel'}
        </motion.button>

        <AnimatePresence>
          {selectedCocktail && !spinning && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              style={{ width: '100%', maxWidth: '340px' }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(240,230,255,0.5)',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                The wheel has spoken:
              </p>
              <RecipeCard
                cocktail={selectedCocktail}
                onClick={() => setModalCocktail(selectedCocktail)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RecipeModal cocktail={modalCocktail} onClose={() => setModalCocktail(null)} />
    </section>
  );
}
