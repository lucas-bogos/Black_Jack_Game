let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score':0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score':0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]}, 
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'turnsOver': false,
};

//Variables and Consts

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

hitSound = new Audio ('../sounds/swish.mp3');//swish
winSound = new Audio ('../sounds/cash.mp3');//cash
lostSound = new Audio('../sounds/aww.mp3');//aww

document.querySelector('.blackjack-btn-hit').addEventListener('click', blackjackHit);
document.querySelector('.blackjack-btn-stand').addEventListener('click', dealerLogic);
document.querySelector('.blackjack-btn-deal').addEventListener('click', blackjackDeal);

//This function have objective of get ramdom card and update score
function blackjackHit() {
    if (blackjackGame['isStand'] === false){
        let card = ramdomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
        console.log(YOU['score']);
    }
}

//well, create element card 'img', then put on 'div'
function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src=`../images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

//Remove, clear elements of dealer box and your box
function blackjackDeal() {

    if (blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        
        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
            
        }

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
            
        }
        
        //when the value get '0', both one and other box
        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
        
        document.querySelector('#your-blackjack-result').style.color = 'white';
        document.querySelector('#dealer-blackjack-result').style.color = 'white';

        document.querySelector('#blackjack_result').textContent = "Let's play!";
        document.querySelector('#blackjack_result').style.color = 'black';
    }
    
}

//Get value of '0' to '13'
function ramdomCard() {
    let ramdomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][ramdomIndex];
}

//If card for 'A', so be can '1' or '11', would relative if's smaller or equivalent  to '21' or another
function updateScore(card, activePlayer) {
    if (card == 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'] [card] [1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'] [card] [1];
            } else {
                activePlayer['score'] += blackjackGame['cardsMap'] [card] [0];
                } 
            } 
    else {
        activePlayer['score'] += blackjackGame['cardsMap'] [card];
            }   
        }

//Main function for update the 'div' scoreSpan, check/look html for learn more
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

//Delay bot (COM)
function sleep(ms) {
    return new Promise (resolve => setTimeout(resolve, ms))
}

//Function logic of bot (COM)
async  function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = ramdomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(700);
        }

    if (DEALER['score'] > 15) {
        blackjackGame['turnsOver'] =true;
        let winner = computeWinner();
        showResult(winner);
        }

}

//check the winner and data for us update table
function computeWinner() {

    let winner;

    if (YOU['score'] <= 21) {
        if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins']++
            winner = YOU;
        } 
        else if (YOU['score'] < DEALER['score']) {
            blackjackGame['losses']++
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackjackGame['draws']++
        }
    } 
    
    else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackGame['losses']++
        winner = DEALER;
    } 
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++
    }

return winner;

}

/*With the function 'computeWinner' let's get [YOU] or [DEALER], then, we place on function
'showResult' for to print in screen or best in 'div': blackjack_result
*/
function showResult(winner) {

    let message, messagecolor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = 'You won!';
        messagecolor = 'green';
        winSound.play();

        } else if (winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = 'You lost!';
        messagecolor = 'red';
        lostSound.play();

        } else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = 'You dream!';
        messagecolor = 'yellow';
        }

        document.querySelector('#blackjack_result').textContent = message;
        document.querySelector('#blackjack_result').style.color = messagecolor;
        }
}