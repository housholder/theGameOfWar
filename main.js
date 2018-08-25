var CryptoJS = require("crypto-js");
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbName = "warGames";

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/warGames');

// console.log(originalDeck.toString())

//--------------------------Input from GUI---------------------------------

numberOfCards = 52;



//--------------------------- GLOBALS -------------------------------------
//Set original Deck as imutable
const originalDeck = deckGenisus(numberOfCards)

//-------------------------------------------------------------------------

//-------------------------- Database -------------------------------------

// function addDocMongo(myobj, collection, dbName) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbName);
//         //var myobj = { name: "Company Inc", address: "Highway 37" };
//         dbo.collection(collection).insertOne(myobj, function (err, res) {
//             if (err) throw err;
//             console.log("1 document inserted");
//             db.close();
//         });
//     });
// }

// // function findLastIndex(collection,dbName){
// //     MongoClient.connect(url, function(err, db) {
// //         if (err) throw err;
// //         var dbo = db.db(dbName);
// //         dbo.collection(collection)
// //         .find({}, { _id: 0}).toArray(function(err, result) {
// //             if (err) throw err;
// //             console.log(result);
// //             db.close();
// //           });
// //         });

// // }
// // findLastIndex("decks",dbName)

// function findLastIndex(collection, dbName) {
//     MongoClient.connect(url, function (err, db) {
//         if (err) throw err;
//         var dbo = db.db(dbName);
//         dbo.collection(collection)
//             .find({})
//             .sort({ deckIndex: -1 })
//             .limit(1).toArray(function (err, result) {
//                 if (err) throw err;
//                 console.log(result);
//                 return result;
//                 db.close();
//             });
//     });

// }
// findLastIndex("decks", dbName)

//mongoose


//-------------------------------- DB Object ---------------------------------

function newDeckObject() {
    myobj = {}
    myobj.deckIndex = this.deckIndex
    myobj.hashDeck = this.hashDeck
    myobj.handAs = this.handAs
    myobj.hashHandAs = this.hashHandAs.toString()
    myobj.handBs = this.handBs
    myobj.hashHandBs = this.hashHandBs.toString()
    myobj.playableA = this.playableA
    myobj.hashHandA = this.hashHandA
    myobj.playableB = this.playableB
    myobj.hashHandB = this.hashHandB
    myobj.handCounter = this.handCounter
    myobj.warCounter = this.warCounter
    myobj.gameWinner = this.gameWinner
    myobj.sumHandA = (this.playableA.reduce((a, b) => a + b, 0))
    myobj.sumHandB = (this.playableB.reduce((a, b) => a + b, 0))
    myobj.acesHandA = (this.playableA.filter(i => i == 13).length)
    myobj.acesHandB = (this.playableB.filter(i => i == 13).length)
    //NOTE: this is the start of verifing the function, it is not what
    //what is should do but lays the ground work. it is verifing the 
    // state of the data, next is the state of the operations of the
    // object, function, class, or other set of code.
    // question is.. how do you obsure what needs to be and let lose
    // the vars you need to make the hash?
    myobj.documentHash = CryptoJS.SHA256(myobj.toString()).toString()

    // console.log(myobj)
    // console.log(typeof myobj.playableA )
    // console.log(typeof myobj.handAs )
    // console.log('-------------------------------------------------')
    return myobj
}


//------------------------------ GAME FUNCTIONS ---------------------------
//Create the Original Deck
function deckGenisus(numberOfCards) {
    this.deck = []
    for (i = 1; i <= numberOfCards; i++) {
        this.deck.push(i);
    }
    return this.deck;
}


function randomizeDeck() {
    this.shuffledDeck = originalDeck.sort(function (a, b) {
        return 0.5 - Math.random()
    });
    return this.shuffledDeck
}

