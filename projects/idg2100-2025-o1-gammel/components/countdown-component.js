export default class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this._originalSeconds = parseInt(this.getAttribute("seconds")) || 5;
        this.timeLeft = this._originalSeconds;
        this.countdownStart = false;
        this.timer = null;

        this.shadowRoot.innerHTML = this.getTemplateButtons();
        this.shadowRoot.append(this.countdownTemplate());

        this.startButton = this.shadowRoot.querySelector("#startButton");
        this.resetButton = this.shadowRoot.querySelector("#resetButton");
        this.countdownDisplay = this.shadowRoot.querySelector("#countdown");

        this.countdownDisplay.style.opacity = 0;

        this.startButton.addEventListener("click", () => this.startCountdown());
        this.resetButton.addEventListener("click", () => this.resetCountdown());
    }

    startCountdown() {
        if (this.countdownStart) return;

        // Find race-track on the page and check if all horses are valid
        const track = document.querySelector("race-track");
        if (track && !track.canStart()) {
            // canStart() shows the error message itself — just bail out
            return;
        }

        this.startButton.blur();
        this.countdownDisplay.style.opacity = 1;
        this.countdownStart = true;
        this.countDown();
    }

    countDown() {
        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft > 0) {
                this.countdownDisplay.textContent = this.timeLeft;
            } else {
                clearInterval(this.timer);
                this.timer = null;
                this.countdownDisplay.textContent = "Go!";
                this.fireEvent("race-start");
            }
        }, 1000);
    }

    resetCountdown() {
        this.resetButton.blur();

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        this.countdownStart = false;
        this.timeLeft = this._originalSeconds;
        this.countdownDisplay.textContent = this.timeLeft;
        this.countdownDisplay.style.opacity = 0;

        this.fireEvent("race-reset");
    }

    fireEvent(eventName) {
        this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            composed: true
        }));
    }

    getTemplateButtons() {
        return `
            <style>
                button {
                    border-radius: var(--button-radius, 5px);
                    padding: var(--button-padding, 10px);
                    font-size: var(--button-font-size, 18px);
                    width: var(--button-width, 5rem);
                    margin: 0 5px;
                    border: none;
                    cursor: pointer;
                    transition: var(--button-transition, 0.5s);
                    border: var(--button-border);

                }

                button:hover {
                    transform: scale(1.1);
                }

                #startButton {
                    background-color: var(--startButton-color, #16C47F);
                }

                #resetButton {
                    background-color: var(--resetButton-color, #FFD65A);
                }
            </style>
            <div>
                <button id="startButton">start</button>
                <button id="resetButton">reset</button>
            </div>
        `;
    }

    countdownTemplate() {
        const template = document.createElement("template");

        template.innerHTML = `
            <style>
                #countdown {
                    text-align: center;
                    font-size: 28px;
                }
            </style>
            <div>
                <h2 id="countdown">${this.timeLeft}</h2>
            </div>
        `;

        return template.content;
    }
}

customElements.define("countdown-timer", CountdownTimer);