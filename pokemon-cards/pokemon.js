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
    //let cardBackground = backgroundBasedOnType(pokemonType);
    let cardColour = backgroundBasedOnType(pokemonType);
    //let spriteBackground = spriteBgBasedOnType(pokemonType);
    //newPokemonCard.style.backgroundColor = cardBackground;
    newPokemon.style.backgroundColor = cardColour.spriteBackground;
    newPokemonName.style.color = cardColour.textColour;
    newPokemonCard.style.backgroundColor = cardColour.cardBackground;

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

    // {} []
    // set background
    //let cardColour;
    let cardColour;
    //let cardBackground; 
    //let spriteBackground;
    switch(types[0].toLowerCase()){
        case "normal": 
            cardColour = {
                cardBackground: "#d6b9b9", 
                //spriteBackground: "#efe3e3",
                spriteBackground: "#ffffffbf"
            }
        break;

        case "fire": 
            cardColour = {
                cardBackground: "#ea4214",
                spriteBackground: "#f7b3a1"
                //spriteBackground: "#ffffffbf"
            }
        break;

        case "water": 
            cardColour = {
                cardBackground: "#176aee",
                spriteBackground: "#a2c3f7",
                textColour: "#f2f2ff"
            }
        break;
        
        case "electric": 
            cardColour = {
                cardBackground: "#ffc800",
                spriteBackground: "#ffe999"
            }
        break; 

        case "grass": 
            cardColour = {
                cardBackground: "#82c368",
                spriteBackground: "#cde7c3"
            }
        break; 

        case "ice": 
            cardColour = {
                cardBackground: "#a2e1ff",
                spriteBackground: "#daf3ff"
            }
        break; 

        case "fighting": 
            cardColour = {
                cardBackground: "#a40a0a",
                spriteBackground: "#db9d9d",
                textColour: "#f2f2ff"
            }
        break; 

        case "poison": 
            cardColour = {
                cardBackground: "#b300ff",
                spriteBackground: "#e199ff"
            }
        break; 

        case "ground": 
            cardColour = {
                cardBackground: "#be9780",
                spriteBackground: "#e5d5cc"
            }
        break; 

        case "flying": 
            cardColour = {
                cardBackground: "#8dabfd",
                spriteBackground: "#d1ddfe"
            }
        break; 

        case "psychic": 
            cardColour = {
                cardBackground: "#dd00ff",
                spriteBackground: "#f199ff"
            }
        break; 

        case "bug": 
            cardColour = {
                cardBackground: "#d9ee3a",
                spriteBackground: "#f0f8b0"
            }
        break; 

        case "rock": 
            cardColour = {
                cardBackground: "#9e9088",
                spriteBackground: "#d8d3cf"
            }
        break; 

        case "ghost": 
            cardColour = {
                cardBackground: "#3e1d73",
                spriteBackground: "#b2a5c7",
                textColour: "#f2f2ff"
            }
        break; 

        case "dragon": 
            cardColour = {
                cardBackground: "#696FC7",
                spriteBackground: "#c3c5e9"
            }
        break; 

        case "dark": 
            cardColour = {
                cardBackground: "#30011b",
                spriteBackground: "#ac99a4",
                textColour: "#f2f2ff"
            }
        break; 

        case "steel": 
            cardColour = {
                cardBackground: "#c6c9eb",
                spriteBackground: "#e8e9f7"
            }
        break; 

        case "fairy": 
            cardColour = {
                cardBackground: "#fd95b3",
                spriteBackground: "#fed5e1"
            }
        break; 

        default:
            cardColour = {
                cardBackground: "#FFFFFF",
                spriteBackground: "#000000"
            }
    }

    console.log(cardColour);
    //return cardBackground;
    return cardColour;
}
