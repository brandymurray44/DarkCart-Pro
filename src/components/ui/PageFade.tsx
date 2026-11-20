import { motion } from 'framer-motion';

export const FadeIn = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
  >
    {children}
  </motion.div>
);


