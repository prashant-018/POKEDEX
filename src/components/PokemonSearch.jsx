import React, { useState } from 'react';
import styles from './PokemonSearch.module.css';

function PokemonSearch({ onSearch, allTypes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value, selectedType);
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    onSearch(searchTerm, type);
  };

  // Generate particles for the background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    left: Math.random() * 100
  }));

  return (
    <div className={`${styles.searchContainer} ${isFocused ? styles.focused : ''}`}>
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChange={handleInputChange}
        className={styles.searchInput}
        aria-label="Search Pokémon by name"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      <select
        value={selectedType}
        onChange={handleTypeChange}
        className={styles.typeSelect}
        aria-label="Filter by Pokémon type"
      >
        {allTypes.map(type => (
          <option key={type} value={type}>
            {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Floating particles */}
      <div className={styles.searchParticles}>
        {particles.map(particle => (
          <div 
            key={particle.id}
            className={styles.searchParticle}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default PokemonSearch;