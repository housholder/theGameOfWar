var CryptoJS = require("crypto-js");


function primary(count,numberOfDecks){ //count is the number of cards in the deck
    for(i=1;i<=numberOfDecks;i++){
    this.deck = [];
    for(y=1;y<=count;y++){
        this.deck.push(y)
    }
    console.log('original = '+this.deck)
    // for(i=1;i<=numberOfDecks;i++){
        this.shuffledDeck = this.deck
        this.shuffledDeck.sort(function(a,b){
            return 0.5 - Math.random()
        });
    console.log('deck '+i+' = '+this.shuffledDeck)
    this.hashDeck = CryptoJS.SHA256(this.shuffledDeck.toString()).toString()
    console.log(this.hashDeck)

    this.handA = [];
    this.handB = [];
    for(x=1;x<=((count)/2);x++){
        this.handA.push(this.shuffledDeck[0]);
        this.shuffledDeck.shift();
        this.handB.push(this.shuffledDeck[0]);
        this.shuffledDeck.shift();
        
    }
    console.log('Hand A = '+this.handA)
    console.log('Hand B = '+this.handB)
    this.hashHandA = CryptoJS.SHA256(this.handA.toString()).toString()
    this.hashHandB = CryptoJS.SHA256(this.handB.toString()).toString()
    console.log('Hand A = '+this.hashHandA)
    console.log('Hand B = '+this.hashHandB)

    }
    //make hands



}
// primary(52, 1);


