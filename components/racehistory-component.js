export default class RaceHistory extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        
        // Calls on the <race-history>'s HTML and styles
        this.historyTemplate();
        // Stores a reference to the <ul> element where race results will be displayed
        this.historyList = this.shadowRoot.querySelector("#historyList");
    }

    // Runs when the element is added to the page
    connectedCallback() {
        // Loads and displays past race results from localStorage
        this.renderHistory();
        // Listens for the "race-finished" event, and when a race finishes it calls saveRaceResult
        document.addEventListener("race-finished", (event) => this.saveRaceResult(event.detail.winner));
    }
    
    // Adds new results and saves the results/winners and timestamps of the races
    saveRaceResult(winner) {
        // Gets existing race history from localStorage
        let raceResults = JSON.parse(localStorage.getItem("RACE_HISTORY")) || [];
        
        // Adds a new race result (winner name and timestamp)
        raceResults.push({
            timestamp: new Date().toLocaleString(),
            winner: winner
        });
    
        // Removes old results
        if (raceResults.length > 10) {
            raceResults.shift();
        }
        
        // Saves the updated history
        localStorage.setItem("RACE_HISTORY", JSON.stringify(raceResults));
        
        // Updates the displayed history by calling this.renderHistory
        this.renderHistory();
    }
    
    // Clears previous race results and appends new winners to the winner-list
    renderHistory() {
        // If there's no historyList, return
        if (!this.historyList) return;

        // Loads race results
        const raceResults = JSON.parse(localStorage.getItem("RACE_HISTORY")) || [];
        
        const historyList = this.shadowRoot.querySelector("#historyList");

        // Clears previous race results so absolute the first winner to win a race doesn't show up everytime there's a new winner
        historyList.innerHTML = "";
        
        // Loops through results in reverse order to show the latest winner first and creates <li> elements for each result and appends them to the list
        raceResults.reverse().forEach(result => {
            const listItem = document.createElement("li");
            listItem.textContent = `${result.winner} won the race at ${result.timestamp}`;
            historyList.appendChild(listItem);
        });
    } 

    // Styling and HTML for the <race-history> element
    historyTemplate() {
        this.shadowRoot.innerHTML = `
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