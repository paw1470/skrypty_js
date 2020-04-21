var maxBetValue = '0.00000088'; //wartosc maksymalna zakladu
var defaultBetValue = '0.0000001';
var secondBetValue = '0.0000001';
var safeValue = '0.0000000'; //na koncie musi zostac nie mniej niz 
var maxNumberOfMultiplies = 5; //ile razy moze zwiekszyc stawke podczas rundy. jeżeli wartość będzie za mała to za często będzie tracić pieniądze ale za duża wartość może powodować duże straty
var multiplier = '2.0'; //jak chcesz ulamek to z kropka

var stopBefore = 2; //ile minut przed koncem ma przestac stawiac. (nie wiem o jakie odliczanie chodzi)
var $button = $buttonLo; //wartosci do wyboru $buttonHI i $buttonLo
var maxWaitTime = 777; // ile max moze czekac przed kliknieciem
var minWaitTime = 1; //ile minimalnie musi czekać przed kliknięciem
var clickLimit = 0; //ile razy może zagrać. 0 to nieskonczonosc.

//don't touch this variables
var floatMultiplier = 10000000;
var $buttonLo = $('#double_your_btc_bet_lo_button');
var $buttonHi = $('#double_your_btc_bet_hi_button');

//+++++++++++++MAGIC++++++++++++++++
//start values (never don't reset)
var startBalance = 0;

//full game values (don't reset)
var counterClick = 0;
var balanceTotal = 0;
var counterWinTotal = 0;
var counterLoseTotal = 0;

//reset values
var isBetAllow = true;
var balance = 0;
var counterWin = 0;
var counterLose = 0;
var counterMultiply = 0;

function floatToInt(value){ //sprawdzic
    return value * floatMultiplier;
}

function intToFloat(value){  //sprawdzic
    return (value / floatMultiplier).toFixed(8);
}

function getBetValue(){ //sprawdzic
    return parseFloat($('#double_your_btc_stake').val());
}

function setBetValue(value){ //sprawdzic
    $('#double_your_btc_stake').val(value.toFixed(8));
}

function getBalance(){ //sprawdzic
    return parseFloat($('#balance').text());
}

function multiplyBet(multiplier){ //sprawdzic
    counterMultiply++;
    var current = getBetValue();
    var multiply = (current * multiplier).toFixed(8);	
    setBetValue(multiply);
}

function resetBetToDefaultValue(){ //sprawdzic
    setBetValue(defaultBetValue);
}

function resetBetToSecondValue(){   //sprawdzic
    setBetValue(secondBetValue);
}

function changeButton(){
    if($button == $buttonLo){
        $button = $buttonHi;
    } else {
        $button = $buttonLo;
    }
}

function resetRound(){  //sprawdzic i poprawic jak trzeba
    counterWin = 0;
    counterLose = 0;
    balance = 0;
    resetBetToDefaultValue();
}

function resetGame(){
    resetRound();
    counterClick = 0;
    counterLoseTotal = 0;
    counterWinTotal = 0;
    startBalance = getBalance();
    balanceTotal = 0;
}

function startGame(){
    resetRound();
    clickButton();
}

function isMoneyEnough(){
    return getBetValue() < (getBalance() - safeValue);
}

function stopBeforeRedirect(){
    var minutes = parseInt($('title').text());							//pobiera tekst z tytulu strony? i zmienia go na liczbe
    if( minutes < stopBefore )											//jezeli ta liczba jest mniejsza od stop before 
    {
    	if(userRedirect){
        	console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
    	}
        pause();														//to zatrzymuje gre i wyswietla informacje
        return true;													//zwraca true
    }
    return false;	
}

function win(){
    counterWin++;
    counterLose++;
    balance += getBetValue();
    balanceTotal +=getBetValue();
}

function lose(){
    counterLose++;
    counterLoseTotal++;
    balance += getBetValue();
    balanceTotal +=getBetValue();
}

function showBalance(){     //sprawdzic
    console.log("Start balannce = " + startBalance);
    console.log("Now balannce = " + getBalance());
    console.log("Diffrence = " + (getBalance() - startBalance));
}

function showWinRateTotal(){ //sprawdzic
    console.log("Win " + counterWinTotal + ". Lose " + counterLoseTotal + ". W/L" + ((counterWinTotal/counterLoseTotal)*100) + "%.");

}

function p(){
    isBetAllow = !isBetAllow;
    clickButton();
}

function go(){
    isBetAllow = true;
    clickButton();
}

function pause(){ //pause, sprawdzic, ma zatrzymac albo wznowic gre
    isBetAllow = false;
}

function clickButton(){ //sprawdzic
    if(isBetAllow){
        setTimeout(function(){													//klikniecie po losowym czasie oczekiwania
            $button.trigger('click');
        }, getRandomWaitTime());
    } else {
        console.log("Can't click");
    }
}

function cs(value){     //console log 
    console.log(value);
}

function getRandomWaitTime(){   //sprawdzic
    var wait = Math.floor(Math.random() * maxWait) + minWait;	      
    console.log("Wait " + wait + "ms before click.");	
    return wait ;	
}

$('#double_your_btc_bet_lose').unbind();										
$('#double_your_btc_bet_win').unbind();											
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){		
    if( $(event.currentTarget).is(':contains("lose")') ){
        lose();
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){		
    if( $(event.currentTarget).is(':contains("win")') ){
    	win();
    }
});