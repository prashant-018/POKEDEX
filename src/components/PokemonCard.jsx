import React, { useState } from 'react';
import styles from './PokemonCard.module.css';
import { FaHeart, FaRegHeart, FaBalanceScale } from 'react-icons/fa';

function PokemonCard({
  pokemon,
  onFavoriteToggle,
  isFavorite,
  isCompared = false,
  onCompareToggle = () => {},
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const paddedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  const heightInMeters = (pokemon.height / 10).toFixed(1);
  const weightInKg = (pokemon.weight / 10).toFixed(1);
  const primaryType = pokemon.types[0].type.name;

  const toggleModal = (e) => {
    if (
      e.target.closest(`.${styles.favoriteButton}`) ||
      e.target.closest(`.${styles.compareButton}`)
    )
      return;
    setIsModalOpen((prev) => !prev);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle(pokemon.id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onCompareToggle(pokemon.id);
  };

  const pokemonImage =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  const formattedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      {/* Card */}
      <div
        className={`${styles.card} ${styles[primaryType]} ${
          isCompared ? styles.compared : ''
        }`}
        onClick={toggleModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') toggleModal();
        }}
      >
        <div className={styles.topButtons}>
          <button
            className={`${styles.favoriteButton} ${
              isFavorite ? styles.favorited : ''
            }`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>

          <button
            className={`${styles.compareButton} ${
              isCompared ? styles.comparing : ''
            }`}
            onClick={handleCompareClick}
            aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            <FaBalanceScale />
          </button>
        </div>

        <div className={styles.cardInner}>
          <div className={styles.cardHeader}>
            <span className={styles.pokemonId}>{paddedId}</span>
            <h3 className={styles.pokemonName}>{formattedName}</h3>
          </div>

          <div className={styles.imageContainer}>
            <img
              src={pokemonImage}
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

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={toggleModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={toggleModal}
              aria-label="Close"
              tabIndex={0}
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <span className={styles.pokemonId}>{paddedId}</span>
              <h2 className={styles.pokemonName}>{formattedName}</h2>

              <button
                className={`${styles.modalFavoriteButton} ${
                  isFavorite ? styles.favorited : ''
                }`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>
            </div>

            <div className={styles.imageContainer}>
              <img
                src={pokemonImage}
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
                      {ability.ability.name.replace(/-/g, ' ')}
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
                        {stat.stat.name.replace(/-/g, ' ')}
                      </span>
                      <div className={styles.statBarBackground}>
                        <div
                          className={styles.statBar}
                          style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
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
