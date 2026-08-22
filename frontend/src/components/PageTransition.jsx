import { motion } from 'framer-motion'

/**
 * PageTransition — wraps each route's content in a luxurious fade + lift animation.
 * Drop-in: just wrap any page component's root element with this.
 *
 * Usage:  <PageTransition><YourPage /></PageTransition>
 *
 * Alternatively, use the exported `pageVariants` / `pageTransition` directly
 * on a <motion.div> inside your page for full control.
 */

export const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -10, filter: 'blur(3px)' },
}

export const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart
  duration: 0.38,
}

/** Stagger container — animate children with a cascade */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
}

/** Individual staggered child */
export const staggerChild = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 28 },
  },
}

/** Fade-up for sections */
export const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/** Scale-in for cards / modals */
export const scaleIn = {
  initial: { opacity: 0, scale: 0.93 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

/** Slide-in from right (for drawers / sidepanels) */
export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

/** Wrapper component (convenience) */
export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  )
}
