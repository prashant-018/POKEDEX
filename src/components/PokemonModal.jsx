import React from 'react';
import { useEffect } from 'react';
import styles from './PokemonModal.module.css';

function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  const paddedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);
  

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <div className={styles.modalHeader}>
          <span className={styles.pokemonId}>{paddedId}</span>
          <h2 className={styles.pokemonName}>
            {pokemon.name.toUpperCase()}
          </h2>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.imageContainer}>
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default} 
              alt={pokemon.name}
              className={styles.pokemonImage}
            />
          </div>
          
          <div className={styles.detailsContainer}>
            <div className={styles.typeContainer}>
              {pokemon.types.map((type, index) => (
                <span 
                  key={index} 
                  className={`${styles.typeBadge} ${styles[type.type.name]}`}
                >
                  {type.type.name.toUpperCase()}
                </span>
              ))}
            </div>
            
            <div className={styles.statsContainer}>
              <h3>Stats</h3>
              <div className={styles.statsGrid}>
                {pokemon.stats.map((stat, index) => (
                  <div key={index} className={styles.statItem}>
                    <span className={styles.statName}>
                      {stat.stat.name.toUpperCase()}
                    </span>
                    <div className={styles.statBarContainer}>
                      <div 
                        className={styles.statBar}
                        style={{ width: `${Math.min(100, stat.base_stat)}%` }}
                      ></div>
                      <span className={styles.statValue}>{stat.base_stat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.physicalStats}>
              <div className={styles.physicalStat}>
                <span className={styles.statLabel}>Height</span>
                <span className={styles.statValue}>{heightInMeters} m</span>
              </div>
              <div className={styles.physicalStat}>
                <span className={styles.statLabel}>Weight</span>
                <span className={styles.statValue}>{weightInKg} kg</span>
              </div>
            </div>
            
            {pokemon.abilities && (
              <div className={styles.abilitiesContainer}>
                <h3>Abilities</h3>
                <div className={styles.abilitiesList}>
                  {pokemon.abilities.map((ability, index) => (
                    <span key={index} className={styles.ability}>
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;