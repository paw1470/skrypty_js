var maxBetValue = 0.00000088; //wartosc maksymalna zakladu
var defaultBetValue = 0.00000001;
var secondBetValue = 0.00000020;
var safeValue = 0.00000000; //na koncie musi zostac nie mniej niz 
var targetProfit = 0.00000005;
var maxWinCounterLimit = 0; //po ilu wygranych chcesz zakonczyc gre. jezeli nie uzyjesz funkcji limitujacej to nie bedzie uzywane;
var maxLoseCounterLimin = 0; //po ilu przegranych ma zakonczyc gre. jezeli nie uzyjesz funkcji to nie ma znaczenia wartosc;
var maxCounterMultiply = 5; //ile razy moze zwiekszyc stawke podczas rundy. jeżeli wartość będzie za mała to za często będzie tracić pieniądze ale za duża wartość może powodować duże straty
var multiplier = 2.0; //jak chcesz ulamek to z kropka

var stopBefore = 2; //ile minut przed koncem ma przestac stawiac. (nie wiem o jakie odliczanie chodzi)
var $button = $buttonLo; //wartosci do wyboru $buttonHI i $buttonLo
var maxWaitTime = 777; // ile max moze czekac przed kliknieciem
var minWaitTime = 1; //ile minimalnie musi czekać przed kliknięciem
var clickLimit = 0; //ile razy może zagrać. 0 to nieskonczonosc.

function limiter(){
    if(isLessThanSafeBalance()){
        pause();
    }
    if(isMaxLimitTotalLose()){
        pause();
    }
    if(isMaxLimitTotalWin()){
        pause();
    }
    if(isNoTimeBeforeRedirect()){
        pause();
    }
    if(isTargetProfit()){
        pause();
    }
    if(isMaxLimitMultiplyCounter()){
        clickHalfBet();
    }
    if(isMaxLimitClickCounter()){
        pause();
    }
}

function win(){
    afterWin();
    switch (counterWin){
        case 1:
            cs("wygrales wiec reset");
            break;
        default:
            resetRound();
            break;
    }
    limiter();
    clickButton();
}

function lose(){
    afterLose();
    switch (counterLose){
        case 4:
            pause();
            break;
        default:
            // multiplyBet(multiplier);
            // multiplyBet(4);
            click2xBet();
            break;
    }
    limiter();
    clickButton();
}





//don't touch this variables
var floatMultiplier = 100000000;
var $buttonLo = $('#double_your_btc_bet_lo_button');
var $buttonHi = $('#double_your_btc_bet_hi_button');
var $betAmountField = $('#double_your_btc_stake');
var $buttonHalfBet = $('#double_your_btc_half');
var $button2xBet = $('#double_your_btc_2x');
var $buttonMinBet = $('#double_your_btc_min');
var $buttonMaxBet = $('#double_your_btc_max');
var $balanceField = $('#balance');
var $winProfitField = $('#win_amount');
var $loseMessageField = $('#double_your_btc_bet_lose');
var $winMessageField = $('#double_your_btc_bet_win');
var $payoutMultiplierField = $('#double_your_btc_payout_multiplier');
var $winChance = $('#double_your_btc_win_chance');

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

function floatToInt(value){ //ok
    return value * floatMultiplier;
}

function intToFloat(value){  //ok?
    return (value / floatMultiplier).toFixed(8);
}

//set get

function getBetValue(){ //ok
    return $betAmountField.val();
}

function setBetValue(value){ //ok
    $betAmountField.val(value.toFixed(8));
}

function getBalance(){ //sprawdzic
    return $balanceField.text();
}

function getWinProfit(){
    return $winProfitField.text();
}

function getPayoutMultiplier(){
    return $payoutMultiplierField.val();
}

function setPayoutMultiplier(value){
    $payoutMultiplierField.val(value);
    $payoutMultiplierField.trigger("keyup");
}

function getWinChance(){
    return $winChance.val();
}

function setWinChance(value){
    $winChance.val(value);
    $winChance.trigger("keyup");
}

function clickHalfBet(){
    $buttonHalfBet.trigger("click");
}

function click2xBet(){
    counterMultiply++;
    $button2xBet.trigger("click");
}

function clickMinBet(){
    $buttonMinBet.trigger("click");
}

function clickMaxBet(){
    $buttonMaxBet.trigger("click");
}

function multiplyBet(multiplier){ //sprawdzic
    counterMultiply++;
    var current = getBetValue();
    var multiply = (current * multiplier);	
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
    counterMultiply = 0;
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

function restartGame(){
    resetRound();
    go();
}

function isMoneyEnough(){
    return getBetValue() < (getBalance() - safeValue);
}

function isNoTimeBeforeRedirect(){
    var minutes = parseInt($('title').text());							//pobiera tekst z tytulu strony? i zmienia go na liczbe
    return minutes < stopBefore;											//jezeli ta liczba jest mniejsza od stop before 
}

function afterWin(){
    counterWin++;
    counterWinTotal++;
    balance += getWinProfit();
    balanceTotal += getWinProfit();
}

function afterLose(){
    counterLose++;
    counterLoseTotal++;
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

function isLessThanSafeBalance(){
    return ((getBalance() + getBetValue()) < safeValue);
}

function isMaxLimitCurrentWin(){
    return counterWin >= maxWinCounterLimit;
}

function isMaxLimitTotalWin(){
    return counterWinTotal >= maxWinCounterLimit;
}

function isMaxLimitCurrentLose(){
    return counterLose >= maxLoseCounterLimit;
}

function isMaxLimitTotalLose(){
    return counterLoseTotal >= maxLoseCounterLimit;
}

function isTargetProfit(){
    return (getBalance() - startBalance()) >= targetProfit;
}

function isMaxLimitMultiplyCounter(){
    return counterMultiply > maxCounterMultiply;
}

function isMaxLimitClickCounter(){
    if(clickLimit == 0){
        return false;
    }
    return counterClick >= clickLimit;
}

function isMaxLimitBetValue(){
    if(maxBetValue == 0){
        return false;
    }
    return getBetValue() < maxBetValue;
}


function cs(value){     //console log 
    console.log(value);
}

function getRandomWaitTime(){   //sprawdzic
    var wait = Math.floor(Math.random() * maxWaitTime) + minWaitTime;	      
    console.log("Wait " + wait + "ms before click.");	
    return wait ;	
}

$loseMessageField.unbind();										
$winMessageField.unbind();											
$loseMessageField.bind("DOMSubtreeModified",function(event){		
    if( $(event.currentTarget).is(':contains("lose")') ){
        lose();
        cs("lose");
    }
});
$winMessageField.bind("DOMSubtreeModified",function(event){		
    if( $(event.currentTarget).is(':contains("win")') ){
        win();
        cs("win");
    }
});