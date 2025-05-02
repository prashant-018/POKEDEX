import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './PokemonModal.module.css';

function PokemonModal({ pokemon, onClose, isFavorite, toggleFavorite }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (pokemon) {
      fetchEvolutionChain(pokemon.species.url);
    }
  }, [pokemon]);

  const fetchEvolutionChain = async (speciesUrl) => {
    setIsLoading(true);
    try {
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();
      
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();
      
      setEvolutionChain(evolutionData.chain);
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!pokemon) return null;

  const paddedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const renderEvolutionChain = (chain) => {
    if (!chain) return <p>Loading evolution data...</p>;
    
    const evolutions = [];
    let current = chain;
    
    while (current) {
      const pokemonId = current.species.url.split('/').slice(-2, -1)[0];
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
      
      evolutions.push(
        <div key={current.species.name} className={styles.evolutionItem}>
          <img 
            src={imageUrl} 
            alt={current.species.name} 
            className={styles.evolutionImage}
          />
          <p className={styles.evolutionName}>
            {current.species.name.charAt(0).toUpperCase() + current.species.name.slice(1)}
          </p>
        </div>
      );
      
      if (current.evolves_to.length > 0) {
        evolutions.push(
          <div key={`arrow-${current.species.name}`} className={styles.evolutionArrow}>
            →
          </div>
        );
        current = current.evolves_to[0];
      } else {
        current = null;
      }
    }
    
    return <div className={styles.evolutionChain}>{evolutions}</div>;
  };

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
          <button 
            className={styles.favoriteButton}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <FaHeart className={styles.favoriteIcon} />
            ) : (
              <FaRegHeart className={styles.favoriteIcon} />
            )}
          </button>
        </div>
        
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'stats' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'moves' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            Moves
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'evolution' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            Evolution
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.imageContainer}>
            <img 
              src={pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default} 
              alt={pokemon.name}
              className={styles.pokemonImage}
            />
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
          </div>
          
          <div className={styles.detailsContainer}>
            {activeTab === 'stats' && (
              <>
                <div className={styles.statsContainer}>
                  <h3>Base Stats</h3>
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
                
                <div className={styles.abilitiesContainer}>
                  <h3>Abilities</h3>
                  <div className={styles.abilitiesList}>
                    {pokemon.abilities.map((ability, index) => (
                      <div key={index} className={styles.abilityItem}>
                        <span className={styles.abilityName}>
                          {ability.ability.name.replace(/-/g, ' ')}
                        </span>
                        {ability.is_hidden && (
                          <span className={styles.hiddenAbility}>(Hidden Ability)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'moves' && (
              <div className={styles.movesContainer}>
                <h3>Moves ({pokemon.moves.length})</h3>
                <div className={styles.movesList}>
                  {pokemon.moves.map((move, index) => (
                    <span key={index} className={styles.move}>
                      {move.move.name.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'evolution' && (
              <div className={styles.evolutionContainer}>
                <h3>Evolution Chain</h3>
                {isLoading ? (
                  <p>Loading evolution chain...</p>
                ) : (
                  renderEvolutionChain(evolutionChain)
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;