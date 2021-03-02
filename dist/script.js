let CardTypes = [
  { name: "pato", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/pato-de-pocoyo-para-colorear-912x1024.jpg" },
  { name: "eli", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/eli-pocoy%C3%B3-para-colorear-912x1024.jpg" },
  { name: "lula", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/pajaroto-pocoy%C3%B3-para-colorear-912x1024.jpg" },
  { name: "pocoyo", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/Pocoy%C3%B3-para-colorear-1-912x1024.jpg" },
  { name: "valentina", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/Valentina-pocoy%C3%B3-para-colorear-912x1024.jpg" },
  { name: "pulpo", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/pulpo-de-pocoyo-para-colorear-912x1024.jpg" },
  { name: "nina", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/Nina-de-pocoyo-para-colorear-912x1024.jpg" },
  { name: "todos", image: "https://www.dibujofacildecolorear.com/wp-content/uploads/2020/07/dibujo-de-pocoyo-y-sus-amigos-para-colorear-912x1024.jpg" }
];

let shuffleCards = () => {
  let cards = [].concat(_.cloneDeep(CardTypes), _.cloneDeep(CardTypes));
  return _.shuffle(cards);
}
new Vue({
  el: "#app",
  
  data: {
    showSplash: false,
    cards: [],
    started: false,
    startTime: 0,
    turns: 0,
    cardsshow: 6,
    flipBackTimer: null,
    timer: null,
    time: "--:--",
    score: 0
  },
  
  methods: {
    resetGame() {
      this.showSplash = false;
      CardTypes = CardTypes.splice(0,this.cardsshow);
      let cards = shuffleCards()
      console.warn(cards)
      this.turns = 0;
      this.score = 0;
      this.started = false;
      this.startTime = 0;
      
      _.each(cards, (card) => {
        card.flipped = false;
        card.found = false;
      });
      
      this.cards = cards;
    },
    
    flippedCards() {
      return _.filter(this.cards, card => card.flipped);
    },
    
    sameFlippedCard() {
      let flippedCards = this.flippedCards();
      if (flippedCards.length == 2) {
        if (flippedCards[0].name == flippedCards[1].name)
          return true;
      }
    },
    
    setCardFounds() {
      _.each(this.cards, (card) => {
        if (card.flipped)
          card.found = true;
      });
    },
    
    checkAllFound() {
      let foundCards = _.filter(this.cards, card => card.found);
      if (foundCards.length == this.cards.length)
        return true;
    },
    
    startGame() {
      this.started = true;
      this.startTime = moment();
      
      this.timer = setInterval(() => {
        this.time = moment(moment().diff(this.startTime)).format("mm:ss");
      }, 1000);
    },
    
    finishGame() {
      this.started = false;
      clearInterval(this.timer);
      let score = 1000 - (moment().diff(this.startTime, 'seconds') - CardTypes.length * 5) * 3 - (this.turns - CardTypes.length) * 5;
      this.score = Math.max(score, 0);
      this.showSplash = true;
    },
    
    flipCard(card) {
      if (card.found || card.flipped) return;
      
      if (!this.started) {
        this.startGame();
      }
      
      let flipCount = this.flippedCards().length;
      if (flipCount == 0) {
        card.flipped = !card.flipped;
      }
      else if (flipCount == 1) {
        card.flipped = !card.flipped;
        this.turns += 1;

        if (this.sameFlippedCard()) {
          // Match!
          this.flipBackTimer = setTimeout( ()=> {
            this.clearFlipBackTimer();
            this.setCardFounds();
            this.clearFlips();

            if (this.checkAllFound()) {
              this.finishGame();
            } 

          }, 200);
        }
        else {
          // Wrong match
          this.flipBackTimer = setTimeout( ()=> {
            this.clearFlipBackTimer();
            this.clearFlips();
          }, 1000);
        }
      }
    },
    
    clearFlips() {
      _.map(this.cards, card => card.flipped = false);
    },
    
    
    clearFlipBackTimer() {
      clearTimeout(this.flipBackTimer);
      this.flipBackTimer = null;
    }
  },
  
  created() {
    this.resetGame();
  }
});  
