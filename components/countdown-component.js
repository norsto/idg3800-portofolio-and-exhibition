export default class CountdownTimer extends HTMLElement {
    constructor() {
        // Calls the parent's constructor moethod and gets access to the parent's properties and methods
        super();

        // Attaches shadow DOM
        this.attachShadow({mode: "open"});

        // Checks the attribute seconds in the <countdown-timer> to decide the countdown, and if there's none it'll be set to 5 seconds
        this.timeLeft = this.getAttribute("seconds") || 5;

        // Indicates that the countdown hasn't started
        this.countdownStart = false;

        // Adds HTML content to the component's shadow DOM
        this.shadowRoot.innerHTML = this.getTemplateButtons();
        this.shadowRoot.append(this.countdownTemplate());
        
        // Cache the start button, reset button and the countdown display
        this.startButton = this.shadowRoot.querySelector("#startButton");
        this.resetButton = this.shadowRoot.querySelector("#resetButton");
        this.countdownDisplay = this.shadowRoot.querySelector("#countdown");

        // Keeps the countdown display invinsible before the start button is clicked
        this.countdownDisplay.style.opacity = 0;

        // Event listeners for when either of the buttons is clicked
        this.startButton.addEventListener("click", () => this.startCountdown());
        this.resetButton.addEventListener("click", () => this.resetCountdown());
    }

    // Starts the countdown when the start button is clicked
    startCountdown() {
        if (!this.countdownStart) {
            this.startButton.blur();
            this.countdownDisplay.style.opacity = 1;
            this.countDown();
            this.countdownStart = true;
        }
    }

    // The countdown logic
    countDown() {   
        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft > 1) {
                this.countdownDisplay.textContent = this.timeLeft;
            //    this.setAttribute("seconds", this.timeLeft);
            } else {
                clearInterval(this.timer);
                this.countdownDisplay.textContent = "Go!";
                this.fireEvent("race-start");
            }
        }, 1000);
    }

    // Resets the countdown when the reset button is clicked
    resetCountdown() {
        this.resetButton.blur()
        clearInterval(this.timer);
        this.countdownStart = false;
        this.timeLeft = 5;
        this.countdownDisplay.innerHTML = this.timeLeft;
        this.countdownDisplay.style.opacity = 0;
        this.fireEvent("race-reset");
    }

    // Custom event that the other components can listen to to know when the horses can move
    fireEvent(eventName) {
        this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                composed: true
        }));
    }
    
    // Styling and HTML for the start and reset buttons
    getTemplateButtons() {
        return `
        <style>
            #startButton,
            #resetButton {
                border-radius: 5px;
                padding: 10px;
                font-size: 18px;
                margin: 0 5px;
            }

            #startButton {
                background-color: var(--startButton-color);
            }

            #resetButton {
                background-color: var(--resetButton-color);
            }
        </style>
        <div>
            <button id="startButton">start</button>
            <button id="resetButton">reset</button> 
        </div>`;
    }

    // Styles and HTML for the countdown text
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
        </div>`;

        return template.content;
    }
}

customElements.define("countdown-timer", CountdownTimer);