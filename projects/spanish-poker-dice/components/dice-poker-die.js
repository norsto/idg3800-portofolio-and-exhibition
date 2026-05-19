class DicePokerDie extends HTMLElement {
  static dieId = 1;
  static dieCounter = 0;
  static player1 = true;
  static dieFace = ["A", "K", "Q", "J", "8", "7"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this.shadowRoot.innerHTML = `
      <style>
        * {
          margin: 0;
          box-sizing: border-box;
        }

        .dieContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        /* Die face */
        .die {
          display: flex;
          background-color: var(--die-bg-color, #FDEDED);
          height: clamp(55px, 10vw, 90px);
          width: clamp(55px, 10vw, 90px);
          border: 3px solid var(--die-border-color, #F875AA);
          border-radius: 10px;
          justify-content: center;
          align-items: center;
          transition: background-color 0.2s;
        }

        :host([held="true"]) .die {
          background-color: var(--die-held-color, #F875AA);
          border-color: #c4006b;
        }

        .dieFace {
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: bold;
          color: var(--die-face-black, #000);
          line-height: 1;
        }

        .redFace {
          color: var(--die-face-red, #8C1007);
        }

        /* Hold button — default state */
        .holdDie {
          width: clamp(55px, 10vw, 90px);
          padding: 0.3rem 0;
          border-radius: 20px;
          border: none;
          font-size: clamp(0.65rem, 1.2vw, 0.78rem);
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.12);
          background: linear-gradient(135deg, #0fad2c, #1a3a17);
          color: #f1fff0;
          white-space: nowrap;
        }

        /* Release button — active state */
        :host([held="true"]) .holdDie {
          background: linear-gradient(135deg, #ff7db1, #fd3ea1);
          color: white;
          box-shadow: 0 2px 5px rgba(248,117,170,0.35);
        }

        .holdDie:hover {
          transform: scale(1.08);
          filter: brightness(1.05);
          box-shadow: 0 4px 10px rgba(0,0,0,0.18);
        }

        .holdDie:active {
          transform: scale(0.96);
        }
      </style>
  
      <div class="dieContainer">
        <div class="die">
          <p class="dieFace"></p>
        </div>
        <button class="holdDie">hold</button>
      </div>
    `;
  }

  connectedCallback() {
    this.giveId();
    this.shadowRoot.querySelector(".holdDie").addEventListener("click", () => {
      this.heldButtonChange(false);
    });
  }

  disconnectedCallback() {}

  roll() {
    if (this.getAttribute("held") == "true") return;

    const randomDieFace = Math.floor(Math.random() * DicePokerDie.dieFace.length);
    const face = DicePokerDie.dieFace[randomDieFace];

    this.setAttribute("face", face);

    const faceEl = this.shadowRoot.querySelector(".dieFace");
    faceEl.textContent = face;

    if (["A", "K", "8"].includes(face)) {
      faceEl.classList.add("redFace");
    } else {
      faceEl.classList.remove("redFace");
    }

    this.dispatchEvent(new CustomEvent("dp:die-rolled", {
      bubbles: true,
      composed: true,
      detail: {
        dieId: this.getAttribute("die-id"),
        face: face,
        owner: this.getAttribute("owner")
      }
    }));
  }

  giveId() {
    this.setAttribute("die-id", DicePokerDie.dieId);
    DicePokerDie.dieId++;

    if (DicePokerDie.dieId == 6) {
      DicePokerDie.dieId = 1;
      DicePokerDie.player1 = false;
    }
  }

  setDieOwner() {
    let owner;
    DicePokerDie.dieCounter++;

    if (DicePokerDie.dieCounter < 6) {
      owner = this.parentElement.parentElement.getAttribute("player1");
    } else {
      owner = this.parentElement.parentElement.getAttribute("player2");
    }

    if (DicePokerDie.dieCounter >= 12) {
      DicePokerDie.dieCounter = 0;
    }

    this.setAttribute("owner", owner);
  }

  heldButtonChange(roundReset) {
    const btn = this.shadowRoot.querySelector(".holdDie");

    if (roundReset) {
      this.setAttribute("held", "false");
      btn.textContent = "hold";
    } else {
      if (this.getAttribute("held") === "true") {
        this.setAttribute("held", "false");
        btn.textContent = "hold";
      } else {
        this.setAttribute("held", "true");
        btn.textContent = "release";
      }
    }

    this.dispatchEvent(new CustomEvent("dp:die-held-changed", {
      bubbles: true,
      composed: true,
      detail: {
        dieId: this.getAttribute("die-id"),
        held: this.getAttribute("held"),
        owner: this.getAttribute("owner")
      }
    }));
  }
}

customElements.define('dice-poker-die', DicePokerDie);