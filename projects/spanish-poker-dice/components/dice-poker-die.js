class DicePokerDie extends HTMLElement {
  static dieId = 1;
  static dieCounter = 0;
  static player1 = true;
  static dieFace = ["A", "K", "Q", "J", "8", "7"];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="../assets/style.css">
      <style>
        * {
          margin: 0;
          box-sizing: border-box;
        }

        .dieContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        :host([held="true"]) .die {
          background-color: var(--die-held-color);
        }

        .dieFace {
          color: var(--die-face-black);
          font-weight: bold;
        }
        
        .redFace {
          color: var(--die-face-red);
        }
        
        .holdDie {
          width: 15vw;
          height: 2.5rem;
          min-width: 70px;
          max-width: 100px;
          min-height: 2rem;
          border-radius: 5px;
          margin-bottom: 1rem;
          border: none;
          transition: 0.4s;
        }

        .holdDie:hover {
          background-color: var(--die-held-color);
          transform: scale(1.05, 1.05);
        }

        .die {
          display: flex;
          background-color: var(--die-bg-color);
          height: 15vw;
          width: 15vw; 
          max-height: 100px;
          max-width: 100px;
          border: 3px solid #F875AA; 
          border-radius: 5px; 
          justify-content: center;
          align-items: center;
          margin: 10%;
        }
      </style>
  
      <div class="dieContainer">
        <button class="holdDie">hold die</button>
  
        <div class="die">
            <p class="dieFace"></p>
        </div> 
      </div>
    `;
  }

    /* eventually put back in style, check css document to get the updated version */


  connectedCallback() {
    this.giveId();
    this.shadowRoot.querySelectorAll(".holdDie")[0].addEventListener("click", ()=> {
      this.heldButtonChange(false);
    });
  }

  disconnectedCallback() {

  }

  roll() {
    
    if(this.getAttribute("held") == "true"){
      return;
    }
    
    const randomDieFace = Math.floor(Math.random() * DicePokerDie.dieFace.length);

    this.setAttribute("face", DicePokerDie.dieFace[randomDieFace]);

    if (["A", "K", "8"].includes(DicePokerDie.dieFace[randomDieFace])) {
      this.shadowRoot.querySelector(".dieFace").classList.add("redFace");
    } else {
      this.shadowRoot.querySelector(".dieFace").classList.remove("redFace");
    }

    this.shadowRoot.querySelectorAll(".dieFace")[0].innerHTML = DicePokerDie.dieFace[randomDieFace];
    const dieRolled = new CustomEvent("dp:die-rolled", {
      bubbles: true,
      composed: true,
      detail: {
        dieId: this.getAttribute("die-id"),
        face: this.getAttribute("face"),
        owner: this.getAttribute("owner")
      }
    });

    this.dispatchEvent(dieRolled);;
  }

  giveId(){
    this.setAttribute("die-id", DicePokerDie.dieId);
    DicePokerDie.dieId ++;

    if(DicePokerDie.dieId == 6) {
      DicePokerDie.dieId = 1;
      DicePokerDie.player1 = false;
    }
  }

  setDieOwner() {
    let owner;
    DicePokerDie.dieCounter++;

    if (DicePokerDie.dieCounter < 6){
      owner = this.parentElement.parentElement.getAttribute("player1");
    } else {
      owner = this.parentElement.parentElement.getAttribute("player2");
    }

    if (DicePokerDie.dieCounter >= 12){
      DicePokerDie.dieCounter = 0;
    }

    this.setAttribute("owner", owner);
  }

  heldButtonChange(roundReset){    
    const buttonText = this.shadowRoot.querySelectorAll(".holdDie")[0];

    if (roundReset){
        this.setAttribute("held", false);
        buttonText.innerHTML = `hold die`;
    }else{
      if(this.getAttribute("held") === "true") {
        this.setAttribute("held", false);
        buttonText.innerHTML = `hold die`;
      } else {
        this.setAttribute("held", true);
        buttonText.innerHTML = `release die`;
      }
    }


    const holdDie = new CustomEvent("dp:die-held-changed", {
      bubbles: true,
      composed: true,
      detail: {
        dieId: this.getAttribute("die-id"),
        held: this.getAttribute("held"),
        owner: this.getAttribute("owner")
      }
    });

    this.dispatchEvent(holdDie);

  }

}

customElements.define('dice-poker-die', DicePokerDie);