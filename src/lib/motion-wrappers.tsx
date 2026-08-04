/**
 * Motion Wrapper Components
 * Reusable Framer Motion wrappers for consistent animations across the app
 */

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import {
  pageVariants,
  fadeUpVariants,
  cardHoverVariants,
  staggerContainer,
  staggerItemVariants,
} from "./motion-variants";

interface MotionWrapperProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
}

/**
 * Page wrapper with fade-up entrance animation
 */
export const PageMotion = ({ children, ...props }: MotionWrapperProps) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Section wrapper with fade-up animation
 */
export const FadeUpSection = ({ children, ...props }: MotionWrapperProps) => (
  <motion.div
    variants={fadeUpVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Card wrapper with hover lift effect
 */
export const CardMotion = ({ children, ...props }: MotionWrapperProps) => (
  <motion.div
    variants={cardHoverVariants}
    initial="rest"
    whileHover="hover"
    whileTap="tap"
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Stagger container for animated lists
 */
export const StaggerContainer = ({ children, ...props }: MotionWrapperProps) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="visible"
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * Stagger item for use within StaggerContainer
 */
export const StaggerItem = ({ children, ...props }: MotionWrapperProps) => (
  <motion.div
    variants={staggerItemVariants}
    {...props}
  >
    {children}
  </motion.div>
);
