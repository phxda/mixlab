import { motion } from 'framer-motion';
import type { Vibe } from '../types';

interface VibeFilterProps {
  selected: Vibe[];
  onChange: (vibes: Vibe[]) => void;
}

const allVibes: { vibe: Vibe; label: string; color: string }[] = [
  { vibe: 'party', label: 'Party', color: '#ff6b9d' },
  { vibe: 'chill', label: 'Chill', color: '#22d3ee' },
  { vibe: 'date-night', label: 'Date Night', color: '#c084fc' },
  { vibe: 'brunch', label: 'Brunch', color: '#fbbf24' },
  { vibe: 'tiki', label: 'Tiki', color: '#4ade80' },
  { vibe: 'classic', label: 'Classic', color: '#f97316' },
];

export default function VibeFilter({ selected, onChange }: VibeFilterProps) {
  const toggle = (vibe: Vibe) => {
    if (selected.includes(vibe)) {
      onChange(selected.filter((v) => v !== vibe));
    } else {
      onChange([...selected, vibe]);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      {allVibes.map(({ vibe, label, color }) => {
        const isActive = selected.includes(vibe);
        return (
          <motion.button
            key={vibe}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(vibe)}
            style={{
              padding: '8px 16px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: 600,
              border: `1px solid ${isActive ? color : 'rgba(255,255,255,0.1)'}`,
              background: isActive ? `${color}20` : 'rgba(255,255,255,0.04)',
              color: isActive ? color : 'rgba(240,230,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
