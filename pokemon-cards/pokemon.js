// fetching pokemons from open api

//directly from yt video: https://www.youtube.com/watch?v=37vxWr0WgQk 

/* Method 1 (is hardcoded)
fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
    .then(response => {
        if(!response.ok){
            throw new Error("Couldn't fetch resource");
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
*/

/*Method 2
//fetchData(); gets called whenyou click the button

async function fetchData(){
    try{

        const pokemonName = document.querySelector("#pokemonName").value.toLowerCase();

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if(!response.ok){
            throw new Error("Couln't fetch pokemon");
        }

        const data = await response.json();
        console.log(data);
        const pokemonSprite = data.sprites.front_default;
        const imgElement = document.querySelector("#pokemonSprite");

        imgElement.src = pokemonSprite;
        imgElement.style.display = "block";
    }
    catch(error){
        console.error(error);
    }
}
*/

// Create new element everytime someone clicks the button
//Pokemon id's range from 1 - 1025

const yourPokedex = document.querySelector("#yourPokedex");

//let yourPokemon = []; not in use yet

// Dynamically creates pokemon cards when a pokemon is pulled
function addPokemon(pokemonSpriteUrl, pokemonName, pokemonType) {

    const newPokemonCard = document.createElement("div");
    const newPokemon = document.createElement("img");
    newPokemon.src = pokemonSpriteUrl;

    // Adding classes to the given element
    newPokemonCard.classList.add("pokemonCard");
    newPokemon.classList.add("pokemonCard__img");

    // Putting the img into the new div
    newPokemonCard.appendChild(newPokemon);
    let backgroundColour = backgroundBasedOnType(pokemonType);
    console.log(backgroundColour);
    newPokemonCard.style.backgroundColor = backgroundColour;

    // Putting the div into the already exsisting yourPokedex div
    yourPokedex.insertAdjacentElement("beforeend", newPokemonCard);
}

// Get random pokemon based on id 
async function getRandomPokemon() {
    try {

        let randomPokemonId = Math.floor(Math.random() * 1024) + 1;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        if(!response.ok){
            throw new Error("Couldn't fetch pokemon");
        }
                
        const data = await response.json();
        console.log(data);

        const spriteUrl = data.sprites.front_default;
        const pokemonName = data.name;
        const pokemonType = data.types;
        console.log(pokemonType);

        //Parameter get passed to addPokemon()
        addPokemon(spriteUrl, pokemonName, pokemonType);
    }
    catch(error){
        console.error(error);
    }
}

function backgroundBasedOnType(pokemonType) {
    // recieve data.type
    const types = [];

    // extract types from data 
    pokemonType.forEach(element => {
        let type = element.type.name;
        types.push(type);
    });
    console.log(types);

    // set background
    let backgroundColour; 
    switch(types[0].toLowerCase()){
        case "normal":
            backgroundColour = "gray";
            break;

        case "fire":
            backgroundColour = "red";
            break;

        case "water":
            backgroundColour = "blue";
            break;

        case "electric":
            backgroundColour = "yellow";
            break;

        case "grass":
            backgroundColour = "$greenishCard";
            break;

        case "ice":
            backgroundColour = "lightblue";
            break;

        case "fighting":
            backgroundColour = "maroon";
            break;

        case "poison":
            backgroundColour = "purple";
            break;

        case "ground":
            backgroundColour = "brown";
            break;

        case "flying":
            backgroundColour = "aliceblue";
            break;

        case "psychic":
            backgroundColour = "plum";
            break;

        case "bug":
            backgroundColour = "lightgreen";
            break;

        case "rock":
            backgroundColour = "darkgray";
            break;

        case "ghost":
            backgroundColour = "darkpurple";
            break;

        case "dragon":
            backgroundColour = "navy";
            break;

        case "dark":
            backgroundColour = "darkslategray";
            break;

        case "steel":
            backgroundColour = "silver";
            break;

        case "fairy":
            backgroundColour = "pink";
            break;

        default:
            backgroundColour = "black"
    }

    return backgroundColour;
}