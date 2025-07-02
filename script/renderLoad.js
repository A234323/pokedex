let allPokemon = [];
let visiblePokemon = [];
let currentLimit = 20;

function renderCards(pokemonList) {
    visiblePokemon = pokemonList;
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";

    pokemonList.forEach(pokemon => {
        const card = buildPokemonCard(pokemon);
        container.appendChild(card);
    });
}

function buildPokemonCard(pokemon) {
    const template = document.getElementById("card-template");
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".poke-card");

    card.classList.add(`type-${pokemon.types[0]}`);
    card.querySelector(".poke-name").textContent = pokemon.name.toUpperCase();
    card.querySelector(".poke-img").src = pokemon.imgUrl;

    const typeSymbols = createTypeSymbols(pokemon.types);
    card.querySelector(".poke-name").after(typeSymbols);

    card.addEventListener("click", event => {
        event.stopPropagation();
        openPopup(visiblePokemon.indexOf(pokemon));
    });

    return clone;
}

function createTypeSymbols(types) {
    const container = document.createElement("div");
    container.classList.add("poke-types");

    types.forEach(type => {
        const span = document.createElement("span");
        span.classList.add("type-symbol", type);
        container.appendChild(span);
    });

    return container;
}

function openPopup(index) {
    const oldPopup = document.querySelector(".popup");
    if (oldPopup) oldPopup.remove();

    const pokemon = visiblePokemon[index];
    const popup = buildPopupElement(pokemon);
    addPopupEvents(popup, index);
    document.body.appendChild(popup);
    document.body.classList.add("popup-open");
}

function buildPopupElement(pokemon) {
    const template = document.getElementById("popup-template");
    const clone = template.content.cloneNode(true);
    const popup = clone.querySelector(".popup");

    popup.classList.add(`type-${pokemon.types[0]}`);
    popup.querySelector(".popup-img").src = pokemon.imgUrl;
    popup.querySelector(".popup-name").textContent = pokemon.name;

    const contentArea = popup.querySelector(".popup-content");
    const renderTabs = setupPopupTabs(contentArea, pokemon);
    renderTabs.types();

    popup.renderTabs = renderTabs;
    return popup;
}

function addPopupEvents(popup, index) {
    setupTabEvents(popup);
    setupCloseEvent(popup);
    addPopupNavigation(popup, index);
    preventOutsideClose(popup);
}

function setupTabEvents(popup) {
    popup.querySelectorAll(".tab-btn").forEach(tab =>
        tab.addEventListener("click", () =>
            popup.renderTabs[tab.dataset.tab]())
    );
}

function setupCloseEvent(popup) {
    popup.querySelector(".popup-close").addEventListener("click", () =>
        closePopup(popup));
}

function addPopupNavigation(popup, index) {
    const arrows = createPopupArrows(index);
    popup.appendChild(arrows);
    popup.addEventListener("click", e => e.stopPropagation());
}

function preventOutsideClose(popup) {
    setTimeout(() => {
        document.addEventListener("click", function handleOutside(event) {
            if (!popup.contains(event.target)) {
                closePopup(popup);
                document.removeEventListener("click", handleOutside);
            }
        });
    }, 0);
}

function closePopup(popup) {
    popup.remove();
    if (!document.querySelector(".popup")) {
        document.body.classList.remove("popup-open");
    }
}

function setupPopupTabs(container, pokemon) {
    return {
        stats: () => renderTab(container, "Stats", pokemon.stats, stat =>
            `<span class="badge">${stat.stat.name.toUpperCase()}: ${stat.base_stat}</span>`),
        types: () => renderTab(container, "Types", pokemon.types, type =>
            `<span class="badge type-symbol ${type}"></span>`),
        abilities: () => renderTab(container, "Abilities", pokemon.abilities, ability =>
            `<span class="badge">${ability}</span>`)
    };
}

function renderTab(container, title, list, formatter) {
    container.innerHTML = `<p class="tab-title">${title}:</p>` + list.map(formatter).join("");
}

function createPopupArrows(index) {
    const container = document.createElement("div");
    container.classList.add("container-arrow");

    const prevIndex = (index === 0) ? visiblePokemon.length - 1 : index - 1;
    const nextIndex = (index === visiblePokemon.length - 1) ? 0 : index + 1;

    const leftArrow = createArrowButton("left", () => openPopup(prevIndex));
    const rightArrow = createArrowButton("right", () => openPopup(nextIndex));

    container.appendChild(leftArrow);
    container.appendChild(rightArrow);

    return container;
}

function createArrowButton(direction, onClick) {
    const btn = document.createElement("button");
    btn.classList.add("popup-arrow", direction);
    btn.textContent = direction === "left" ? "<" : ">";
    btn.addEventListener("click", e => {
        e.stopPropagation();
        onClick();
    });
    return btn;
}

function showLoadingCards() {
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        const placeholder = document.createElement("div");
        placeholder.className = "poke-card loading-placeholder";
        container.appendChild(placeholder);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showLoadingCards();
});
