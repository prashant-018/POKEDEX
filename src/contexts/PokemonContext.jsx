// src/contexts/PokemonContext.jsx
import React, { createContext, useState } from 'react';

export const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemonFavorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(pokemonId)) {
        updated.delete(pokemonId);
      } else {
        updated.add(pokemonId);
      }
      localStorage.setItem('pokemonFavorites', JSON.stringify([...updated]));
      return updated;
    });
  };

  return (
    <PokemonContext.Provider
      value={{ pokemonData, setPokemonData, favorites, toggleFavorite }}
    >
      {children}
    </PokemonContext.Provider>
  );
};
