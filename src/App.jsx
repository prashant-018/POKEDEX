import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonSearch from './components/PokemonSearch';
import LoadingOverlay from './components/LoadingOverlay';
import PokemonModal from './components/PokemonModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pokemonFavorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const INITIAL_LOAD = 150;
  const LOAD_MORE_COUNT = 25;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const countRes = await fetch('https://pokeapi.co/api/v2/pokemon');
        if (!countRes.ok) throw new Error('Failed to fetch Pokémon count');
        const countData = await countRes.json();

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${INITIAL_LOAD}`);
        if (!res.ok) throw new Error('Failed to fetch Pokémon list');
        const data = await res.json();

        const detailedData = await Promise.all(
          data.results.map(p =>
            fetch(p.url)
              .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch data for ${p.name}`);
                return res.json();
              })
          )
        );

        const enriched = detailedData.map(p => ({
          ...p,
          isFavorite: favorites.has(p.id),
        }));

        setPokemonData(enriched);
        setFilteredPokemon(enriched);
        setDisplayedPokemon(enriched.slice(0, LOAD_MORE_COUNT));

        // Extract all unique types
        const typesSet = new Set();
        enriched.forEach(p =>
          p.types.forEach(t => typesSet.add(t.type.name))
        );
        setAllTypes(['all', ...Array.from(typesSet).sort()]);
      } catch (err) {
        setError(err.message || 'Failed to fetch Pokémon data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (term, selectedType) => {
    const filtered = pokemonData.filter(p => {
      const matchesName = p.name.toLowerCase().includes(term.toLowerCase());
      const matchesType =
        selectedType === 'all' || p.types.some(t => t.type.name === selectedType);
      return matchesName && matchesType;
    });

    setFilteredPokemon(filtered);
    setDisplayedPokemon(filtered.slice(0, LOAD_MORE_COUNT));
  };

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

  const loadMore = async () => {
    if (displayedPokemon.length >= filteredPokemon.length) return;

    setIsLoadingMore(true);
    try {
      await new Promise(res => setTimeout(res, 500)); // simulate loading delay
      const nextBatch = filteredPokemon.slice(
        displayedPokemon.length,
        displayedPokemon.length + LOAD_MORE_COUNT
      );
      setDisplayedPokemon(prev => [...prev, ...nextBatch]);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <LoadingOverlay isLoading={isLoading} />
        <h1 className="app-title">Pokédex</h1>

       

        {error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <PokemonSearch onSearch={handleSearch} allTypes={allTypes} />
            <PokemonList
              pokemons={displayedPokemon}
              loadMore={loadMore}
              hasMore={displayedPokemon.length < filteredPokemon.length}
              isLoadingMore={isLoadingMore}
              totalCount={filteredPokemon.length}
              displayedCount={displayedPokemon.length}
              onCardClick={setSelectedPokemon}
              onFavoriteClick={toggleFavorite}
              favorites={favorites}
            />
          </>
        )}

        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
            onFavoriteToggle={toggleFavorite}
            isFavorite={favorites.has(selectedPokemon.id)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
