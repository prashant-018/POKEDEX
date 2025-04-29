import React, { useState } from 'react';
import styles from './PokemonCard.module.css';

function PokemonCard({ pokemon }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const paddedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Get the primary type for dynamic styling
  const primaryType = pokemon.types[0].type.name;

  return (
    <>
      {/* Card Component */}
      <div 
        className={`${styles.card} ${styles[primaryType]}`}
        onClick={toggleModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleModal();
          }
        }}
      >
        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.pokemonId}>{paddedId}</span>
            <h3 className={styles.pokemonName}>
              {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
            </h3>
          </div>
          
          <div className={styles.imageContainer}>
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || 
                  pokemon.sprites.front_default} 
              alt={pokemon.name}
              className={styles.pokemonImage}
              loading="lazy"
            />
          </div>

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
        </div>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={toggleModal}>×</button>
            
            <div className={styles.modalHeader}>
              <span className={styles.pokemonId}>{paddedId}</span>
              <h2 className={styles.pokemonName}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h2>
            </div>
            
            <div className={styles.imageContainer}>
              <img 
                src={pokemon.sprites.other['official-artwork'].front_default || 
                     pokemon.sprites.front_default} 
                alt={pokemon.name}
                className={styles.pokemonImage}
              />
            </div>
            
            <div className={styles.detailGrid}>
              <div className={styles.detailSection}>
                <h4 className={styles.sectionTitle}>Type</h4>
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
              </div>
              
              <div className={styles.detailSection}>
                <h4 className={styles.sectionTitle}>Physical</h4>
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Height</span>
                    <span className={styles.statValue}>{heightInMeters} m</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Weight</span>
                    <span className={styles.statValue}>{weightInKg} kg</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h4 className={styles.sectionTitle}>Abilities</h4>
                <div className={styles.abilitiesContainer}>
                  {pokemon.abilities.map((ability, index) => (
                    <span key={index} className={styles.ability}>
                      {ability.ability.name.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className={styles.detailSection}>
                <h4 className={styles.sectionTitle}>Stats</h4>
                <div className={styles.statsBars}>
                  {pokemon.stats.map((stat, index) => (
                    <div key={index} className={styles.statBarContainer}>
                      <span className={styles.statName}>
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <div className={styles.statBarBackground}>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PokemonCard;