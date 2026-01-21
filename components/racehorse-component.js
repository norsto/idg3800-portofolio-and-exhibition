export default class RaceHorse extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Get the horse's name from their attributes, and if they don't have a name it'll be Hors
        this.horseName = this.getAttribute("name") || "Hors";
        // Get the horse's keys from their attributes, and if they dont have one it'll be A. toUpperCase() makes all the keys display in uppercase
        this.horseKey = (this.getAttribute("key") || "A").toUpperCase();
        
        // Horse's current position
        this.position = 0;

        // Inject styles and HTML into the shadow DOM
        this.shadowRoot.innerHTML = this.horseTemplate();
        // Stores a reference to the horse emoji element for easier access later
        this.horseElement = this.shadowRoot.querySelector(".raceHorse");
    }

    // Moves the horse's forward when their assigned key is pressed
    move() {
        // If a horse reaches 100% of the track, stop moving
        if (this.position >= 100) return;
//        console.log("Key pressed:", this.horseKey); // Can be used if you want to see the keys being pressed in the console
        
        // Increases the horse's position by 5% for each time it's moved and the other moves the horse visually
        this.position += 5;
        this.horseElement.style.left = `${this.position}%`;

        // Updates the racetrack on the horse's position
        this.dispatchEvent(new CustomEvent("update-racehorse-position", { 
            detail: { 
                name: this.horseName,
                position: this.position
            }, 
            bubbles: true, 
            composed: true 
        }));    
    }

    // Resets the horses' position when the reset button is clicked
    resetPosition() {
        this.position = 0;
        this.horseElement.style.left = "0%"
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
        </style>

        <p class="horseInfo">${this.horseName} | Key: ${this.horseKey}</p>

        <p class="raceHorse" name="${this.horseName}" key="${this.horseKey}">🏇</p>
        `;
    }
}

customElements.define("race-horse", RaceHorse);