//Make hands from the randomized deck
function makeHands(shuffledDeck) {
    this.handAs = []
    this.handBs = []
    x = 0
    for (i = 1; i <= ((numberOfCards) / 2); i++) {
        this.handAs.push(shuffledDeck[(x)]);
        x++;
        this.handBs.push(shuffledDeck[(x)]);
        x++;
    }
    return this.handAs;
    return this.handBs;
}

//Make hands playable
//NOTE: this operation will break the dynamic code because it is hard coded.
//NOTE: to fix add funtion for 4 suits against the number of cars and and replace
//NOTE: hard values. maybe add a funtion for the number of suits as well. BUT!
//NOTE: then code needs to be come dynamic.... a fun rewrite! no really it will be!
//NOTE: to do run switch on an if with true return value, faulse value-(cardcount/suit)
//NOTE:  and index of i++ to denote subtractions from first suit.. ill do this friday

function convertHands(handX, _callback) {
    this.handX = handX;
    this.convertedHand = []
    for (i = 1; i <= ((numberOfCards) / 2); i++) {
        if (this.handX[i - 1] >= 14 && this.handX[i - 1] <= 26) {
            this.cardValue = (this.handX[i - 1] - 13);
        } else if (this.handX[i - 1] >= 27 && this.handX[i - 1] <= 39) {
            this.cardValue = (this.handX[i - 1] - 26);
        } else if (this.handX[i - 1] >= 40 && this.handX[i - 1] <= 52) {
            this.cardValue = (this.handX[i - 1] - 39);
        } else if (this.handX[i - 1] >= 1 && this.handX[i - 1] <= 13) {
            this.cardValue = this.handX[i - 1];
        }
        this.convertedHand.push(this.cardValue);
    }
    return this.convertedHand;
    _callback();
}

/** The ruls of war from bycicle
 * 
 * THE DEAL (**complete**)
 * The deck is divided evenly, with each player receiving 26 cards, dealt one 
 * at a time, face down. Anyone may deal first. Each player places his stack 
 * of cards face down, in front of him.
 * 
 * THE PLAY
 * Each player turns up a card at the same time and the player with the higher 
 * card takes both cards and puts them, face down, on the bottom of his stack.
 * 
 * THE WAR (The PLAY is the challenge)
 * If the cards are the same rank, it is War. Each player turns up one card 
 * face down and one card face up. The player with the higher cards takes both 
 * piles (six cards). If the turned-up cards are again the same rank, each 
 * player places another card face down and turns another card face up. 
 * The player with the higher card takes all 10 cards, and so on.
 * 
 * NOTE: there is no information on some important rules so I will set them 
 * now and later they can be options in the game statistically they are huge!
 * 
 * THE PLAY RULE *1
 * The issue of going first is not about starting the game, but how the cards
 * are placed back into the Hand, currently the winners card goes back first
 * followed by losing card behind it.
 * Options later can be added, such as shuffle, always A then B, or Always B 
 * then A; these card orders effect the game stats, with shuffle giving a 
 * huge dynamic analytics.
 * 
 */

//NOTE: the DEAL --------------- is complete!
//NOTE: the PLAY --------------- is complete!
//NOTE: the WAR ---------------- is complete!
//NOTE: the PLAY RULE *1 ------- is complete!
//NOTE: the WAR less then x cards!  complete! warCardBurnCount()
//NOTE: the GAME is COMPLETE --- COMPLETED
//NOTE: Time to add some fun


function coinToss() {
    if (Math.random() < 0.50) {
        this.coinValue = Boolean(1);
    } else {
        this.coinValue = Boolean(0);
    }
    return this.coinValue
}

function challenege(cardA, cardB) {
    if (cardA > cardB) {
        this.handWinner = 'A'
    } else if(cardA == cardB){   //TODO:NOTE: Test if a==b is sneeking thru
        console.log('ERROR A==B is getting to challenge')
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        //NOTE: can change the war challenege to here
    }else {
        this.handWinner = 'B'
    }
    return this.handWinner
}

function checkWar(cardA, cardB) {
    if (cardA == cardB) {
        this.isThereWar = Boolean(1)
    } else {
        this.isThereWar = Boolean(0)
    }
    return this.isThereWar
}

