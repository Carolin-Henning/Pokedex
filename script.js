

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
let currentIndex = 0;
const loadedPokemon = [];


document.getElementById('overlay').addEventListener('click', function(event) {
  if (event.target.id === 'overlay') {
    closeOverlay();
  }
});



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

  if (offset === limit) setupSearch();

}

function setupSearch() {
  const input = document.querySelector('.input-header');
  if (!input) return;

  input.addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.pokemon-list-card');

    cards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = name.includes(query) ? 'flex' : 'none';
    });
  });
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return await response.json();
}

function renderPokemon(pokemon) {
  const pokedex = document.getElementById('pokedex');
  const types = pokemon.types.map(t => t.type.name);
  const mainType = types[0];
  const backgroundColor = getTypeColor(mainType);
  const typeHTML = getTypeBadgeHTML(types);
  const cardHTML = getPokemonCardHTML(pokemon, backgroundColor, typeHTML);

  pokedex.innerHTML += cardHTML;
  loadedPokemon.push(pokemon);
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTypeColor(type) {
  const colors = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD'
  };
  return colors[type] || '#777';
}


async function showPokemonDetails(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  const speciesRes = await fetch(pokemon.species.url);
  const speciesData = await speciesRes.json();

  const evoRes = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoRes.json();

  const types = pokemon.types.map(t => t.type.name);
  const typeHTML = getTypeBadgeHTML(types);
  const typeColor = getTypeColor(types[0]);

  const overlayHeader = getOverlayHeaderHTML(pokemon, typeHTML, typeColor);
  document.getElementById('overlayContent').innerHTML = overlayHeader;

  showOverlay();

  document.getElementById('btnAbout').addEventListener('click', () => {
    showAboutSection(pokemon, speciesData);
  });

  document.getElementById('btnStats').addEventListener('click', () => {
    showStatsSection(pokemon);
  });

  document.getElementById('btnEvolution').addEventListener('click', async () => {
    const evoHTML = await getEvolutionChain(evoData.chain);
    showEvolutionSection(evoHTML);
  });

  showAboutSection(pokemon, speciesData);
}

function showAboutSection(pokemon, speciesData) {
  const aboutHTML = getAboutSectionHTML(pokemon, speciesData);
  document.getElementById('overlayDataSection').innerHTML = aboutHTML;
}

function showStatsSection(pokemon) {
  const statsHTML = getStatsSectionHTML(pokemon);
  document.getElementById('overlayDataSection').innerHTML = statsHTML;
}

function showEvolutionSection(evoHTML) {
  const html = getEvolutionHTML(evoHTML);
  document.getElementById('overlayDataSection').innerHTML = html;
}

async function getEvolutionChain(chain) {
  const evoList = [];
  let current = chain;

  while (current) {
    const speciesName = current.species.name;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}`);
    const data = await res.json();
    const imageUrl = data.sprites.other['official-artwork'].front_default;
    evoList.push(getEvolutionStageHTML(imageUrl, speciesName));
    current = current.evolves_to[0];
  }

  return evoList.join('<span class="evolution-arrow">>></span>');
}


function leftNavigation() {
  currentIndex = (currentIndex - 1 + loadedPokemon.length) % loadedPokemon.length;
  showPokemonDetailsByIndex(currentIndex);
}

function rightNavigation() {
  currentIndex = (currentIndex + 1) % loadedPokemon.length;
  showPokemonDetailsByIndex(currentIndex);
}

function showPokemonDetailsByIndex(index) {
  const pokemon = loadedPokemon[index];
  if (pokemon) {
    showPokemonDetails(pokemon.id);
    currentIndex = loadedPokemon.findIndex(p => p.id === pokemon.id);
  }
}


function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function showOverlay() {
  document.getElementById('overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}


function toggleLoading(isLoading) {
  const button = document.getElementById('loadMoreBtn');
  const loader = document.getElementById('loader');
  button.disabled = isLoading;
  loader.style.display = isLoading ? 'block' : 'none';
}