import { useState, useEffect } from 'react';

const useFavorites = () => {
  // Load from localStorage initially
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (pokemon) => {
    if (!favorites.includes(pokemon)) {
      setFavorites([...favorites, pokemon]);
    }
  };

  const removeFavorite = (pokemon) => {
    setFavorites(favorites.filter((fav) => fav !== pokemon));
  };

  const isFavorite = (pokemon) => favorites.includes(pokemon);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};

export default useFavorites;
