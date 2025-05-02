import React, { useState } from 'react';
import styles from './PokemonCompare.module.css'; // Optional CSS

function PokemonCompare({ pokemons = [] }) {
  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  const handleChange = (e, setter) => {
    const pokemon = pokemons.find(p => p.id === parseInt(e.target.value));
    setter(pokemon || null);
  };

  const getStatValue = (pokemon, index) =>
    pokemon?.stats?.[index]?.base_stat || '—';

  const getStatName = (stat) =>
    stat?.stat?.name?.replace('-', ' ').toUpperCase() || 'UNKNOWN';

  return (
    <div className={styles.compareContainer || ''}>
      <h2>Compare Pokémon Stats</h2>

      <div className={styles.selectors || ''}>
        <select onChange={(e) => handleChange(e, setSelected1)} defaultValue="">
          <option value="" disabled>Select Pokémon 1</option>
          {pokemons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </option>
          ))}
        </select>

        <select onChange={(e) => handleChange(e, setSelected2)} defaultValue="">
          <option value="" disabled>Select Pokémon 2</option>
          {pokemons.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {selected1 && selected2 && (
        <div className={styles.statsComparison || ''}>
          <table>
            <thead>
              <tr>
                <th>Stat</th>
                <th>{selected1.name}</th>
                <th>{selected2.name}</th>
              </tr>
            </thead>
            <tbody>
              {selected1.stats?.map((stat, index) => (
                <tr key={stat.stat.name}>
                  <td>{getStatName(stat)}</td>
                  <td>{getStatValue(selected1, index)}</td>
                  <td>{getStatValue(selected2, index)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PokemonCompare;
