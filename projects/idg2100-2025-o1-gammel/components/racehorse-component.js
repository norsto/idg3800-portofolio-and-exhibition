export default class RaceHorse extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Get the horse's name from their attributes, and if they don't have a name it'll be Hors
        this.horseName = this.getAttribute("name");
        // Get the horse's keys from their attributes, and if they dont have one it'll be A. toUpperCase() makes all the keys display in uppercase
        this.horseKey = this.getAttribute("key").toUpperCase();
        
        // Horse's start position
        this.position = 0;

        // Inject styles and HTML into the shadow DOM
        this.shadowRoot.innerHTML = this.horseTemplate();
        
        // References
        // Stores a reference to the horse emoji element for easier access later
        this.horseElement = this.shadowRoot.querySelector(".raceHorse");
        this.nameInput = this.shadowRoot.querySelector("#horseNameInput");
        this.keyInput = this.shadowRoot.querySelector("#horseKeyInput");
        this.infoElement = this.shadowRoot.querySelector(".horseInfo");

        // Attaching event listeners 
        this.nameInput.value = this.horseName;
        this.keyInput.value = this.horseKey;

        this.nameInput.addEventListener("input", () => this.updateName(this.nameInput.value));
        this.keyInput.addEventListener("input", () => this.updateKey(this.keyInput.value));
    }

    // Moves the horse's forward when their assigned key is pressed
    move() {
        // If a horse reaches 100% of the track, stop moving
        if (this.position >= 100) return;
        // console.log("Key pressed:", this.horseKey); // Can be used if you want to see the keys being pressed in the console
        
        // Increases the horse's position by 5% for each time it's moved and the other moves the horse visually
        this.position += 5;
        this.horseElement.style.left = `${this.position}%`;

        // Updates the racetrack on the horse's position
        this.dispatchEvent(new CustomEvent("update-racehorse-position", { 
            bubbles: true, 
            composed: true,
            detail: { 
                name: this.horseName,
                position: this.position
            }
        }));    
    }

    // Resets the horses' position when the reset button is clicked
    resetPosition() {
        this.position = 0;
        this.horseElement.style.left = "0%"
    }

    updateName(newName) {
        this.horseName = newName || "Hors";
        // this.infoElement.textContent = `${this.horseName} | Key: ${this.horseKey}`;
        this.horseElement.setAttribute("name", this.horseName); 
    }

    updateKey(newKey) {
        this.horseKey = (newKey || "A").toUpperCase();
        // this.infoElement.textContent = `${this.horseName} | Key: ${this.horseKey}`;
        this.horseElement.setAttribute("key", this.horseKey);
    }

    // The styling and HTML for the <race-horse> element
    horseTemplate() {
        return `
        <style> 
            .horseInfo {
                position: relative;
                top: 0.3em;
            }

            .raceHorse {
                position: relative;
                left: 0;
                bottom: 30px;
                width: 30px;
                font-size: 30px;
                transform: scaleX(-1);
                transition: left 0.1s ease-out;
            }

            .changeHorseSettings {
                display: flex;
                flex-direction: column;
            }

            .changeHorseSettings input {
                height: 1.5rem;
                width: 6rem;
                color: #8a8a8a;
            }
        </style>

        <div class="changeHorseSettings">
            <label for="horseNameInput">Horse name:</label>
            <input type="text" id="horseNameInput" placeholder="Hors">

            <label for="horseKeyInput">Horse key:</label>
            <input type="text" id="horseKeyInput" maxlength="1" placeholder="A">
        </div>

        <p class="raceHorse" name="${this.horseName}" key="${this.horseKey}">🏇</p>
        `;

        // <p class="horseInfo">${this.horseName} | Key: ${this.horseKey}</p>
    }
}

customElements.define("race-horse", RaceHorse);