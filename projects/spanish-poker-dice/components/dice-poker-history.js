class DicePokerHistory extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.storageKey = "DP_HISTORY";
        this.history = [];

        this.shadowRoot.innerHTML = `
            <style>
                ul {
                    list-style: none;
                    padding: 0;
                }

                li {
                    border-bottom: 1px solid #000;
                    padding: 6px 0;
                }

                h2 {
                    margin-top: 1rem;
                }

                #winners {
                    display: flex;
                    flex-wrap: wrap;
                }

                #roundWinner {
                    margin-left: 2rem;
                }
            </style>

            <slot></slot>

            <h2>Game History</h2>

            <div id="winners">
                <section id="matchWinner">
                    <h3>Match winner</h3>
                    <ul id="matchList"></ul>
                </section>

                <section id="roundWinner">
                    <h3>Round winner</h3>
                    <ul id="roundList"></ul>
                </section>
            </div>
        `;
    }

    connectedCallback() {
        this.loadHistory();
        this.render();

        this.addEventListener("dp:round-decided", this.handleRound);
        this.addEventListener("dp:match-decided", this.handleMatch);
    }

    disconnectedCallback() {
        this.removeEventListener("dp:round-decided", this.handleRound);
        this.removeEventListener("dp:match-decided", this.handleMatch);
    }

    loadHistory() {
        const stored = localStorage.getItem(this.storageKey);
        this.history = stored ? JSON.parse(stored) : [];
    }

    saveHistory() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.history));
    }

    handleRound = (roundEventDetails) => {
        const entry = {
            type: "round",
            timestamp: Date.now(),
            winner: roundEventDetails.detail.winner,
            hands: roundEventDetails.detail.hands
        };

        this.history.push(entry);
        this.saveHistory();
        this.render();
    }

    handleMatch = (matchEventDetails) => {
        const entry = {
            type: "match",
            timestamp: Date.now(),
            champion: matchEventDetails.detail.champion,
            scoreline: matchEventDetails.detail.scoreline
        };

        this.history.push(entry);
        this.saveHistory();
        this.render();
    }

    render() {
        const roundList = this.shadowRoot.querySelector("#roundList");
        const matchList = this.shadowRoot.querySelector("#matchList");

        const rounds = this.history.filter(e => e.type === "round")
            .slice()
            .reverse()
            .map(entry => {
                const date = new Date(entry.timestamp).toLocaleString();

                if (entry.type === "round") {
                    return `
                        <li>
                            <p><strong>Round</strong> (${date})</p>
                            <p>Winner: ${entry.winner}</p>
                            <p>P1: ${entry.hands.player1.handType}</p>
                            <p>P2: ${entry.hands.player2.handType}</p>
                        </li>
                    `;
                }
            })
            .join("");
        roundList.innerHTML = rounds;

        const matches = this.history.filter(e => e.type === "match")
            .slice()
            .reverse()
            .map(entry => {
                const date = new Date(entry.timestamp).toLocaleString();
                return `
                    <li>
                        <p><strong>Match</strong> (${date})</p>
                        <p>Champion: ${entry.champion}</p>
                        <p>Score: ${entry.scoreline.player1} - ${entry.scoreline.player2}</p>
                    </li>
                `;
            })
            .join("");
        matchList.innerHTML = matches;
    }
}

customElements.define("dice-poker-history", DicePokerHistory);