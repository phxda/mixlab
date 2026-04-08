import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cocktails } from '../data/cocktails';
import type { Cocktail } from '../types';
import RecipeModal from './RecipeModal';

const WHEEL_SIZE = 380;
const NUM_SEGMENTS = 16;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2;
const LABEL_RADIUS = RADIUS * 0.68;

function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 700,
        y: -(80 + Math.random() * 400),
        rotate: Math.random() * 900,
        color: ['#ff6b9d', '#c084fc', '#22d3ee', '#fbbf24', '#4ade80', '#f97316'][Math.floor(Math.random() * 6)],
        size: 5 + Math.random() * 9,
        delay: Math.random() * 0.5,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {show &&
        pieces.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
            animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rotate, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: p.size,
              height: p.size,
              borderRadius: p.size > 10 ? '2px' : '50%',
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
  const [history, setHistory] = useState<Cocktail[]>([]);
  const rotationRef = useRef(0);

  const wheelCocktails = useMemo(() => {
    const shuffled = [...cocktails].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, NUM_SEGMENTS);
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
    const spins = 6 + Math.floor(Math.random() * 4);
    const targetAngle = 360 * spins + (360 - randomIndex * segmentAngle - segmentAngle / 2);
    const newRotation = rotationRef.current + targetAngle;
    rotationRef.current = newRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      const picked = wheelCocktails[randomIndex];
      setSelectedCocktail(picked);
      setShowConfetti(true);
      setHistory((prev) => [picked, ...prev].slice(0, 3));
      setTimeout(() => setShowConfetti(false), 2000);
    }, 3800);
  };

  // Segment divider lines + emoji labels as SVG overlay
  const svgOverlay = (
    <svg
      width={WHEEL_SIZE}
      height={WHEEL_SIZE}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {wheelCocktails.map((c, i) => {
        const angle = (i * segmentAngle - 90) * (Math.PI / 180);
        const x2 = CENTER + RADIUS * Math.cos(angle);
        const y2 = CENTER + RADIUS * Math.sin(angle);
        const labelAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
        const lx = CENTER + LABEL_RADIUS * Math.cos(labelAngle);
        const ly = CENTER + LABEL_RADIUS * Math.sin(labelAngle);
        const textRotation = (i + 0.5) * segmentAngle;

        return (
          <g key={i}>
            <line
              x1={CENTER} y1={CENTER}
              x2={x2} y2={y2}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="1.5"
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              transform={`rotate(${textRotation}, ${lx}, ${ly})`}
              style={{ userSelect: 'none' }}
            >
              {c.imageEmoji}
            </text>
          </g>
        );
      })}
      {/* outer ring */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS - 2} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
      {/* inner ring */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.12} fill="rgba(10,10,26,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="middle" fontSize="16">🎲</text>
    </svg>
  );

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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px', position: 'relative' }}>

        {/* Wheel + pointer */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Confetti show={showConfetti} />

          {/* Pointer */}
          <motion.div
            animate={spinning ? { scale: [1, 1.15, 1], filter: ['drop-shadow(0 2px 8px rgba(192,132,252,0.5))', 'drop-shadow(0 2px 18px rgba(192,132,252,0.9))', 'drop-shadow(0 2px 8px rgba(192,132,252,0.5))'] } : {}}
            transition={{ duration: 0.4, repeat: spinning ? Infinity : 0 }}
            style={{
              position: 'relative',
              zIndex: 5,
              marginBottom: '-4px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon
                points="14,2 26,26 14,20 2,26"
                fill="#c084fc"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          {/* Wheel glow backdrop */}
          <motion.div
            animate={spinning
              ? { opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1] }
              : { opacity: 0.2, scale: 1 }}
            transition={{ duration: 0.7, repeat: spinning ? Infinity : 0 }}
            style={{
              position: 'absolute',
              top: '28px',
              width: WHEEL_SIZE + 40,
              height: WHEEL_SIZE + 40,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(192,132,252,0.35) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* The wheel */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', damping: 20, stiffness: 28, duration: 3.8 }}
              style={{
                width: WHEEL_SIZE,
                height: WHEEL_SIZE,
                borderRadius: '50%',
                background: conicGradient,
                position: 'relative',
                boxShadow: '0 0 60px rgba(192,132,252,0.12), inset 0 0 40px rgba(0,0,0,0.4)',
              }}
            />
            {/* SVG overlay rotates with the wheel */}
            <motion.div
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', damping: 20, stiffness: 28, duration: 3.8 }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {svgOverlay}
            </motion.div>
          </div>
        </div>

        {/* Spin button */}
        <motion.button
          whileHover={!spinning ? { scale: 1.05, y: -2 } : {}}
          whileTap={!spinning ? { scale: 0.96 } : {}}
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '16px 48px',
            borderRadius: '50px',
            background: spinning
              ? 'rgba(255,255,255,0.05)'
              : 'linear-gradient(135deg, rgba(255,107,157,0.25), rgba(192,132,252,0.3))',
            border: `1px solid ${spinning ? 'rgba(255,255,255,0.08)' : 'rgba(192,132,252,0.45)'}`,
            color: spinning ? 'rgba(240,230,255,0.35)' : '#f0e6ff',
            fontSize: '18px',
            fontWeight: 700,
            cursor: spinning ? 'not-allowed' : 'pointer',
            letterSpacing: '0.3px',
            fontFamily: 'Space Grotesk, sans-serif',
            transition: 'all 0.3s',
            boxShadow: spinning ? 'none' : '0 0 24px rgba(192,132,252,0.15)',
          }}
        >
          {spinning ? '✨ Spinning...' : '🎰 Spin the Wheel'}
        </motion.button>

        {/* Result */}
        <AnimatePresence mode="wait">
          {selectedCocktail && !spinning && (
            <motion.div
              key={selectedCocktail.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}
            >
              <p style={{ fontSize: '13px', color: 'rgba(240,230,255,0.4)', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
                The wheel has spoken
              </p>

              <button
                onClick={() => setModalCocktail(selectedCocktail)}
                style={{
                  width: '100%',
                  padding: '24px',
                  background: `${selectedCocktail.color}14`,
                  border: `1px solid ${selectedCocktail.color}50`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${selectedCocktail.color}22`; e.currentTarget.style.borderColor = `${selectedCocktail.color}80`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${selectedCocktail.color}14`; e.currentTarget.style.borderColor = `${selectedCocktail.color}50`; }}
              >
                <div style={{ fontSize: '52px', marginBottom: '10px' }}>{selectedCocktail.imageEmoji}</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#f0e6ff', marginBottom: '6px' }}>{selectedCocktail.name}</div>
                <div style={{ fontSize: '13px', color: 'rgba(240,230,255,0.5)', lineHeight: 1.5, marginBottom: '12px' }}>{selectedCocktail.description}</div>
                <div style={{ fontSize: '12px', color: 'rgba(240,230,255,0.3)' }}>Tap to see full recipe →</div>
              </button>

              <button
                onClick={spin}
                style={{
                  padding: '10px 28px',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(240,230,255,0.5)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#f0e6ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(240,230,255,0.5)'; }}
              >
                Spin Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <AnimatePresence>
          {history.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <p style={{ fontSize: '11px', color: 'rgba(240,230,255,0.25)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '10px', textAlign: 'center' }}>
                Previous spins
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {history.slice(1).map((c, i) => (
                  <button
                    key={`${c.id}-${i}`}
                    onClick={() => setModalCocktail(c)}
                    title={c.name}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    <span style={{ fontSize: '16px' }}>{c.imageEmoji}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(240,230,255,0.45)', fontWeight: 500 }}>{c.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RecipeModal
        cocktail={modalCocktail}
        onClose={() => setModalCocktail(null)}
        allCocktails={cocktails}
        onSelectCocktail={setModalCocktail}
      />
    </section>
  );
}
