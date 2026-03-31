import { motion } from "framer-motion";

function PageTransition({ children }) {
  const MotionSection = motion.section;

  return (
    <MotionSection
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </MotionSection>
  );
}

export default PageTransition;
