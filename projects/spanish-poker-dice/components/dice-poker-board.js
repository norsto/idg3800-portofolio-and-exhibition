class DicePokerBoard extends HTMLElement {
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.gameStarted = false;
    this.held = [false, false, false, false, false];
    this.faces = ["", "", "", "", ""];
    this.remainingRolls = 3; 
    this.player; 
    this.player1hand;
    this.player2hand;
    this.player1HandType;
    this.player2HandType;
    this.roundFinished = false;
    this.includeStraight = this.getAttribute("include-straight"); 
    this.currentRound = 0;
    this.player1Score = 0;
    this.player2Score = 0;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../assets/style.css">
      <style>
        * {
          margin: 0;
          box-sizing: border-box;
        } 
        
        #playerNames,
        #boardButtons,
        #gameSettings {
          justify-content: center;
          gap: 3rem;
          align-items: center;
          margin-left: 20px;
        }

        #flex {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        #bestOf,
        .changePlayerName label {
          width: 15vw;
          height: 2.5rem;
          min-width: 75px;
          border-radius: 5px;
        }

        .changePlayerName input {
          width: 15vw;
          height: 2.5rem;
          min-width: 75px;
          border-radius: 5px;
          padding-left: 0.5em;
        }

        .changePlayerName label {
          height: 2.5rem;
          background-color: var(--die-bg-color)
        }
        
        button {
          width: 100px;
          height: 2.5rem;
          border-radius: 5px;
          margin-bottom: 1rem;
          border: none;
          transition: 0.4s;
        }

        button:hover {
          background-color: var(--die-held-color);
          transform: scale(1.05, 1.05);
        }

      </style>
  
      <div id="flex">
        <div id="playerNames">
          <div class="changePlayerName">
            <label for="player1Name">Player 1</label>
            <input type="text" name="player1Name" id="player1Name" value="player1">
          </div>
          <div class="changePlayerName">
            <label for="player2Name">Player 2</label>
            <input type="text" name="player2Name" id="player2Name" value="player2">
          </div>
        </div>

        <div id="gameSettings">
          <select id="bestOf">
            <option value="3">Best of 3</option>
            <option value="5">Best of 5</option>
            <option value="7">Best of 7</option>
          </select>

          <div id="checkboxContainer">
            <input type="checkbox" id="include-straight" name="include-straight" value="true" checked>
            <label for="include-straight">Include Straight</label>
          </div>
        </div>
        
        <div id="boardButtons"> 
          <button id="startRound">Start round</button>
          <button id="rollDice">Roll dice</button>
        </div>
      </div>

      <slot></slot>
    `;
  }

  connectedCallback() {

    this.shadowRoot.querySelector("#startRound").addEventListener("click", ()=> {
      
      if (!this.gameStarted) {
        this.setAttribute("player1", this.shadowRoot.querySelector("#player1Name").value);
        this.setAttribute("player2", this.shadowRoot.querySelector("#player2Name").value);
        this.setAttribute("bestOf", this.shadowRoot.querySelector("#bestOf").value);
        this.setAttribute("include-straight", this.shadowRoot.querySelector("#include-straight").value)
        
        const dice = this.querySelectorAll("dice-poker-die");
        dice.forEach(die => {
            die.setDieOwner();
        });
      
      }

      if (this.roundFinished || !this.gameStarted) {
        this.changePlayer();
        this.startRound();
      }
      
    });



    this.addEventListener("dp:die-held-changed", (eventDetails)=> {
      this.held[eventDetails.detail.dieId -1] = eventDetails.detail.held;
      
    });

    this.shadowRoot.querySelector("#rollDice").addEventListener("click", ()=> {
      if (this.roundFinished || !this.gameStarted) {
        return;
      }
      this.rollAll(false);

      this.remainingRolls--;
      if (this.remainingRolls == 0) {
        this.changePlayer();
      }

    });


    this.addEventListener("dp:die-rolled", (eventDetails)=> {
      this.faces[eventDetails.detail.dieId -1] = eventDetails.detail.face;
    });

  }

  disconnectedCallback() {
    this.removeEventListener("dp:die-held-changed");
    this.removeEventListener("dp:die-rolled");
  }

  changePlayer() {

    if (this.gameStarted == false || this.roundFinished == true) {
      this.player = this.getAttribute("player1");
    } else {
      this.remainingRolls = 3;
      this.countingFaces();
      this.evaluateHand();
      
      if (this.player == this.getAttribute("player1")) {
        this.player = this.getAttribute("player2");
        this.getFacesBeforeRegularRoll();
      } else {
        this.roundFinished = true;
        this.getFacesBeforeRegularRoll();
        this.compareHand();
        this.resetGameData();
      }
    }

    let displayedRemainingRolls;
    if (this.roundFinished){
      displayedRemainingRolls = 0;
    }else{
      displayedRemainingRolls = this.remainingRolls
    }

    const turnChanged = new CustomEvent("dp:turn-changed", {
      bubbles: true,
      composed: true,
      detail: {
        player: this.player,
        remainingRolls: displayedRemainingRolls
      }
    });

    this.dispatchEvent(turnChanged);
  }

  getFacesBeforeRegularRoll(){
    const dices = this.querySelectorAll("dice-poker-die");

    dices.forEach(die => {
      if (die.getAttribute("owner") == this.player) {
        this.faces[die.getAttribute("die-id") - 1] = die.getAttribute("face")
      }
    });

  }

  countingFaces() {
    let faceFrequency = {
      "A": 0,
      "K": 0,
      "Q": 0,
      "J": 0, 
      "8": 0,
      "7": 0 
    } 

    this.faces.forEach((face)=> {
      faceFrequency[face]++;
    });

    if (this.player == this.getAttribute("player1")) {
      this.player1hand = faceFrequency;
    } else {
      this.player2hand = faceFrequency;
    }

  }

  evaluateHand() {
    let player1 = true;

    if (this.player == this.getAttribute("player1")) {
      player1 = true;
    } else {
      player1 = false;
    }

    let handType = [];
    let sortFaces;
  
    if (player1) {
      sortFaces = Object.entries(this.player1hand); 
      console.log(sortFaces, "player 1");
    } else {
      sortFaces = Object.entries(this.player2hand); 
      console.log(sortFaces, "player 2");
    }
    sortFaces.sort((a, b) => b[1] -a[1]); 

    for (let i = 0; i < sortFaces.length; i++) {
      if (sortFaces[i][1] == 0) {
        sortFaces.splice(i, sortFaces.length);
      }
    }

    switch(sortFaces.length) {
      case 1:
        handType = ["Repóker"];
        break;
      case 2:
        if (sortFaces[0][1] == 4) {
          handType = ["Póker"];
        }else{
          handType = ["Full"];
        }
        break;
      case 3:
        if (sortFaces[0][1] == 3) {
          handType = ["Trío"];
        }else{
          handType = ["Double Pareja"];
        }
        break;
      case 4:
        handType = ["Pareja"];
        break;
      case 5:
        if (this.getAttribute("include-straight") == "false"){
          handType = ["Carta Alta"];
          break;
        }

        const escalera1 = ["A", "K", "Q", "J", "8"];
        const escalera2 = ["K", "Q", "J", "8", "7"];

        const escaleraTrue1 = escalera1.every(keyValuePair => 
          sortFaces.some(face =>
            face[0] === keyValuePair
          )
        );
        const escaleraTrue2 = escalera2.every(keyValuePair => 
          sortFaces.some(face =>
            face[0] === keyValuePair
          )
        );

        if (escaleraTrue1 || escaleraTrue2) {
          handType = ["Escalera"];
        } else {
          handType = ["Carta Alta"];
        }
        break;

      default:
        null;
    }

    handType.push(sortFaces);

    if (player1) {
      this.player1HandType = handType;
    } else {
      this.player2HandType = handType;
    }

  }

  compareHand() {
    let winner;
    let winnerDescription;

    const handTypeRanks = {
      "Repóker" : 1,
      "Póker": 2,
      "Full": 3,
      "Escalera": 4,
      "Trío": 5, 
      "Double Pareja": 6,
      "Pareja": 7,
      "Carta Alta": 8
    }

    const faceValue = {
      "A": 6,
      "K": 5,
      "Q": 4,
      "J": 3, 
      "8": 2,
      "7": 1 
    } 

    console.log("Compare hand", this.player1HandType[0], this.player2HandType[0])
    
    if (this.player1HandType[0] == this.player2HandType[0]) {
      const player1Dice = this.player1HandType[1];
      const player2Dice = this.player2HandType[1];

      for (let i = 0; i < player1Dice.length; i++) {

        const player1Value = faceValue[player1Dice[i][0]];
        const player2Value = faceValue[player2Dice[i][0]];
      
        if (player1Value > player2Value) {
          winner = this.getAttribute("player1");
          winnerDescription = "having higher dice values (" + player1Dice[i][0] + " - " + player2Dice[i][0] + ")"
          this.roundEnded(winner, winnerDescription);
          return;
        } else {
          winner = this.getAttribute("player2");
          winnerDescription = "having higher dice values (" + player2Dice[i][0] + " - " + player1Dice[i][0] + ")"
          this.roundEnded(winner, winnerDescription);
          return;
        }

      }
    

    } else {

      if (handTypeRanks[this.player1HandType[0]] < handTypeRanks[this.player2HandType[0]]){
        winner = this.getAttribute("player1");
        winnerDescription = "higher hand " + this.player1HandType[0]
      }else{
        winner = this.getAttribute("player2");
        winnerDescription = "higher hand " + this.player2HandType[0]
      }
      this.roundEnded(winner, winnerDescription);
    }


  }

  roundEnded(winnerOfRound, winningDescription) {
    const roundDecided = new CustomEvent("dp:round-decided", {
      bubbles: true,
      composed: true,
      detail: {
        winner: winnerOfRound,
        hands: {
          player1: {
            faces: this.player1HandType[1],
            handType: this.player1HandType[0]
          },
          player2: {
            faces: this.player2HandType[1],
            handType: this.player2HandType[0]
          }
        },
        breakdown: "Round winner: " +winnerOfRound + " wins with " + winningDescription
      }
    });
    
    if (this.getAttribute("player1") == winnerOfRound){
      this.player1Score ++;
      this.checkChampion(this.player1Score, winnerOfRound);
    } else {
      this.player2Score ++;
      this.checkChampion(this.player2Score, winnerOfRound);
    }
    
    this.dispatchEvent(roundDecided);
  }
  

  checkChampion(winnerCurrentScore, winnerOfRound) {
    const winningCondition = Math.ceil(this.getAttribute("bestof") / 2);

    if (winnerCurrentScore == winningCondition) {

      this.currentRound = 0;
      this.gameStarted = false;
      this.roundFinished = true;
      this.resetGameData();

      const matchDecided = new CustomEvent("dp:match-decided", {
        bubbles: true,
        composed: true,
        detail: {
          champion: winnerOfRound,
          scoreline: {
            player1: this.player1Score, 
            player2: this.player2Score 
          }
        }
      });
      this.dispatchEvent(matchDecided);
    }
  }

  resetGameData() {
    const dices = this.querySelectorAll("dice-poker-die");
    dices.forEach(die => {
      die.heldButtonChange(true);
    });
    
    if (this.roundFinished){
      this.player1hand;
      this.player2hand;
      this.player1HandType;
      this.player2HandType;
    }

  }

  rollAll(roundStart) {

    const dice = this.querySelectorAll("dice-poker-die");

    if (roundStart){
      dice.forEach(die => {
        die.roll();
      });
    }else{
      dice.forEach(die => {
        if (die.getAttribute("owner") == this.player) {
          die.roll();
        }
      });

      const rollExecuted = new CustomEvent("dp:roll-executed", {
        bubbles: true,
        composed: true,
        detail: {
          player: this.player,
          faces: this.faces,
          held: this.held
        }
      });

      this.dispatchEvent(rollExecuted);
    }

  }

  startRound(){
    this.currentRound ++;
    if (!this.gameStarted && !this.roundFinished){
      this.gameStarted = true;
    }

    this.player = this.getAttribute("player1");
    this.roundFinished = false;
    this.rollAll(true);

    const startRound = new CustomEvent("dp:round-start", {
      bubbles: true,
      composed: true,
      detail: {
        round: this.currentRound
      }
    });

    const dice = this.querySelectorAll("dice-poker-die");

    for(let i = 0; i < dice.length; i++) {

      if (dice[i].getAttribute("owner") === this.player){
        let dieId = dice[i].getAttribute("die-id");
        let dieFace = dice[i].getAttribute("face");

        this.faces[dieId -1] = dieFace;
      }

    }

    this.dispatchEvent(startRound);
  }

}

customElements.define('dice-poker-board', DicePokerBoard);