import { useState, useEffect } from 'react';

// A custom hook for triggering animations on state change
export const useAnimation = (dependency) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // We check if dependency is not the initial value to avoid animating on load.
    // Adjust this condition if your initial state isn't 0.
    if (dependency !== 0) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 300); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [dependency]);

  return animating;
};