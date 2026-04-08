import { motion } from 'framer-motion';

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  size: 4 + Math.random() * 20,
  duration: 8 + Math.random() * 12,
  delay: Math.random() * 5,
  opacity: 0.03 + Math.random() * 0.08,
}));

export default function Hero() {
  return (
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
          animate={{
            y: [0, -(window.innerHeight + 100)],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
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
          style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: 'rgba(240, 230, 255, 0.6)',
            maxWidth: '500px',
            lineHeight: 1.6,
          }}
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
          style={{ marginTop: '40px' }}
        >
          <a
            href="#search"
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,107,157,0.3), rgba(192,132,252,0.3))';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,107,157,0.2), rgba(192,132,252,0.2))';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Mixing
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: '40px',
          color: 'rgba(240,230,255,0.3)',
          fontSize: '24px',
        }}
      >
        &#8595;
      </motion.div>
    </section>
  );
}
