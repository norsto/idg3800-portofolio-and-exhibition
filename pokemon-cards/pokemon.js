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
    newPokemon.style.background = cardColour.spriteBackground;
    newPokemonName.style.color = cardColour.textColour;
    newPokemonCard.style.background = cardColour.cardBackground;

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

    const typeColour = {
        normal: "#d6b9b9",
        fire: "#ea4214",
        water: "#176aee",
        electric: "#ffc800",
        grass: "#82c368",
        ice: "#a2e1ff",
        fighting: "#a40a0a",
        poison: "#b300ff",
        ground: "#be9780",
        flying: "#8dabfd",
        psychic: "#dd00ff",
        bug: "#d9ee3a",
        rock: "#9e9088",
        ghost: "#3e1d73",
        dragon: "#696FC7",
        dark: "#30011b",
        steel: "#c6c9eb",
        fairy: "#fd95b3"
    };

    const spriteBackgroundColour = {
        normal: "#efe3e3",
        fire: "#f7b3a1",
        water: "#a2c3f7",
        electric: "#ffe999",
        grass: "#cde7c3",
        ice: "#daf3ff",
        fighting: "#db9d9d",
        poison: "#e199ff",
        ground: "#e5d5cc",
        flying: "#d1ddfe",
        psychic: "#f199ff",
        bug: "#f0f8b0",
        rock: "#d8d3cf",
        ghost: "#b2a5c7",
        dragon: "#c3c5e9",
        dark: "#ac99a4",
        steel: "#e8e9f7",
        fairy: "#fed5e1"
    };
    
    const types = pokemonType.map(element => element.type.name.toLowerCase());

    const primaryColour = typeColour[types[0]] || "#ffffff";

    const spriteBackground = spriteBackgroundColour[types[0]] || "#ffffff80";

    // make this it's own function
        if (typeColour.water || typeColour.fighting || typeColour.poison || typeColour.ghost || typeColour.dark) {
            const textColour1 = "#ffffff";
            return textColour1
        } else if (typeColour){
            const textColour2 = "#000000";
            return textColour2
        }

    if (types.length > 1) {
        const secondaryColour = typeColour[types[1]] || "#000000";
        const secondarySpriteColour = spriteBackgroundColour[types[1]] || "#ffffff80"

        return {
            cardBackground: `linear-gradient(135deg, ${primaryColour}, 40%, ${secondaryColour})`,
            spriteBackground: `linear-gradient(315deg, ${spriteBackground}, ${secondarySpriteColour})`,
            textColour1: textColour1,
            textColour2: textColour2
        }
    }

    return {
        cardBackground: primaryColour,
        spriteBackground: spriteBackground,
        textColour1: textColour1,
        textColour2: textColour2
    }
}
