import React, { useState, useEffect } from 'react';

const FavoritesPage = () => {
  const [favoritePokemon, setFavoritePokemon] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('pokemonFavorites');
    const favoriteIds = saved ? JSON.parse(saved) : [];

    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const data = await Promise.all(
          favoriteIds.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
          )
        );
        setFavoritePokemon(data);
      } catch (error) {
        console.error('Error fetching favorite Pokémon:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // Function to remove a Pokémon from favorites
  const handleRemove = (id) => {
    const updated = favoritePokemon.filter(p => p.id !== id);
    setFavoritePokemon(updated);
    const updatedIds = updated.map(p => p.id);
    localStorage.setItem('pokemonFavorites', JSON.stringify(updatedIds));
  };

  if (isLoading) return <p>Loading your favorites...</p>;

  if (favoritePokemon.length === 0) {
    return <p>No favorite Pokémon yet!</p>;
  }

  return (
    <div>
      <h2>My Favorite Pokémon</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {favoritePokemon.map(pokemon => (
          <li key={pokemon.id} style={{ marginBottom: '20px' }}>
            <strong>{pokemon.name}</strong> (#{pokemon.id})
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              width="80"
              style={{ marginLeft: '10px' }}
            />
            <br />
            <button onClick={() => handleRemove(pokemon.id)} style={{ marginTop: '5px' }}>
              Remove from Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
