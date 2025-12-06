/**
 * Animation utilities using Framer Motion
 * Consistent animation variants for the entire application
 */

import { Variants } from 'framer-motion';

/**
 * Page transition animations
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
};

/**
 * Stagger children animation for lists
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

/**
 * Hover lift effect for cards
 */
export const hoverLift = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

/**
 * Scale effect for interactive elements
 */
export const scaleOnHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: 'easeOut' }
  }
};

/**
 * Fade in animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

/**
 * Slide in from side animations
 */
export const slideInFromLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const slideInFromRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

/**
 * Modal animations
 */
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15, ease: 'easeIn' }
  }
};

/**
 * Dropdown menu animations
 */
export const dropdownMenu: Variants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.1, ease: 'easeIn' }
  }
};

/**
 * Tooltip animations
 */
export const tooltipAnimation: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.1, ease: 'easeIn' }
  }
};

/**
 * Button press animation
 */
export const buttonPress = {
  rest: { scale: 1 },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1, ease: 'easeInOut' }
  }
};

/**
 * Checkbox check animation
 */
export const checkboxCheck: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

/**
 * Tab underline animation
 */
export const tabUnderline = {
  initial: { width: 0, opacity: 0 },
  animate: {
    width: '100%',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

/**
 * Skeleton loading pulse
 */
export const skeletonPulse: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Notification slide in from top
 */
export const notificationSlideIn: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

/**
 * Collapse/Expand animation
 */
export const collapse: Variants = {
  collapsed: { height: 0, opacity: 0, overflow: 'hidden' },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};
