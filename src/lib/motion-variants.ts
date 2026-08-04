/**
 * Motion Variants Library
 * Reusable Framer Motion animation variants for consistent micro-interactions
 * Respects prefers-reduced-motion for accessibility
 */

import { Variants } from "framer-motion";

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

/**
 * Page-level animations
 * Soft fade + slight upward slide on enter
 */
export const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 8,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : -8,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeIn",
        },
    },
};

/**
 * Fade up animation for sections
 * Subtle upward movement on appear
 */
export const fadeUpVariants: Variants = {
    hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 12,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.4,
            ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
        },
    },
};

/**
 * Card hover lift effect
 * Slight elevation + shadow increase
 */
export const cardHoverVariants: Variants = {
    rest: {
        scale: 1,
        y: 0,
    },
    hover: {
        scale: prefersReducedMotion ? 1 : 1.01,
        y: prefersReducedMotion ? 0 : -2,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
    tap: {
        scale: prefersReducedMotion ? 1 : 0.99,
        y: 0,
        transition: {
            duration: 0.1,
            ease: "easeOut",
        },
    },
};

/**
 * Button interaction variants
 * Smooth scale on hover + press feedback on tap
 */
export const buttonVariants: Variants = {
    rest: {
        scale: 1,
    },
    hover: {
        scale: prefersReducedMotion ? 1 : 1.02,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
    tap: {
        scale: prefersReducedMotion ? 1 : 0.98,
        transition: {
            duration: 0.1,
            ease: "easeIn",
        },
    },
};

/**
 * Stagger container for list animations
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: prefersReducedMotion ? 0 : 0.08,
            delayChildren: prefersReducedMotion ? 0 : 0.1,
        },
    },
};

/**
 * Stagger children items
 */
export const staggerItemVariants: Variants = {
    hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 8,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.3,
            ease: "easeOut",
        },
    },
};

/**
 * Chevron slide animation
 * Subtle right movement on hover for list items
 */
export const chevronSlideVariants: Variants = {
    rest: {
        x: 0,
    },
    hover: {
        x: prefersReducedMotion ? 0 : 4,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
};

/**
 * Scale fade animation
 * Smooth appearance for modals/popovers
 */
export const scaleFadeVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.2,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: prefersReducedMotion ? 1 : 0.95,
        transition: {
            duration: prefersReducedMotion ? 0 : 0.15,
            ease: "easeIn",
        },
    },
};

/**
 * Backdrop fade animation
 */
export const backdropVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        },
    },
};

/**
 * Shimmer loading animation
 */
export const shimmerVariants: Variants = {
    shimmer: {
        backgroundPosition: ["200% 0", "-200% 0"],
        transition: {
            duration: 2,
            ease: "linear",
            repeat: Infinity,
        },
    },
};
