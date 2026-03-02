
// Create new element everytime someone clicks the button
//Pokemon id's range from 1 - 1025

const yourPokedex = document.querySelector("#yourPokedex");

//let yourPokemon = []; not in use yet

// Dynamically creates pokemon cards when a pokemon is pulled
function addPokemon(pokemonSpriteUrl, pokemonName, pokemonType) {

    const newPokemonCard = document.createElement("div");
    const newPokemonCardFront = document.createElement("div");
    const newPokemonCardBack = document.createElement("div");

    const newPokemon = document.createElement("img");
    const newPokemonName = document.createElement("p");

    const newPokemonTypes = document.createElement("p");

    newPokemon.src = pokemonSpriteUrl;
    newPokemon.alt = `Picture of ${pokemonName}`;
    newPokemonName.textContent = pokemonName;

    newPokemonTypes.textContent = pokemonType;

    console.log(pokemonName);

    // Adding classes to the given element
    newPokemonCard.classList.add("pokemonCard");
    newPokemonCardFront.classList.add("pokemonCard__front");
    newPokemonCardBack.classList.add("pokemonCard__back");

    newPokemon.classList.add("pokemonCard__front--img");
    newPokemonName.classList.add("pokemonCard__front--name");

    newPokemonTypes.classList.add("pokemonCard__back--types");


    // Putting the img and name into the new div
    // newPokemonCard.appendChild(newPokemon);
    // newPokemonCard.appendChild(newPokemonName);
    newPokemonCard.addEventListener("click", flipCard);
    newPokemonCard.appendChild(newPokemonCardFront);
    newPokemonCard.appendChild(newPokemonCardBack);

    newPokemonCardFront.appendChild(newPokemon);
    newPokemonCardFront.appendChild(newPokemonName);

    newPokemonCardBack.appendChild(newPokemonTypes);

    console.log(newPokemon);
    console.log(newPokemonName);
    console.log(newPokemonTypes);

    // Calling the backgroundBasedOnType function to change card colour based on pokemon type
    //let cardBackground = backgroundBasedOnType(pokemonType);
    let cardColour = backgroundBasedOnType(pokemonType);
    //let spriteBackground = spriteBgBasedOnType(pokemonType);
    //newPokemonCard.style.backgroundColor = cardBackground;
    newPokemon.style.background = cardColour.spriteBackground;
    newPokemonName.style.color = cardColour.textColour;
    newPokemonCard.style.background = cardColour.cardBackground;

    // Putting the div into the already exsisting yourPokedex div
    yourPokedex.insertAdjacentElement("afterbegin", newPokemonCard); // beforeend
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
        // const pokemonPrimaryType = data.types[0].type; // don't need to do this
        console.log(pokemonType);

        //Parameter get passed to addPokemon()
        addPokemon(spriteUrl, pokemonName, pokemonType);
    }
    catch(error){
        console.error(error);
    }
}


// Switches background colour based on type of pokemon
function backgroundBasedOnType(pokemonType) {
    const types = pokemonType.map(element => element.type.name.toLowerCase());

    // colour map related to the pokemons
    const typeColours = {
        normal:  { card: "#d6b9b9", spriteBg: "#efe3e3", text: "#000000" },
        fire:    { card: "#ea4214", spriteBg: "#f7b3a1", text: "#ffffff" },
        water:   { card: "#176aee", spriteBg: "#a2c3f7", text: "#ffffff" },
        electric:{ card: "#ffc800", spriteBg: "#ffe999", text: "#000000" },
        grass:   { card: "#82c368", spriteBg: "#cde7c3", text: "#000000" },
        ice:     { card: "#a2e1ff", spriteBg: "#daf3ff", text: "#000000" },
        fighting:{ card: "#a40a0a", spriteBg: "#db9d9d", text: "#ffffff" },
        poison:  { card: "#b300ff", spriteBg: "#e199ff", text: "#ffffff" },
        ground:  { card: "#be9780", spriteBg: "#e5d5cc", text: "#000000" },
        flying:  { card: "#8dabfd", spriteBg: "#d1ddfe", text: "#000000" },
        psychic: { card: "#dd00ff", spriteBg: "#f199ff", text: "#ffffff" },
        bug:     { card: "#d9ee3a", spriteBg: "#f0f8b0", text: "#000000" },
        rock:    { card: "#9e9088", spriteBg: "#d8d3cf", text: "#000000" },
        ghost:   { card: "#3e1d73", spriteBg: "#b2a5c7", text: "#ffffff" },
        dragon:  { card: "#696FC7", spriteBg: "#c3c5e9", text: "#ffffff" },
        dark:    { card: "#30011b", spriteBg: "#ac99a4", text: "#ffffff" },
        steel:   { card: "#c6c9eb", spriteBg: "#e8e9f7", text: "#000000" },
        fairy:   { card: "#fd95b3", spriteBg: "#fed5e1", text: "#000000" }
    };

    const primaryColours = typeColours[types[0]] || "#ffffff";

    //const spriteBackground = spriteBackgroundColour[types[0]] || "#ffffff80";

    if (types.length > 1) {
        const secondaryColours = typeColours[types[1]] || "#000000";
        //const secondarySpriteColour = spriteBackgroundColour[types[1]] || "#ffffff80"

        return {
            cardBackground: `linear-gradient(in oklab, ${primaryColours.card} 0 30%, ${secondaryColours.card} 70% 100%)`, //135 deg
            spriteBackground: `linear-gradient(0deg, ${primaryColours.spriteBg}, ${secondaryColours.spriteBg})`, //315 deg 
            textColour: secondaryColours.text
        }
    }

    return {
        cardBackground: primaryColours.card,
        spriteBackground: primaryColours.spriteBg,
        textColour: primaryColours.text
    }
}

// basic state for card
let flippedCard = null;
// flips cards 
function flipCard(clickEvent) {
    const clickedCard = clickEvent.currentTarget;

    // flip back to front if already flipped
    if (flippedCard === clickedCard) {
        clickedCard.classList.remove("pokemonCard--flipped");
        flippedCard = null;
        return;
    }

    // this one doesnt work
    // supposed to flip card back if another is clicked
    if (flippedCard) {
        console.log("supposed to flip if another gets flipped");
        clickedCard.classList.remove("pokemonCard--flipped");
    }

    // flip a new card and add temporary class to it
    clickedCard.classList.add("pokemonCard--flipped");
    flippedCard = clickedCard;
}