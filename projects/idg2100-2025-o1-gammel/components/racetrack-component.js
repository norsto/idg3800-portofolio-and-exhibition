export default class RaceTrack extends HTMLElement {
    constructor() {
        super(); 
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.racetrackTemplate();

        // Used to store <race-horse> elements inside the <race-track> element
        this.horses = [];
        // Makes sure the race doesn't start as soon as the component is loaded in
        this.isRacing = false;

        // Listens to the countdown component
        document.addEventListener("race-start", () => this.startRace());
        document.addEventListener("race-reset", () => this.resetRace());
        // Listens to the racehorse component (the horse positions)
        document.addEventListener("update-racehorse-position", (event) => this.declareWinner(event.detail.name, event.detail.position));
    }

    // Collects all the <race-horse> elements inside the <race-track> element
    connectedCallback() {
        this.horses = Array.from(this.querySelectorAll("race-horse"));
    }

    // Starts the race
    startRace() {
        // Checks if the race is already running before continuing
        if (this.isRacing) return;

        // If not, it's going to run after this
        this.isRacing = true;

        // Attaches key event listener 
        this.keyListener = (event) => this.handleKeyPress(event);
        document.addEventListener("keyup", this.keyListener);
    }

    // Listens for key presses
    handleKeyPress(event) {
//        console.log("key pressed:", event.key); // Can use this to debug
        if (!this.isRacing) return;

        // Makes the key comparison case-insensitive, so it doesn't matter if the user presses uppercase or lowercase
        const caseInsensitiveKey = event.key.toUpperCase()

        // Moves the correct horse
        this.horses.forEach(horse => {
            if (caseInsensitiveKey === horse.horseKey) {
                horse.move();
            }
        });
    }

    // Handles winner declaration when a horse reaches the finish line
    declareWinner(name, position) {
        // If the race is still running, don't declare a winner
        if (!this.isRacing) return;

        // Stops the race (and the horses) once a horse reaches the finish line
        if (position >= 100) {
            this.isRacing = false;
            document.removeEventListener("keyup", this.keyListener);
            
//            console.log("Race finished:", name); // Use for debugging
            
            // Displays the winner on top of the racetrack
            this.shadowRoot.querySelector("#displayWinner").innerHTML = `🏆The winner is ${name}🏆`;
            
            // Lets the racehorse and racehistory component know that the race is finished
            this.dispatchEvent(new CustomEvent("race-finished", {
             detail: {
                 winner: name
                },
                bubbles: true,
                composed: true
            }));
        }
    }

    // Resets the race state
    resetRace() {
        this.isRacing = false;
        this.horses.forEach(horse => horse.resetPosition());
        this.shadowRoot.querySelector("#displayWinner").innerHTML = "";
    }

    // The styling and HTML for the <race-track> element
    racetrackTemplate() {
        return `
        <style>
        #raceTrack {
            position: relative; 
            background-color: var(--racetrack-color);
            width: 60vw;
            min-width: 350px;
            max-width: 1000px;
            padding: 0 20px;
            border-radius: 20px;
        }

        #finishLine {
            position: absolute;
            top: 0;
            left: 95%;
            width: 5px;
            height: 100%;
            background-color: var(--finishline-color);
        }

        #displayWinner {
            text-align: center;
            font-weight: bold;
            height: 20px;
        }
        </style>

        <p id="displayWinner"></p>
        <div id="raceTrack">
            <div id="finishLine"></div>
            <slot></slot>
        </div>       
        `;
    }
}

customElements.define("race-track", RaceTrack);