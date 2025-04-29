import React, { useState } from 'react';
import PokemonCard from './PokemonCard';
import styles from './PokemonList.module.css';

function PokemonList({ pokemons, onCardClick }) {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div className={styles.listContainer}>
      {pokemons.length > 0 ? (
        <div className={styles.grid}>
          {pokemons.slice(0, visibleCount).map((pokemon) => (
            <PokemonCard 
              key={pokemon.id} 
              pokemon={pokemon} 
              onClick={() => onCardClick && onCardClick(pokemon)} 
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h3>No Pokémon Found</h3>
          <p>Try adjusting your search or filter</p>
        </div>
      )}

      {visibleCount < pokemons.length && (
        <button className={styles.seeMoreButton} onClick={handleSeeMore}>
          See More
        </button>
      )}
    </div>
  );
}

export default PokemonList;