function warCardBurnCount(hand) {
    if (hand.length >= 4) {
        this.burnCount = 3
    } else if (hand.length >= 3) {
        this.burnCount = 2
    } else if (hand.length >= 2) {
        this.burnCount = 1
    } else if (hand.length >= 1) {
        this.burnCount = 0
    } else if (hand.length >= 0) {
        this.burnCount = -1
    }
    return this.burnCount
}

function gameWinner(handA, handB) {
    if (handA.length == 0) {
        this.gameWinner = 'B'
    } else if (handB.length == 0) {
        this.gameWinner = 'A'
    }
    return this.gameWinner
}

function contiunePlay(playableHand1, playableHand2) {
    this.handA = playableHand1
    this.handB = playableHand2
    if (this.handA.length > 0 && this.handB.length > 0) {
        this.gameContinue = Boolean(1)
    } else {
        this.gameContinue = Boolean(0)
        gameWinner(this.handA, this.handB)
    }
    return this.gameContinue
}

function playTheGame(playable_HandA, playable_HandB) {
    this.handA = []
    this.handB = []
    this.handCounter = 0
    this.warCounter = 0
    this.handA = playable_HandA
    this.handB = playable_HandB
    this.cardA = []
    this.cardB = []
    contiunePlay(this.handA, this.handB)
    for (i = 1; i == (this.gameContinue); contiunePlay(this.handA, this.handB)) {
        this.handCounter++
        this.cardPileA = []
        this.cardPileB = []
        this.cardA.push(this.handA[0])
        this.handA.shift();
        this.cardB.push(this.handB[0])
        this.handB.shift();
        checkWar(this.cardA.toString(), this.cardB.toString());
        for (w = 1; w == (this.isThereWar); checkWar(this.cardA.toString(), this.cardB.toString())) {
            //allows a loop if there is war multiple times
            this.warCounter++
            if (this.handA.length >= 1 && this.handB.length >= 1) {
                this.cardPileA.push(this.cardA[0]);
                this.cardA.pop();
                warCardBurnCount(this.handA);
                for (i2 = 1; i2 <= this.burnCount; i2++) {
                    this.cardPileA.push(this.handA[0]);
                    this.handA.shift();
                }
                this.cardA.push(this.handA[0]);
                this.handA.shift();
                this.cardPileB.push(this.cardB[0]);
                this.cardB.pop();
                warCardBurnCount(this.handB);
                for (i3 = 1; i3 <= this.burnCount; i3++) {
                    this.cardPileB.push(this.handB[0]);
                    this.handB.shift();
                }
                this.cardB.push(this.handB[0]);
                this.handB.shift();
            } else {//TODO: need to check the end of this, there is a hang up here
                break   //it is probably war a==b then a or b dont have the cards to contiune 
            }           //need to make sure game ends here if there isnt a card for war.

            //console.log(this.handCounter)
        }
        challenege(this.cardA, this.cardB)
        this.cardPileA.push(this.cardA[0]);
        this.cardPileB.push(this.cardB[0]);
        //TODO:NOTE: this is where a randomizer can be placed to shuffle the cards as an option. 
        if (this.handWinner == 'A') {
            this.handA = this.handA.concat(this.cardPileA.concat(this.cardPileB))
        } else if (this.handWinner == 'B') {
            this.handB = this.handB.concat(this.cardPileB.concat(this.cardPileA))
        }
        this.cardA.pop();
        this.cardB.pop();
        // console.log('Hand A - '+this.handA.toString())
        // console.log('Hand B - '+this.handB.toString())
    }
    console.log('The Game Winner is Deck ' + this.gameWinner)
    return this.handCounter, this.gameWinner, this.warCounter
}

function storeOriginalData() {
    //TODO: move db add function here
}


