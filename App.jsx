import React, { useState } from 'react';
import './App.css';

const typeColors = {
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  normal: '#A8A878',
};

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    const queries = query.split(',').map(q => q.trim()).filter(q => q);
    if (queries.length === 0) return;

    try {
      const requests = queries.map(q =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${q.toLowerCase()}`).then(res => res.json())
      );
      const results = await Promise.all(requests);
      setPokemonList(results);
      setError(null);
    } catch (err) {
      setPokemonList([]);
      setError('Pokémon no encontrado');
    }
  };

  const handleClose = (id) => {
    setPokemonList(pokemonList.filter(pokemon => pokemon.id !== id));
  };

  return (
    <div className="buscador">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar Pokémon (separados por coma)..."
        className="buscador-input"
      />
      <button onClick={handleSearch} className="buscador-button">
        Buscar
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="pokemon-list">
        {pokemonList.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <button className="close-button" onClick={() => handleClose(pokemon.id)}>X</button>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
              alt={pokemon.name}
              className="pokemon-image"
            />
            <div className="pokemon-details">
              <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>

              {/* Aquí agregamos los tipos */}
              <div className="pokemon-types">
                {pokemon.types.map((typeInfo, index) => {
                  const typeName = typeInfo.type.name;
                  const typeColor = typeColors[typeName];
                  return (
                    <span
                      key={index}
                      className="pokemon-type"
                      style={{ backgroundColor: typeColor }}
                    >
                      {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
                    </span>
                  );
                })}
              </div>

              <div className="pokemon-stats">
                {pokemon.stats.map((stat, index) => (
                  <div key={index} className="stat">
                    <span className="stat-name">{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</span>
                    <div className="stat-bar">
                      <div className="stat-bar-inner" style={{ width: `${stat.base_stat}%` }}>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buscador;
