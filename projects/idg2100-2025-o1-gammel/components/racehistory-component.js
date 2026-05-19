export default class RaceHistory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.historyTemplate();
        this.historyList = this.shadowRoot.querySelector("#historyList");

        // Bind handler so we can remove it in disconnectedCallback
        this._onRaceFinished = (event) => this.saveRaceResult(event.detail.winner);
    }

    connectedCallback() {
        this.renderHistory();
        document.addEventListener("race-finished", this._onRaceFinished);
    }

    disconnectedCallback() {
        document.removeEventListener("race-finished", this._onRaceFinished);
    }

    saveRaceResult(winner) {
        let raceResults = JSON.parse(localStorage.getItem("RACE_HISTORY")) || [];

        raceResults.push({
            timestamp: new Date().toLocaleString(),
            winner: winner
        });

        // Keep only the 10 most recent results
        if (raceResults.length > 10) {
            raceResults.shift();
        }

        localStorage.setItem("RACE_HISTORY", JSON.stringify(raceResults));
        this.renderHistory();
    }

    renderHistory() {
        if (!this.historyList) return;

        const raceResults = JSON.parse(localStorage.getItem("RACE_HISTORY")) || [];

        this.historyList.innerHTML = "";

        // Show latest first
        [...raceResults].reverse().forEach(result => {
            const listItem = document.createElement("li");
            listItem.textContent = `${result.winner} won at ${result.timestamp}`;
            this.historyList.appendChild(listItem);
        });
    }

    historyTemplate() {
        return `
            <style>
                li {
                    padding: 8px 0;
                    list-style: "🏆 ";
                }
            </style>
            <ul id="historyList"></ul>
        `;
    }
}

customElements.define("race-history", RaceHistory);