import React from 'react';
import styles from './LoadingOverlay.module.css';

function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.pokeball}>
        <div className={styles.pokeballTop}></div>
        <div className={styles.pokeballCenter}>
          <div className={styles.pokeballButton}></div>
        </div>
        <div className={styles.pokeballBottom}></div>
      </div>
      <p className={styles.text}>Loading Pokémon...</p>
    </div>
  );
}

export default LoadingOverlay;