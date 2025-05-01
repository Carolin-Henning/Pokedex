
const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100';

async function loadPokemon() {
  const response = await fetch(API_URL);
  const data = await response.json();

  const pokemons = data.results;
  for (const pokemon of pokemons) {
    const details = await fetchPokemonDetails(pokemon.url);
    renderPokemon(details);
  }
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

function renderPokemon(pokemon) {
  const pokedex = document.getElementById('pokedex');
  const types = pokemon.types.map(type => type.type.name);

  const typeIcons = types.map(type => `<span class="type ${type}">${type}</span>`).join('');

  const html = `
    <div class="pokemon-card">
      <span class="pokemon-id">#${pokemon.id}</span>
      <h2>${capitalize(pokemon.name)}</h2>
      <img class="pokemon-img" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
      <div class="types">${typeIcons}</div>
    </div>
  `;

  pokedex.innerHTML += html;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


