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
    const newPokemonName = document.createElement("p");
    newPokemon.src = pokemonSpriteUrl;
    newPokemon.alt = `Picture of ${pokemonName}`;
    newPokemonName.textContent = pokemonName;

    console.log(pokemonName);

    // Adding classes to the given element
    newPokemonCard.classList.add("pokemonCard");
    newPokemon.classList.add("pokemonCard__img");
    newPokemonName.classList.add("pokemonCard__name");

    // Putting the img and namr into the new div
    newPokemonCard.appendChild(newPokemon);
    newPokemonCard.appendChild(newPokemonName);
    console.log(newPokemon);
    console.log(newPokemonName);

    // Calling the backgroundBasedOnType function to change card colour based on pokemon type
    let cardBackground = backgroundBasedOnType(pokemonType);
    let spriteBackground = spriteBgBasedOnType(pokemonType);
    newPokemonCard.style.backgroundColor = cardBackground;
    newPokemon.style.backgroundColor = spriteBackground;

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

// Switches backgroundcolour based on type of pokemon
function backgroundBasedOnType(pokemonType) {
    // recieve data.type
    const types = [];

    // extract types from data 
    pokemonType.forEach(element => {
        let type = element.type.name;
        types.push(type);
    });

    // set background
    let cardBackground; 
    switch(types[0].toLowerCase()){
        case "normal":
            cardBackground = "#d6b9b9";
            spriteBackground = "#FFDAB3";
            break;

        case "fire":
            cardBackground = "#ea4214";
            spriteBackground = "#3BC1A8";
            break;

        case "water":
            cardBackground = "#176aee";
            break;

        case "electric":
            cardBackground = "#ffc800";
            break;

        case "grass":
            cardBackground = "#82c368";
            break;

        case "ice":
            cardBackground = "#a2e1ff";
            break;

        case "fighting":
            cardBackground = "#a40a0a";
            break;

        case "poison":
            cardBackground = "#b300ff";
            break;

        case "ground":
            cardBackground = "#be9780";
            break;

        case "flying":
            cardBackground = "#8dabfd";
            break;

        case "psychic":
            cardBackground = "#dd00ff";
            break;

        case "bug":
            cardBackground = "#d9ee3a";
            break;

        case "rock":
            cardBackground = "#9e9088";
            break;

        case "ghost":
            cardBackground = "#3e1d73";
            break;

        case "dragon":
            cardBackground = "#696FC7";
            break;

        case "dark":
            cardBackground = "#30011b";
            break;

        case "steel":
            cardBackground = "#c6c9eb";
            break;

        case "fairy":
            cardBackground = "#fd95b3";
            break;

        default:
            cardBackground = "#FFFFFF";
    }
    return cardBackground;
}

function spriteBgBasedOnType(pokemonType) {
        // recieve data.type
    const types = [];

    // extract types from data 
    pokemonType.forEach(element => {
        let type = element.type.name;
        types.push(type);
    });

    let spriteBackground;
    switch(types[0].toLowerCase()){
        case "normal":
            spriteBackground = "#fd95b3";
            break;
        default:
            spriteBackground = "#FFFFFF";
    }
    return spriteBackground;
}