import { motion } from "framer-motion";
import "../Style/LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loader">
      <div className="loader__bg-glow" />

      <div className="loader__spinner">
        {/* Outer Ring */}
        <motion.div
          className="loader__ring loader__ring--outer"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* Middle Ring */}
        <motion.div
          className="loader__ring loader__ring--middle"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Dot */}
        <motion.div
          className="loader__dot"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.p
        className="loader__text"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading, please wait...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;