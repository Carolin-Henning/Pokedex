
const typeIcons = {
    normal: "https://veekun.com/dex/media/types/en/normal.png",
    fire: "https://veekun.com/dex/media/types/en/fire.png",
    water: "https://veekun.com/dex/media/types/en/water.png",
    electric: "https://veekun.com/dex/media/types/en/electric.png",
    grass: "https://veekun.com/dex/media/types/en/grass.png",
    ice: "https://veekun.com/dex/media/types/en/ice.png",
    fighting: "https://veekun.com/dex/media/types/en/fighting.png",
    poison: "https://veekun.com/dex/media/types/en/poison.png",
    ground: "https://veekun.com/dex/media/types/en/ground.png",
    flying: "https://veekun.com/dex/media/types/en/flying.png",
    psychic: "https://veekun.com/dex/media/types/en/psychic.png",
    bug: "https://veekun.com/dex/media/types/en/bug.png",
    rock: "https://veekun.com/dex/media/types/en/rock.png",
    ghost: "https://veekun.com/dex/media/types/en/ghost.png",
    dragon: "https://veekun.com/dex/media/types/en/dragon.png",
    dark: "https://veekun.com/dex/media/types/en/dark.png",
    steel: "https://veekun.com/dex/media/types/en/steel.png",
    fairy: "https://veekun.com/dex/media/types/en/fairy.png"
  };
  
  let offset = 0;
  const limit = 20;
  let isLoading = false;
  

  async function loadPokemon() {
    if (isLoading) return;
  
    isLoading = true;
    toggleLoading(true);
  
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
  
    for (const pokemon of data.results) {
      const details = await fetchPokemonDetails(pokemon.url);
      renderPokemon(details);
    }
  
    offset += limit;
    isLoading = false;
    toggleLoading(false);
  }
  
  async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
  }
  
  function renderPokemon(pokemon) {
  const pokedex = document.getElementById('pokedex');
  const types = pokemon.types.map(t => t.type.name);
  const mainType = types[0];  // Haupttyp wird verwendet, um den Hintergrund zu setzen

  // Dynamische Hintergrundfarbe basierend auf dem Haupttyp
  const backgroundColor = typeIcons[mainType] ? typeIcons[mainType] : '#444'; // Fallback-Farbe

  const typeHTML = types.map(type => `
    <span class="type-badge ${type}">
      <img src="${typeIcons[type] || 'img/fallback.png'}" alt="${type}" class="type-icon" />
    </span>
  `).join('');

  const html = `
    <div class="pokemon-list-card ${mainType}" onclick="showPokemonDetails(${pokemon.id})">
      <div class="pokemon-info" style="background-color: ${backgroundColor};">
        <h3>#${pokemon.id} ${capitalize(pokemon.name)}</h3>
      </div>
      <img class="pokemon-img-small" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" />
      <div class="types">${typeHTML}</div>
    </div>
  `;

  pokedex.innerHTML += html;
}
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  function toggleLoading(isLoading) {
    const button = document.getElementById('loadMoreBtn');
    const loader = document.getElementById('loader');
  
    button.disabled = isLoading;
    loader.style.display = isLoading ? 'block' : 'none';
  }
  
  async function showPokemonDetails(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
  
    const speciesRes = await fetch(pokemon.species.url);
    const speciesData = await speciesRes.json();
  
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();
  
    const stats = pokemon.stats.map(stat =>
      `<div>${stat.stat.name}: ${stat.base_stat}</div>`
    ).join('');
  
    const evoChain = getEvolutionChain(evoData.chain);
  
    const typesHTML = pokemon.types.map(t => `
  <span class="type-badge ${t.type.name}">
    <img src="${typeIcons[t.type.name] || 'img/fallback.png'}" alt="${t.type.name}" class="type-icon" />
  </span>
`).join('');
  
    const html = `
      <h2>${capitalize(pokemon.name)} #${pokemon.id}</h2>
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" width="150" />
      <div><strong>Typen:</strong> ${typesHTML}</div>
      <div><strong>Stats:</strong> ${stats}</div>
      <div><strong>Evolution:</strong> ${evoChain}</div>
    `;
  
    document.getElementById('overlayContent').innerHTML = html;
    document.getElementById('overlay').classList.remove('hidden');
  }
  
  function closeOverlay() {
    document.getElementById('overlay').classList.add('hidden');
  }
  
  function getEvolutionChain(chain) {
    let evoList = [];
    let current = chain;
  
    while (current) {
      evoList.push(capitalize(current.species.name));
      current = current.evolves_to[0];
    }
  
    return evoList.join(' → ');
  }