// Define a new URLSearchParams object to parse URL parameters
const newURL = new URLSearchParams(window.location.search);

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fetch Pokémon data based on the "name" parameter in the URL
fetch(`https://pokeapi.co/api/v2/pokemon/${newURL.get("name")}`)
    .then(function(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            // Display an error message if the API request fails
            document.body.innerText += "Ups, noget gik galt. Prøv igen senere.";
        }
    })
    .then(function(data) {
        // Select the HTML element with class "pokemon"
        const PIC = document.querySelector(".pokemon");

        // Populate the "pokemon" element with data from the API response
        PIC.innerHTML = `
            <div class="poke_center">
                <h1>${capitalizeFirstLetter(data.name)}</h1>
                <p>ID: ${data.id}</p>
                <img src="${data.sprites.other["official-artwork"].front_default}">
            </div>`;

        // Select the HTML element with class "speccs"
        const DIV = document.querySelector(".speccs");

        // Populate the "speccs" element with data from the API response
        DIV.innerHTML = `
            <h1>Info:</h1>
            <p>Height: ${data.height}</p>
            <p>Weight: ${data.weight}</p>
            <p>Type: ${data.types.map(
                elem => `${elem.type.name}`
            ).join(", ")}</p>
            <p>Abilities: ${data.abilities.map(
                elem => `${elem.ability.name}`
            ).join(", ")}</p>`;
    });

// Helper function to parse URL parameters
function URLParams(url) {
    this.url = url;
    this.get = function (name) {
        const match = RegExp('[?&]' + name + '=([^&]*)').exec(this.url);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };
}
const URL = new URLSearchParams(window.location.search);

// The remaining code appears to be related to pagination for Pokémon listing.
// It defines functions and event listeners for fetching and displaying Pokémon lists.

// Define LIMIT outside the event listeners
const LIMIT = 20;

const NEXT_PAGE = document.querySelector(".nextPage");
const PREV_PAGE = document.querySelector(".prevPage");

// Function to fetch and display Pokémon list with pagination
function fetchAndDisplayPokemonList(offset) {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            } else {
                document.body.innerText += "Ups, noget gik galt. Prøv igen senere.";
            }
        })
        .then(function (data) {
            // Calculate the next and previous offsets
            const nextOffset = offset + LIMIT;
            const prevOffset = Math.max(offset - LIMIT, 0);

            NEXT_PAGE.href = `/pokemon.html?offset=${nextOffset}`;
            PREV_PAGE.href = `/pokemon.html?offset=${prevOffset}`;

            const UL = document.querySelector(".pokeList");
            UL.innerHTML = ""; // Clear the previous list
            data.results.forEach(function (result) {
                const LI = document.createElement("li");
                const capitalizedName = capitalizeFirstLetter(result.name); // Capitalize the first letter of each word in the name
                LI.innerHTML = `<a class="pokeList__link" href="/pokemon.html?name=${result.name}&offset=${offset}">${capitalizedName}</a>`;
                UL.append(LI);
            });
        });
}

// Initial fetch and display of Pokémon list
const OFFSET = parseInt(URL.get("offset") || "0");
fetchAndDisplayPokemonList(OFFSET);

// Event listener for the "Next" button
NEXT_PAGE.addEventListener('click', function (event) {
    event.preventDefault();
    const nextOffset = OFFSET + LIMIT;
    window.location.href = `/pokemon.html?name=${URL.get("name") || ""}&offset=${nextOffset}`;
});

// Event listener for the "Previous" button
PREV_PAGE.addEventListener('click', function (event) {
    event.preventDefault();
    const prevOffset = Math.max(OFFSET - LIMIT, 0);
    window.location.href = `/pokemon.html?name=${URL.get("name") || ""}&offset=${prevOffset}`;
});
