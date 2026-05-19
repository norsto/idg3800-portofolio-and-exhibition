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
    this.currentRound = 0;
    this.player1Score = 0;
    this.player2Score = 0;

    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          box-sizing: border-box;
        }

        :host {
          display: block;
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* ===== SETTINGS BOX ===== */

        #controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: flex-end;
          justify-content: center;
          background: rgba(255,255,255,0.35);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
        }

        #playerNames {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .changePlayerName {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .changePlayerName label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #333;
        }

        .changePlayerName input {
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 0.9rem;
          width: clamp(80px, 12vw, 130px);
          background: white;
        }

        #gameSettings {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
        }

        #bestOf {
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 0.9rem;
          background: white;
          cursor: pointer;
        }

        #checkboxContainer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.5);
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
        }

        #checkboxContainer label {
          font-size: 0.85rem;
          cursor: pointer;
        }

        #include-straight {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }

        /* Start round button in settings box */
        #startRound {
          padding: 0.6rem 2rem;
          border-radius: 20px;
          border: none;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          cursor: pointer;
          transition: 0.3s;
          white-space: nowrap;
          font-weight: 600;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          background: linear-gradient(135deg, #0fad2c, #1a3a17);
          color: #f1fff0;
        }

        #startRound:hover {
          transform: scale(1.07);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          filter: brightness(1.05);
        }

        #startRound:active {
          transform: scale(0.97);
        }

        /* ===== ACTION BOX (Roll dice) ===== */

        #actionBox {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.35);
          border-radius: 10px;
          margin-bottom: 0.75rem;
        }

        #rollDice {
          padding: 0.6rem 2rem;
          border-radius: 20px;
          border: none;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          cursor: pointer;
          transition: 0.3s;
          white-space: nowrap;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 2px 8px rgba(248,117,170,0.4);
          background: linear-gradient(135deg, #ff7db1, #fd3ea1);
          color: white;
        }

        #rollDice:hover {
          transform: scale(1.07);
          box-shadow: 0 4px 16px rgba(248,117,170,0.5);
          filter: brightness(1.05);
        }

        #rollDice:active {
          transform: scale(0.97);
        }

        /* ===== DICE AREA ===== */

        #diceArea {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .playerSection {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
          padding: 0.75rem;
        }

        .playerSection h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        ::slotted(.dieHolder) {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }
      </style>
  
      <div id="controls">
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
            <input type="checkbox" id="include-straight" name="include-straight" checked>
            <label for="include-straight">Include Straight</label>
          </div>
        </div>
        
        <button id="startRound">Start round</button>
      </div>

      <div id="actionBox">
        <button id="rollDice">🎲 Roll dice</button>
      </div>

      <slot></slot>
    `;
  }

  connectedCallback() {

    this.shadowRoot.querySelector("#startRound").addEventListener("click", () => {
      if (this.roundFinished || !this.gameStarted) {
        this.startRound();
      }
    });

    this.addEventListener("dp:die-held-changed", (eventDetails) => {
      this.held[eventDetails.detail.dieId - 1] = eventDetails.detail.held;
    });

    this.shadowRoot.querySelector("#rollDice").addEventListener("click", () => {
      if (this.roundFinished || !this.gameStarted) return;
      if (this.remainingRolls <= 0) return;

      this.rollAll(false);
      this.remainingRolls--;

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

      if (this.remainingRolls === 0) {
        this.endPlayerTurn();
      }
    });

    this.addEventListener("dp:die-rolled", (eventDetails) => {
      this.faces[eventDetails.detail.dieId - 1] = eventDetails.detail.face;
    });
  }

  disconnectedCallback() {
    this.removeEventListener("dp:die-held-changed");
    this.removeEventListener("dp:die-rolled");
  }

  startRound() {
    this.currentRound++;
    this.gameStarted = true;
    this.roundFinished = false;
    this.player1HandType = null;
    this.player2HandType = null;

    this.setAttribute("player1", this.shadowRoot.querySelector("#player1Name").value);
    this.setAttribute("player2", this.shadowRoot.querySelector("#player2Name").value);
    this.setAttribute("bestof", this.shadowRoot.querySelector("#bestOf").value);
    this.setAttribute("include-straight", this.shadowRoot.querySelector("#include-straight").checked ? "true" : "false");

    const dice = this.querySelectorAll("dice-poker-die");
    dice.forEach(die => die.setDieOwner());
    dice.forEach(die => die.heldButtonChange(true));
    dice.forEach(die => die.roll());

    this.player = this.getAttribute("player1");
    this.remainingRolls = 3;
    this.faces = ["", "", "", "", ""];

    const startRound = new CustomEvent("dp:round-start", {
      bubbles: true,
      composed: true,
      detail: { round: this.currentRound }
    });
    this.dispatchEvent(startRound);

    const turnChanged = new CustomEvent("dp:turn-changed", {
      bubbles: true,
      composed: true,
      detail: {
        player: this.player,
        remainingRolls: this.remainingRolls
      }
    });
    this.dispatchEvent(turnChanged);
  }

  rollAll(rollEveryone = false) {
    const dice = this.querySelectorAll("dice-poker-die");
    dice.forEach(die => {
      if (rollEveryone || die.getAttribute("owner") === this.player) {
        die.roll();
      }
    });
  }

  endPlayerTurn() {
    const dice = this.querySelectorAll("dice-poker-die");
    dice.forEach(die => {
      if (die.getAttribute("owner") === this.player) {
        this.faces[die.getAttribute("die-id") - 1] = die.getAttribute("face");
      }
    });

    this.countingFaces();
    this.evaluateHand();

    if (this.player === this.getAttribute("player1")) {
      this.player = this.getAttribute("player2");
      this.remainingRolls = 3;
      this.faces = ["", "", "", "", ""];

      dice.forEach(die => {
        if (die.getAttribute("owner") === this.player) {
          die.heldButtonChange(true);
        }
      });

      const turnChanged = new CustomEvent("dp:turn-changed", {
        bubbles: true,
        composed: true,
        detail: {
          player: this.player,
          remainingRolls: this.remainingRolls
        }
      });
      this.dispatchEvent(turnChanged);

    } else {
      this.roundFinished = true;
      this.compareHand();
    }
  }

  countingFaces() {
    let faceFrequency = { "A": 0, "K": 0, "Q": 0, "J": 0, "8": 0, "7": 0 };
    this.faces.forEach(face => {
      if (faceFrequency[face] !== undefined) faceFrequency[face]++;
    });

    if (this.player === this.getAttribute("player1")) {
      this.player1hand = faceFrequency;
    } else {
      this.player2hand = faceFrequency;
    }
  }

  evaluateHand() {
    const isPlayer1 = this.player === this.getAttribute("player1");
    const hand = isPlayer1 ? this.player1hand : this.player2hand;

    let sortFaces = Object.entries(hand).filter(([, count]) => count > 0);
    sortFaces.sort((a, b) => b[1] - a[1]);

    let handType;

    switch (sortFaces.length) {
      case 1: handType = "Repóker"; break;
      case 2: handType = sortFaces[0][1] === 4 ? "Póker" : "Full"; break;
      case 3: handType = sortFaces[0][1] === 3 ? "Trío" : "Double Pareja"; break;
      case 4: handType = "Pareja"; break;
      case 5: {
        if (this.getAttribute("include-straight") === "false") {
          handType = "Carta Alta";
          break;
        }
        const escalera1 = ["A", "K", "Q", "J", "8"];
        const escalera2 = ["K", "Q", "J", "8", "7"];
        const faces = sortFaces.map(f => f[0]);
        if (escalera1.every(f => faces.includes(f)) || escalera2.every(f => faces.includes(f))) {
          handType = "Escalera";
        } else {
          handType = "Carta Alta";
        }
        break;
      }
      default: handType = "Carta Alta";
    }

    if (isPlayer1) {
      this.player1HandType = [handType, sortFaces];
    } else {
      this.player2HandType = [handType, sortFaces];
    }
  }

  compareHand() {
    const handTypeRanks = {
      "Repóker": 1, "Póker": 2, "Full": 3, "Escalera": 4,
      "Trío": 5, "Double Pareja": 6, "Pareja": 7, "Carta Alta": 8
    };
    const faceValue = { "A": 6, "K": 5, "Q": 4, "J": 3, "8": 2, "7": 1 };

    const p1Type = this.player1HandType[0];
    const p2Type = this.player2HandType[0];
    const p1Rank = handTypeRanks[p1Type];
    const p2Rank = handTypeRanks[p2Type];

    let winner, winnerDescription;

    if (p1Rank !== p2Rank) {
      winner = p1Rank < p2Rank ? this.getAttribute("player1") : this.getAttribute("player2");
      winnerDescription = "higher hand " + (p1Rank < p2Rank ? p1Type : p2Type);
      this.roundEnded(winner, winnerDescription);
      return;
    }

    const p1Dice = this.player1HandType[1];
    const p2Dice = this.player2HandType[1];

    for (let i = 0; i < Math.min(p1Dice.length, p2Dice.length); i++) {
      const p1Val = faceValue[p1Dice[i][0]];
      const p2Val = faceValue[p2Dice[i][0]];

      if (p1Val > p2Val) {
        winner = this.getAttribute("player1");
        winnerDescription = `higher die (${p1Dice[i][0]} vs ${p2Dice[i][0]})`;
        this.roundEnded(winner, winnerDescription);
        return;
      } else if (p2Val > p1Val) {
        winner = this.getAttribute("player2");
        winnerDescription = `higher die (${p2Dice[i][0]} vs ${p1Dice[i][0]})`;
        this.roundEnded(winner, winnerDescription);
        return;
      }
    }

    winner = this.getAttribute("player1");
    winnerDescription = "tie — player 1 wins by default";
    this.roundEnded(winner, winnerDescription);
  }

  roundEnded(winnerOfRound, winningDescription) {
    const roundDecided = new CustomEvent("dp:round-decided", {
      bubbles: true,
      composed: true,
      detail: {
        winner: winnerOfRound,
        hands: {
          player1: { faces: this.player1HandType[1], handType: this.player1HandType[0] },
          player2: { faces: this.player2HandType[1], handType: this.player2HandType[0] }
        },
        breakdown: `Round winner: ${winnerOfRound} wins with ${winningDescription}`
      }
    });

    if (this.getAttribute("player1") === winnerOfRound) {
      this.player1Score++;
      this.checkChampion(this.player1Score, winnerOfRound);
    } else {
      this.player2Score++;
      this.checkChampion(this.player2Score, winnerOfRound);
    }

    this.dispatchEvent(roundDecided);
  }

  checkChampion(winnerCurrentScore, winnerOfRound) {
    const winningCondition = Math.ceil(this.getAttribute("bestof") / 2);

    if (winnerCurrentScore >= winningCondition) {
      const finalScore = {
        player1: this.player1Score,
        player2: this.player2Score
      };

      this.currentRound = 0;
      this.gameStarted = false;
      this.player1Score = 0;
      this.player2Score = 0;

      const matchDecided = new CustomEvent("dp:match-decided", {
        bubbles: true,
        composed: true,
        detail: {
          champion: winnerOfRound,
          scoreline: finalScore
        }
      });
      this.dispatchEvent(matchDecided);
    }
  }
}

customElements.define('dice-poker-board', DicePokerBoard);