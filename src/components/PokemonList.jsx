import React, { useState, useMemo } from 'react';
import PokemonCard from './PokemonCard';
import styles from './PokemonList.module.css';

function PokemonList({ pokemons, onCardClick }) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('pokemon-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [compareList, setCompareList] = useState([]); // ✅ Compare list

  // Filtered Pokemons (Favorites or All)
  const filteredPokemons = useMemo(() => {
    return showFavorites
      ? pokemons.filter((p) => favorites.includes(p.id))
      : pokemons;
  }, [pokemons, favorites, showFavorites]);

  // Sort Pokemons
  const sortedPokemons = useMemo(() => {
    const sorted = [...filteredPokemons];
    sorted.sort((a, b) => {
      if (sortBy === 'id') {
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      } else {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });
    return sorted;
  }, [filteredPokemons, sortBy, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedPokemons.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPokemons = sortedPokemons.slice(startIndex, startIndex + pageSize);

  // Favorite Toggle
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];
      localStorage.setItem('pokemon-favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Compare Toggle
  const toggleCompare = (id) => {
    setCompareList((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // Compare Action
  const handleCompare = () => {
    if (compareList.length < 2) {
      alert("Select at least two Pokémon to compare.");
      return;
    }
    const selected = pokemons.filter((p) => compareList.includes(p.id));
    alert(`Comparing:\n\n${selected.map(p => `${p.name} (ID: ${p.id})`).join('\n')}`);
  };

  // Pagination Handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  const toggleShowFavorites = () => {
    setShowFavorites((prev) => !prev);
    setCurrentPage(1);
  };

  return (
    <div className={styles.listContainer}>
      {/* Top Controls */}
      <div className={styles.controls}>
        {/* Favorites Toggle */}
        <div className={styles.favoriteFilter}>
          <button
            onClick={toggleShowFavorites}
            className={`${styles.favoriteFilterButton} ${showFavorites ? styles.active : ''}`}
          >
            {showFavorites ? '★ Showing Favorites' : '☆ Show Favorites'}
            <span className={styles.favoriteCount}>({favorites.length})</span>
          </button>
        </div>

        {/* Sorting */}
        <div className={styles.sortControl}>
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
          <button onClick={toggleSortOrder} className={styles.sortOrderButton}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Page Size */}
        <div className={styles.pageSizeControl}>
          <label htmlFor="page-size">Items per page:</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        {/* Compare Button */}
        <div className={styles.compareControl}>
          <button className={styles.compareButton} onClick={handleCompare}>
            🔍 Compare ({compareList.length})
          </button>
        </div>
      </div>

      {/* Pokémon Grid */}
      {currentPokemons.length > 0 ? (
        <div className={styles.grid}>
          {currentPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => onCardClick(pokemon)}
              isFavorite={favorites.includes(pokemon.id)}
              onFavoriteToggle={() => toggleFavorite(pokemon.id)}
              isCompared={compareList.includes(pokemon.id)}
              onCompareToggle={() => toggleCompare(pokemon.id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔍</div>
          <h3>No Pokémon Found</h3>
          <p>{showFavorites ? 'You have no favorite Pokémon yet!' : 'Try adjusting your filters.'}</p>
          {showFavorites && (
            <button onClick={() => setShowFavorites(false)} className={styles.showAllButton}>
              Show All Pokémon
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`${styles.pageButton} ${currentPage === pageNum ? styles.active : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className={styles.pageEllipsis}>...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={styles.pageButton}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PokemonList;
