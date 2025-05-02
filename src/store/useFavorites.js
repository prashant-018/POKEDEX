import { createContext, useContext, useState, useEffect } from 'react';

// Creating the context
export const FavoritesContext = createContext();

// Custom hook to access favorites context
export const useFavorites = () => useContext(FavoritesContext);

// FavoritesProvider to wrap your app
export const FavoritesProvider = ({ children }) => {
  // Initialize favorites state from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemon-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync favorites state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemon-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle function to add or remove a pokemon from favorites
  const toggleFavorite = (pokemonId) => {
    setFavorites(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
