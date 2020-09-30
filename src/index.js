document.addEventListener('DOMContentLoaded', () => {
    fetchAllPokemon()
})

function fetchAllPokemon(){

    fetch('http:localhost:3000/pokemon/')
        .then(response => response.json())
        .then(data => {
            const pokemonContainer = document.querySelector("#pokemon-container") // in retrospect I would declare this in global scope vs repeating myself
            pokemonContainer.innerHTML = renderAllPokemon(data) // calling helper method defined in eventHandlers.js
            addPokemonListeners() // nicer to do this here vs in callback function for DOMContentLoaded, since we assure all the pokemon have been displayed on the dom first
        });
}

// was using this function to render pokemon elements before I used the helper methods from eventHandlers.js
// function render(poke){
//     let pokemonCard = document.createElement("div")
  
//     pokemonCard.innerHTML += `<div class="card" id='pokemon-${poke.id}'>
//         <h2>${poke.name}</h2>
//         <img src="${poke.sprites.front}">
//     </div>`
//     document.querySelector("#pokemon-container").appendChild(pokemonCard)
// }

function addPokemonListeners(){
    let pokemon = document.querySelectorAll(".pokemon-card")
    pokemon.forEach(poke => {
        poke.querySelector("img").addEventListener('click', event => {
            showPoke(poke.querySelector("img").dataset.id)
        }) 
        poke.querySelector('.pokemon-delete-button').addEventListener('click', event => {
            removePoke(poke.querySelector("img").dataset.id)
        })
    })
}

function removePoke(id){
    const container = document.getElementById("pokemon-container") 
    fetch(`http:localhost:3000/pokemon/${id}`, {  // could also define method and headers in their own object, and pass to function, vs doing it inline
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(data => {
        const el = document.querySelector(`img[data-id = '${id}']`).parentElement.parentElement.parentElement
        el.parentNode.removeChild(el)
    })
    // don't have to remove the node inside of the fetch - could have done something like this, alternatively:
    // fetch(`http:localhost:3000/pokemon/${id}`, {
    //     method: 'DELETE',
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Accept": "application/json"
    //     }
    // })
    // const el = document.querySelector(`img[data-id = '${id}']`).parentElement.parentElement.parentElement
    // el.parentNode.removeChild(el)
    //     })
}

function showPoke(id){
  
    const container = document.getElementById("pokemon-container")
    container.innerHTML = ""
    fetch(`http://localhost:3000/pokemon/${id}`)
    .then(resp => resp.json()) // almost consumable json
    .then(data => container.innerHTML = renderSinglePokemon(data))
}