export default class RaceTrack extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.racetrackTemplate();
 
        this.horses = [];
        this.isRacing = false;
        this.winnerDeclared = false;
        this.validationError = null;
        this.displayWinner = null;
 
        this._onRaceStart = () => this.startRace();
        this._onRaceReset = () => this.resetRace();
        this._onHorseMove = (event) => this.checkWinner(event.detail.name, event.detail.position);
        this._onKeyUp = (event) => this.handleKeyPress(event);
    }
 
    connectedCallback() {
        // Cache shadow DOM references here, after the element is in the document
        this.validationError = this.shadowRoot.querySelector("#validationError");
        this.displayWinner = this.shadowRoot.querySelector("#displayWinner");
        this.addHorseButton = this.shadowRoot.querySelector("#addHorse");
        this.removeHorseButton = this.shadowRoot.querySelector("#removeHorse");
 
        this.addHorseButton.addEventListener("click", () => this.addHorse());
        this.removeHorseButton.addEventListener("click", () => this.removeHorse());
 
        setTimeout(() => {
            this.horses = Array.from(this.querySelectorAll("race-horse"));
            this.updateButtons();
        }, 0);
 
        document.addEventListener("race-start", this._onRaceStart);
        document.addEventListener("race-reset", this._onRaceReset);
        document.addEventListener("update-racehorse-position", this._onHorseMove);
    }
 
    disconnectedCallback() {
        document.removeEventListener("race-start", this._onRaceStart);
        document.removeEventListener("race-reset", this._onRaceReset);
        document.removeEventListener("update-racehorse-position", this._onHorseMove);
        document.removeEventListener("keyup", this._onKeyUp);
    }
 
    isKeyTaken(key, requester) {
        return this.horses.some(horse => {
            return horse !== requester && horse.horseKey === key.toUpperCase();
        });
    }
 
    isNameTaken(name, requester) {
        return this.horses.some(horse => {
            return horse !== requester && horse.horseName.toLowerCase() === name.toLowerCase();
        });
    }
 
    allHorsesValid() {
        return this.horses.every(horse => horse.isValid());
    }
 
    canStart() {
        if (!this.allHorsesValid()) {
            this.validationError.textContent = "All horses must have a unique name and key before starting.";
            return false;
        }
        this.validationError.textContent = "";
        return true;
    }
 
    addHorse() {
        if (this.horses.length >= 5) return;
 
        const horse = document.createElement("race-horse");
        horse.setAttribute("name", "");
        horse.setAttribute("key", "");
        this.appendChild(horse);
 
        this.horses = Array.from(this.querySelectorAll("race-horse"));
        this.updateButtons();
    }
 
    removeHorse() {
        if (this.horses.length <= 2) return;
 
        const lastHorse = this.horses[this.horses.length - 1];
        this.removeChild(lastHorse);
 
        this.horses = Array.from(this.querySelectorAll("race-horse"));
        this.updateButtons();
    }
 
    updateButtons() {
        const count = this.horses.length;
 
        this.addHorseButton.disabled = count >= 5;
        this.addHorseButton.textContent = count >= 5
            ? "Max horses reached"
            : `Add horse (${count}/5)`;
 
        this.removeHorseButton.disabled = count <= 2;
        this.removeHorseButton.textContent = count <= 2
            ? "Min horses reached"
            : `Remove horse (${count}/5)`;
    }
 
    startRace() {
        if (this.isRacing) return;
        if (!this.allHorsesValid()) return;
 
        this.isRacing = true;
        this.winnerDeclared = false;
        this.validationError.textContent = "";
 
        this.horses.forEach(horse => horse.lockInputs());
        this.addHorseButton.disabled = true;
        this.removeHorseButton.disabled = true;
        document.addEventListener("keyup", this._onKeyUp);
    }
 
    handleKeyPress(event) {
        if (!this.isRacing) return;
 
        const pressedKey = event.key.toUpperCase();
 
        this.horses.forEach(horse => {
            if (pressedKey === horse.horseKey) {
                horse.move();
            }
        });
    }
 
    checkWinner(name, position) {
        if (!this.isRacing || this.winnerDeclared) return;
 
        if (position >= 100) {
            this.isRacing = false;
            this.winnerDeclared = true;
 
            document.removeEventListener("keyup", this._onKeyUp);
 
            this.displayWinner.innerHTML = `🏆 The winner is ${name}! 🏆`;
 
            this.dispatchEvent(new CustomEvent("race-finished", {
                detail: { winner: name },
                bubbles: true,
                composed: true
            }));
        }
    }
 
    resetRace() {
        this.isRacing = false;
        this.winnerDeclared = false;
        document.removeEventListener("keyup", this._onKeyUp);
        this.horses.forEach(horse => {
            horse.resetPosition();
            horse.unlockInputs();
        });
        this.displayWinner.innerHTML = "";
        this.validationError.textContent = "";
        this.updateButtons();
    }

    racetrackTemplate() {
        return `
        <style>
        #raceTrack {
            position: relative;
            background-color: var(--racetrack-color, #E7D4B5);
            width: 60vw;
            min-width: 350px;
            max-width: 1000px;
            min-height: 300px;
            padding: 8px 20px;
            border-radius: 12px;
        }

        #finishLine {
            position: absolute;
            top: 0;
            left: 95%;
            width: 5px;
            height: 100%;
            background-color: var(--finishline-color, #A63636);
            border-radius: 0 12px 12px 0;
        }

        #displayWinner {
            text-align: center;
            font-weight: bold;
            min-height: 24px;
            margin-bottom: 4px;
        }

        #horseButtons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 40px 0;
        }

        #addHorse,
        #removeHorse {
            flex: 1;
            max-width: 200px;
            height: 2.4rem;
            border-radius: var(--button-radius, 5px);
            border: 1px solid rgba(0, 0, 0, 0.15);
            font-size: 16px;
            cursor: pointer;
            transition: var(--button-transition, 0.5s);
            border: var(--button-border);
        }

        #addHorse:hover:not(:disabled),
        #removeHorse:hover:not(:disabled) {
            transform: scale(1.05);
        }

        #addHorse:disabled,
        #removeHorse:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        #addHorse {
            background-color: var(--startButton-color, #16C47F);
        }

        #removeHorse {
            background-color: var(--resetButton-color, #FFD65A);
        }
        </style>

        <p id="validationError"></p>
        <p id="displayWinner"></p>
        <div id="raceTrack">
            <div id="finishLine"></div>
            <slot></slot>
        </div>
        <div id="horseButtons">
            <button id="addHorse">Add horse (2/5)</button>
            <button id="removeHorse">Remove horse (2/5)</button>
        </div>
        `;
    }
}

customElements.define("race-track", RaceTrack);