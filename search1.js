    const pokemonInput = document.getElementById('pokemon-input');
    const pokemonList = document.getElementById('pokemons');

    // Fetch the list of Pokémon from the PokeAPI
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000') // You can adjust the limit as needed
        .then((response) => response.json())
        .then((data) => {
            const pokemons = data.results;

            // Iterate through the list of Pokémon and add them to the datalist
            pokemons.forEach((pokemon) => {
                const option = document.createElement('option');
                option.value = pokemon.name;
                pokemonList.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error fetching Pokémon data:', error);
        });
