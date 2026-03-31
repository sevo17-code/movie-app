import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import "./TrailerModal.css";

function TrailerModal({ open, youtubeKey, title, onClose }) {
  const MotionDiv = motion.div;

  useEffect(() => {
    if (!open) return undefined;

    const onEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          className="trailer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <MotionDiv
            className="trailer-modal__panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trailer-modal__head">
              <h3>{title} Trailer</h3>
              <button onClick={onClose}>Close</button>
            </div>
            <div className="trailer-frame-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
                title={`${title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

export default TrailerModal;