function createDeck(numberOfDecks) {
    deckIndex = 0
    startTime = Date.now //NOTE: not using this for anything right now!
    for (i1 = 1; i1 <= numberOfDecks; i1++) {
        collection = "decks";
        deckIndex++;
        this.deckIndex = deckIndex;
        randomizeDeck();
        this.hashDeck = CryptoJS.SHA256(this.shuffledDeck.toString()).toString()
        makeHands(this.shuffledDeck);
        convertHands(this.handAs)
        this.hashHandAs = CryptoJS.SHA256(this.handAs.toString()).toString()
        this.hashHandBs = CryptoJS.SHA256(this.handBs.toString()).toString()
        this.playableA = this.convertedHand
        this.hashHandA = CryptoJS.SHA256(this.playableA.toString()).toString()
        convertHands(this.handBs)
        this.playableB = this.convertedHand
        this.hashHandB = CryptoJS.SHA256(this.playableB.toString()).toString()
        playTheGame(this.playableA, this.playableB);
        newDeckObject() // the database object
        addDocMongo(myobj, collection, dbName)

    }

};

//------------------------------ Analyitics ---------------------------

//------------------------------ Block Chain ---------------------------

//------------------------------ Final Wrapper ---------------------------
// THIS IS SO MUCH FUN!

function runMe(numberOfDecks){
    this.deckIndex = 0
    this.startTime = Date.now //NOTE: not using this for anything right now!
    for (i1 = 1; i1 <= numberOfDecks; i1++) {
        collection = "decks";
        deckIndex++;
        this.deckIndex = deckIndex;
        randomizeDeck();
        this.hashDeck = CryptoJS.SHA256(this.shuffledDeck.toString()).toString()
        makeHands(this.shuffledDeck);
        convertHands(this.handAs)
        this.hashHandAs = CryptoJS.SHA256(this.handAs.toString()).toString()
        this.hashHandBs = CryptoJS.SHA256(this.handBs.toString()).toString()
        this.playableA = this.convertedHand
        this.hashHandA = CryptoJS.SHA256(this.playableA.toString()).toString()
        convertHands(this.handBs)
        this.playableB = this.convertedHand
        this.hashHandB = CryptoJS.SHA256(this.playableB.toString()).toString()



        console.log('Shuffled Deck - ' + this.shuffledDeck.toString() + ' lenght - ' + this.shuffledDeck.length)    //TODO:KILL bc verified
        // console.log('Hash Shuffled Deck - '+this.hashDeck.toString())    //TODO:KILL bc verified
        console.log('HandA - ' + this.handAs.toString() + ' lenght - ' + this.handAs.length) //TODO:KILL bc verified
        console.log('HandB - ' + this.handBs.toString() + ' lenght - ' + this.handBs.length) //TODO:KILL bc verified
        console.log('Playable HandA - ' + this.playableA.toString() + ' lenght - ' + this.playableA.length)           //TODO:KILL bc verified
        // console.log('Hash HandA - '+this.hashHandA.toString())    //TODO:KILL bc verified
        console.log('Playable HandB - ' + this.playableB.toString() + ' lenght - ' + this.playableB.length)           //TODO:KILL bc verified
        // console.log('Hash HandB - '+this.hashHandB.toString())    //TODO:KILL bc verified
        //------------------ some data points to record ----------------------
        console.log('Hand A sum = ' + this.playableA.reduce((a, b) => a + b, 0))
        console.log('Hand B sum = ' + this.playableB.reduce((a, b) => a + b, 0))
        console.log('Number of Aces Hand A = ' + this.playableA.filter(i => i == 13).length)
        console.log('Number of Aces Hand B = ' + this.playableB.filter(i => i == 13).length)
        console.log('War Counter = ' + this.warCounter)
        console.log('Hand Counter = ' + this.handCounter)




        playTheGame(this.playableA, this.playableB);
        console.log('-------------------------------------------------')
        newDeckObject() // the database object
        addDocMongo(myobj, collection, dbName)

    }

};

// initmongodb()
// initCollection()
// createDeck(1000)
