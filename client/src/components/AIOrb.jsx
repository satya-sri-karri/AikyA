import { motion } from "framer-motion";

/* AIKYA AI orb — a liquid-glass holographic sphere built with layered CSS
   gradients + blur. No heavy 3D dependency: it stays buttery on any device. */
export default function AIOrb({ size = 168 }) {
  return (
    <motion.div
      className="orb-wrap"
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="orb-ring" />
      <span className="orb-ring r2" />
      <span className="orb">
        <span className="orb-gloss" />
      </span>
    </motion.div>
  );
}