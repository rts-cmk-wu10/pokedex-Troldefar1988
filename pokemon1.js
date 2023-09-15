const URL = new URLSearchParams(window.location.search)


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// VIS SPINNER

fetch(`https://pokeapi.co/api/v2/pokemon/${URL.get("name")}`)
	.then(function(response) {
		if (response.status === 200) {
			return response.json()
		} else {
			document.body.innerText += "Ups, noget gik galt. Prøv igen senere."
		}
	})
	.then(function(data) {
		// SKJUL SPINNER
		const PIC = document.querySelector(".pokemon")
		
		PIC.innerHTML = `
		<div class="poke_center">
		<h1>${capitalizeFirstLetter(data.name)}</h1>
		<p>ID: ${data.id}</p>
		<img src="${data.sprites.other["official-artwork"].front_default}">
		</div>`
		const DIV = document.querySelector(".speccs")
		DIV.innerHTML = `
		<h1>Info:</h1>
		<p>Height: ${data.height}</p>
		<p>Weight: ${data.weight}</p>
		<p>Type: ${data.types.map(
			elem => `${elem.type.name}`
		).join(", ")}</p>
		<p>Abilities: ${data.abilities.map(
			elem => `${elem.ability.name}`
		).join(", ")}</p>`
	})

const OFFSET = parseInt(URL.get("offset") || "0")
const NEXT_PAGE = document.querySelector(".nextPage")
const PREV_PAGE = document.querySelector(".prevPage")

fetch(`https://pokeapi.co/api/v2/pokemon?offset=${OFFSET}`)
	.then(function(response) {
		if (response.status === 200) {
			return response.json()
		} else {
			document.body.innerText += "Ups, noget gik galt. Prøv igen senere."
		}
	})
	.then(function(data) {
		
		const LAST_OFFSET = data.count - (data.count % 20)
		// ternery operator i næste linie betyder:
		// hvis offset er større end eller lig med det størst mulige offset vi må have,
		// så skal vi brugas LAST_OFFSET - ellers skal vi bruge OFFSET + 20
		NEXT_PAGE.href = `/pokemon.html?name=${data.name}&offset=${OFFSET >= LAST_OFFSET ? LAST_OFFSET : OFFSET + 20}`

		PREV_PAGE.href = `/pokemon.html?name=${data.name}&offset=${Math.max(OFFSET - 20, 0)}`

		const UL = document.querySelector(".pokeList")
		data.results.forEach(function(result) {
			const LI = document.createElement("li")
			const capitalizedName = capitalizeFirstLetter(result.name); // Capitalize the first letter of each word in the name
			LI.innerHTML = `<a class="pokeList__link" href="/pokemon.html?name=${result.name}&offset=">${capitalizedName}</a>`;
			UL.append(LI)
		})
	})