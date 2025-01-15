import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@material-tailwind/react";

const AnimatedButton = ({ children, isLoading, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className="w-full"
    >
      <Button
        variant="gradient"
        fullWidth
        color="blue"
        className={`
          relative overflow-hidden 
          transition-all duration-300 
          transform hover:shadow-lg
          ${isLoading ? 'opacity-90' : ''}
        `}
        {...props}
      >
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 0.8 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            children
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;