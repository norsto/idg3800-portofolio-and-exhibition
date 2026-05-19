export default class RaceHorse extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.horseName = this.getAttribute("name") || "";
        this.horseKey = (this.getAttribute("key") || "").toUpperCase();
        this.position = 0;

        this.shadowRoot.innerHTML = this.horseTemplate();

        this.horseElement = this.shadowRoot.querySelector(".raceHorse");
        this.nameInput = this.shadowRoot.querySelector("#horseNameInput");
        this.keyInput = this.shadowRoot.querySelector("#horseKeyInput");
        this.keyError = this.shadowRoot.querySelector("#keyError");
        this.nameError = this.shadowRoot.querySelector("#nameError");

        this.nameInput.value = this.horseName;
        this.keyInput.value = this.horseKey;

        this.nameInput.addEventListener("input", () => {
            const val = this.nameInput.value;

            if (!val) {
                this.horseName = "";
                this.nameError.textContent = "";
                return;
            }

            const track = this.closest("race-track");
            if (track && track.isNameTaken(val, this)) {
                this.nameInput.value = "";
                this.horseName = "";
                this.nameError.textContent = `"${val}" is already in use`;
            } else {
                this.horseName = val;
                this.nameError.textContent = "";
            }
        });

        this.keyInput.addEventListener("input", () => {
            const val = this.keyInput.value.slice(-1).toUpperCase();
            this.keyInput.value = val;

            if (!val) {
                this.horseKey = "";
                this.keyError.textContent = "";
                return;
            }

            const track = this.closest("race-track");
            if (track && track.isKeyTaken(val, this)) {
                this.keyInput.value = "";
                this.horseKey = "";
                this.keyError.textContent = `"${val}" is already in use`;
            } else {
                this.horseKey = val;
                this.keyError.textContent = "";
            }
        });
    }

    // Returns true if horse has a valid, non-duplicate name and key
    isValid() {
        const track = this.closest("race-track");
        const hasName = this.horseName.trim() !== "";
        const hasKey = this.horseKey.trim() !== "";
        const nameDuplicated = track ? track.isNameTaken(this.horseName, this) : false;
        const keyDuplicated = track ? track.isKeyTaken(this.horseKey, this) : false;
        return hasName && hasKey && !nameDuplicated && !keyDuplicated;
    }

    // Locks inputs during race
    lockInputs() {
        this.nameInput.disabled = true;
        this.keyInput.disabled = true;
    }

    // Unlocks inputs after reset
    unlockInputs() {
        this.nameInput.disabled = false;
        this.keyInput.disabled = false;
    }

    move() {
        if (this.position >= 100) return;

        this.position += 5;
        this.horseElement.style.left = `${this.position}%`;

        this.dispatchEvent(new CustomEvent("update-racehorse-position", {
            bubbles: true,
            composed: true,
            detail: {
                name: this.horseName,
                position: this.position
            }
        }));
    }

    resetPosition() {
        this.position = 0;
        this.horseElement.style.left = "0%";
    }

    horseTemplate() {
        return `
        <style>
            :host {
                display: block;
                padding: 40px 0 20px 0;
            }

            .horseRow {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .raceHorse {
                position: relative;
                left: 0;
                font-size: 24px;
                transform: scaleX(-1);
                transition: left 0.1s ease-out;
                margin: 0;
                line-height: 1;
            }

            .settings {
                display: flex;
                flex-direction: row;
                gap: 0.4rem;
                margin-bottom: 4px;
                flex-wrap: wrap;
            }

            label {
                font-size: 0.75rem;
                color: #0c0c0c;
            }

            input {
                height: 1.5rem;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 0 4px;
                font-size: 0.8rem;
                color: #141414;
            }

            #horseNameInput {
                width: 5rem;
            }

            #horseKeyInput {
                width: 2rem;
                text-align: center;
            }

            .error {
                font-size: 0.7rem;
                color: #c0392b;
            }
        </style>

        <div class="settings">
            <label for="horseNameInput">Name:</label>
            <input type="text" id="horseNameInput" placeholder="Hors">
            <span class="error" id="nameError"></span>

            <label for="horseKeyInput">Key:</label>
            <input type="text" id="horseKeyInput" maxlength="1" placeholder="?">
            <span class="error" id="keyError"></span>
        </div>

        <div class="horseRow">
            <p class="raceHorse">🏇</p>
        </div>
        `;
    }
}

customElements.define("race-horse", RaceHorse);