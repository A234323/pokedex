const BASE_URL = "https://pokemon-f20e7-default-rtdb.europe-west1.firebasedatabase.app/";
const FIREBASE_PATH = "pokemon";
const MAX_POKEMON_LIMIT = 200;

async function fetchPokemonData() {
    const url = `${BASE_URL}${FIREBASE_PATH}.json`;
    const response = await fetch(url);
    const rawData = await response.json();
    if (!rawData || typeof rawData !== "object") return [];
    return parsePokemonData(rawData);
}

function parsePokemonData(data) {
    return Object.values(data)
        .filter(pokemon => pokemon?.name && pokemon?.imgUrl)
        .map(pokemon => ({
            name: pokemon.name,
            imgUrl: pokemon.imgUrl,
            types: pokemon.types,
            abilities: pokemon.abilities,
            stats: pokemon.stats,
        }));
}


async function loadAndRenderInitialPokemon() {
    allPokemon = await fetchPokemonData();
    currentLimit = 40;
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function renderCurrentPokemonBatch() {
    visiblePokemon = allPokemon.slice(0, currentLimit);
    renderCards(visiblePokemon);
}

function setupLoadMoreButton() {
    const button = document.getElementById("load-more");
    button.addEventListener("click", () => {
        currentLimit = Math.min(currentLimit + 20, MAX_POKEMON_LIMIT, allPokemon.length);
        renderCurrentPokemonBatch();
        updateLoadMoreVisibility();
    });
}

function updateLoadMoreVisibility() {
    const button = document.getElementById("load-more");
    const maxReached = currentLimit >= allPokemon.length || currentLimit >= MAX_POKEMON_LIMIT;
    button.classList.toggle("hidden", maxReached);
}

function hideLoadMoreButton() {
    document.getElementById("load-more").classList.add("hidden");
}

function setupSearchInput() {
    const input = document.getElementById("search");
    input.addEventListener("input", handleSearchInput);
}

function handleSearchInput(event) {
    const searchTerm = event.target.value.toLowerCase();

    if (searchTerm.length < 3) {
        resetSearchView();
        return;
    }

    const filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    showSearchResults(filteredPokemon);
}


function resetSearchView() {
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function showSearchResults(filteredPokemonList) {
    if (filteredPokemonList.length === 0) {
        showNoResults();
        hideLoadMoreButton();
    } else {
        visiblePokemon = filteredPokemonList;
        renderCards(filteredPokemonList);
        hideLoadMoreButton();
    }
}



function hideLoadingIndicator() {
    const loading = document.getElementById("loading");
    if (loading) loading.classList.add("hidden");
}

function showDefaultList() {
    renderCurrentPokemonBatch();
    updateLoadMoreVisibility();
}

function displaySearchResults(filteredList) {
    if (filteredList.length === 0) {
        showNoResults();
        hideLoadMoreButton();
    } else {
        visiblePokemon = filteredList;
        renderCards(filteredList);
        hideLoadMoreButton();
    }
}

function showNoResults() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = '<p class="no-result">No Pokémon found.</p>';
}

document.addEventListener("DOMContentLoaded", () => {
    showLoadingCards();
    setupSearchInput();
    setupLoadMoreButton();
    loadAndRenderInitialPokemon();
});
