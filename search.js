document.addEventListener('DOMContentLoaded', function () {
    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonList = document.getElementById('pokemons');
    const pokemonInfo = document.querySelector('.pokemon');
    const speccsInfo = document.querySelector('.speccs');

    // Function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Function to fetch and display Pokemon data
    function fetchPokemonData(pokemonName) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error('Pokemon not found');
                }
            })
            .then(function (data) {
                if (pokemonInfo && speccsInfo) {
                    pokemonInfo.innerHTML = `
                        <div class="poke_center">
                            <h1>${capitalizeFirstLetter(data.name)}</h1>
                            <p>ID: ${data.id}</p>
                            <img src="${data.sprites.other["official-artwork"].front_default}">
                        </div>
                    `;
                    speccsInfo.innerHTML = `
                        <h1>Info:</h1>
                        <p>Height: ${data.height}</p>
                        <p>Weight: ${data.weight}</p>
                        <p>Type: ${data.types.map(
                            elem => `${elem.type.name}`
                        ).join(", ")}</p>
                        <p>Abilities: ${data.abilities.map(
                            elem => `${elem.ability.name}`
                        ).join(", ")}</p>
                    `;
                }
            })
            .catch(function (error) {
                if (pokemonInfo && speccsInfo) {
                    pokemonInfo.innerHTML = "<p>Oops, something went wrong. Please try again later.</p>";
                    speccsInfo.innerHTML = "";
                }
            });
    }

    // Add event listener to the form for Pokemon lookup
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the form from submitting and reloading the page
        const selectedPokemon = pokemonInput.value.trim().toLowerCase(); // Convert to lowercase
        if (selectedPokemon !== '') {
            fetchPokemonData(selectedPokemon);
        }
    });

    // Add event listener to the input for autocomplete
    pokemonInput.addEventListener('input', function () {
        const selectedPokemon = pokemonInput.value.trim().toLowerCase(); // Convert to lowercase
        if (selectedPokemon !== '') {
            fetchPokemonData(selectedPokemon);
        }
    });

    // Fetch the list of Pokémon from the PokeAPI and populate the autocomplete suggestions
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then((response) => response.json())
        .then((data) => {
            const pokemons = data.results;
            pokemons.forEach((pokemon) => {
                const option = document.createElement('option');
                option.value = pokemon.name;
                pokemonList.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching Pokémon data:', error);
        });
});
