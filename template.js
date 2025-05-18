
function getTypeBadgeHTML(types) {
    return types.map(type => `
      <span class="type-badge ${type}">
        <img src="${typeIcons[type] || 'img/fallback.png'}"
             alt="${type}" class="type-icon" />
      </span>
    `).join('');
  }
  
  function getPokemonCardHTML(pokemon, backgroundColor, typeHTML) {
    const name = capitalize(pokemon.name);
    return `
      <div class="pokemon-list-card ${pokemon.types[0].type.name}"
           onclick="showPokemonDetails(${pokemon.id})">
        <div class="pokemon-info" style="background-color: ${backgroundColor};">
          <h3>#${pokemon.id} ${name}</h3>
        </div>
        <img class="pokemon-img-small"
             src="${pokemon.sprites.other['official-artwork'].front_default}"
             alt="${pokemon.name}" />
        <div class="types">${typeHTML}</div>
      </div>
    `;
  }
  
  function getAboutSectionHTML(pokemon, speciesData) {
    const flavor = speciesData.flavor_text_entries.find(e => e.language.name === "en");
    const text = flavor ? flavor.flavor_text.replace(/\f/g, ' ') : "Keine Beschreibung verfügbar.";
    const genus = speciesData.genera.find(e => e.language.name === "en")?.genus || "Unbekannte Gattung";
    const eggGroups = speciesData.egg_groups.map(g => g.name).join(', ');
    const habitat = speciesData.habitat?.name || "unbekannt";
    return `
      <div class="about-section">
        <span>Beschreibung:<br> ${text}</span>
        <span>Gattung: ${genus}</span>
        <span>Größe: ${pokemon.height / 10}</span>
        <span>Gewicht: ${pokemon.weight / 10} kg</span>
        <span>Fangrate: ${speciesData.capture_rate}</span>
        <span>Freundlichkeit: ${speciesData.base_happiness}</span>
        <span>Ei-Gruppen: ${eggGroups}</span>
        <span>Lebensraum: ${habitat}</span>
      </div>
    `;
  }
  
  function getStatsSectionHTML(pokemon) {
    return `
      <div class="stats-section">
        ${pokemon.stats.map(stat => {
          const perc = Math.min(stat.base_stat / 150 * 100, 100).toFixed(2);
          return `
            <div class="stat-item">
              <span class="stat-name">${stat.stat.name}:</span>
              <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${perc}%"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  function getOverlayHeaderHTML(pokemon, typesHTML, typeColor) {
    return `
      <div class="overlay-title">#${pokemon.id} ${capitalize(pokemon.name)}</div>
      <div class="pokemon-image-wrapper" style="background-color: ${typeColor};">
        <img src="${pokemon.sprites.other['official-artwork'].front_default}" width="150" />
      </div>
      <div class="type-overlay">${typesHTML}</div>
      <div class="overlay-menu-information">
        <button id="btnAbout" class="button-menu-overlay">About</button>
        <button id="btnStats" class="button-menu-overlay">Stats</button>
        <button id="btnEvolution" class="button-menu-overlay">Evolution</button>
      </div>
      <div id="overlayDataSection"></div>
      <div class="navigation-arrows">
        <img onclick="leftNavigation()" id="prevImage" src="./icons/arrow-left.png">
        <img onclick="rightNavigation()" id="nextImage" src="./icons/right-arrow.png">
      </div>
    `;
  }
  
  function getEvolutionHTML(evoList) {
    return `<div class="evolution-section">${evoList}</div>`;
  }
  
  function getEvolutionStageHTML(imageUrl, speciesName) {
    return `
      <div class="evolution-stage">
        <img src="${imageUrl}" alt="${speciesName}" width="80" />
        <div>${capitalize(speciesName)}</div>
      </div>
    `;
  }