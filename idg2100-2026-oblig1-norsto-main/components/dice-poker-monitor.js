class DicePokerMonitor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.remainingRolls;

    this.shadowRoot.innerHTML = `
      <h1 id="currentRound">Current round: </h1>
      <h2 id="activePlayer">Active player: </h2>
  
      <p id="remainingRolls">Remaining rolls: </p>
      <p id="lastFaces"></p>
      <p id="held"></p>
      
      <h1 id="score"></h1>
      <h2 id="roundWinner"></h2>
      <slot></slot>
    `; 
  }

  connectedCallback() {
    this.addEventListener("dp:round-start", (eventDetails)=> {
      if (eventDetails.detail.round == 1) {
        this.shadowRoot.querySelector("#roundWinner").innerHTML =``;
        this.shadowRoot.querySelector("#score").innerHTML = ``; 
      }
      this.shadowRoot.querySelector("#currentRound").innerHTML = `Current round: ${eventDetails.detail.round}`;
    
      this.remainingRolls = 3;
      this.shadowRoot.querySelector("#remainingRolls").innerHTML = `Remaining rolls: ${this.remainingRolls}`;
    
    });

    this.addEventListener("dp:turn-changed", (eventDetails)=> {
      this.shadowRoot.querySelector("#activePlayer").innerHTML = `Active player: ${eventDetails.detail.player}`;
      
      this.remainingRolls = eventDetails.detail.remainingRolls;
      this.shadowRoot.querySelector("#remainingRolls").innerHTML = `Remaining rolls: ${this.remainingRolls}`;
    });
    
    this.addEventListener("dp:roll-executed", (eventDetails)=> {
      this.remainingRolls--;
      this.shadowRoot.querySelector("#remainingRolls").innerHTML = `Remaining rolls: ${this.remainingRolls}`;
    });
    
    this.addEventListener("dp:round-decided", (eventDetails)=> {
      this.shadowRoot.querySelector("#roundWinner").innerHTML =`${eventDetails.detail.breakdown}` 
    });

    this.addEventListener("dp:match-decided", (eventDetails)=> {
      this.shadowRoot.querySelector("#score").innerHTML =`
      ${eventDetails.detail.champion} wins the match 
      ${eventDetails.detail.scoreline.player1} -
      ${eventDetails.detail.scoreline.player2} 
      `;

    });

  }

  disconnectedCallback() {
    this.removeEventListener("dp:round-start");
    this.removeEventListener("dp:turn-changed");
    this.removeEventListener("dp:roll-executed");
    this.removeEventListener("dp:round-decided");
    this.removeEventListener("dp:match-decided");
  }
}

customElements.define('dice-poker-monitor', DicePokerMonitor);