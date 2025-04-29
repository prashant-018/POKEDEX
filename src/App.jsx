import React, { useState, useEffect } from 'react';
import PokemonList from './components/PokemonList';
import PokemonSearch from './components/PokemonSearch';
import LoadingOverlay from './components/LoadingOverlay';
import PokemonModal from './components/PokemonModal';
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [displayedPokemon, setDisplayedPokemon] = useState([]);
  const [allTypes, setAllTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentLimit, setCurrentLimit] = useState(150);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // ✅ this was in a wrong component

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon');
        const countData = await countResponse.json();
        setTotalCount(countData.count);

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${currentLimit}`);
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(pokemon =>
            fetch(pokemon.url).then(res => res.json())
          )
        );

        setPokemonData(pokemonDetails);
        setFilteredPokemon(pokemonDetails);
        setDisplayedPokemon(pokemonDetails.slice(0, currentLimit));

        const types = new Set();
        pokemonDetails.forEach(p => {
          p.types.forEach(t => types.add(t.type.name));
        });
        setAllTypes(['all', ...Array.from(types).sort()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentLimit]);

  const handleSearch = (searchTerm, selectedType) => {
    const filtered = pokemonData.filter(pokemon => {
      const matchesName = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' ||
        pokemon.types.some(t => t.type.name === selectedType);
      return matchesName && matchesType;
    });
    setFilteredPokemon(filtered);
    setDisplayedPokemon(filtered.slice(0, currentLimit));
  };

  const loadMore = async () => {
    if (displayedPokemon.length >= filteredPokemon.length) return;
    setIsLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const nextBatch = filteredPokemon.slice(
        displayedPokemon.length,
        displayedPokemon.length + 25
      );
      setDisplayedPokemon(prev => [...prev, ...nextBatch]);
      setCurrentLimit(prev => prev + 25);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="app">
      <LoadingOverlay isLoading={isLoading} />
      <h1 className="app-title">Pokédex</h1>

      {error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <PokemonSearch
            onSearch={handleSearch}
            allTypes={allTypes}
          />
          <PokemonList
            pokemons={displayedPokemon}
            loadMore={loadMore}
            hasMore={displayedPokemon.length < filteredPokemon.length}
            isLoadingMore={isLoadingMore}
            totalCount={totalCount}
            displayedCount={displayedPokemon.length}
            onCardClick={(pokemon) => setSelectedPokemon(pokemon)} // ✅ pass click handler
          />
        </>
      )}

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default App;
