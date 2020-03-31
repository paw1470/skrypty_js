var betStart = '0.00000002', 					// wartosc startowa, NIE ZMIENIAJ PRZECINKA I ILOSCI ZNAKOW
betMax = '0.00001000',						    //ile max moze postawic w jednym zakładzie. Sugeruję nie wiecej niż 1/50.
waitMax = 777,									//maksymalna wartosc losowego czasu czekania (czas czekania bedzie mial wartosc minWait+(x < maxWait) )
waitMin = 1,									//staly minimalny czas czekania
buttonLo = true,								//zmienna dla wyboru przycisku na start, jak true to lo, false to hi
betsNumberMax = 0,                                 //po ilu zakładach gra ma się zakończyć. 0 = bez limitu
bilansMaxLose = '0.00010000';                    //po jakiej stracie ma zakończyć działanie

//---------------------------------------DALEJ NIE RUSZAC BO SIE ZACZYNA KOD------------------------------------

var winTotal = 0,									//ile razy od początku dziłania skryptu
loseTotal = 0,										//ile razy przegrales od początku działania skryptu
loseCurrent = 0,                                    //ile razy przegrałeć podczas aktualnej gry
winCurrent = 0,                                     //ile razy wygrałeś podczas aktualnej gry
betsCounter = 0,									//zmienna do liczenia ile było zakładów
bilansTotal = 0,                                    //ogolny bilans gry
bilansCurrent = 0;								     //zmienna do trzymania bilansu dla aktualnej stawki

var $loButton = $('#double_your_btc_bet_lo_button'),		//przypisanie przycisku lo
$hiButton = $('#double_your_btc_bet_hi_button');			//przypisanie przycisku hi

function click(){			 						//funkcja klikajaca	
   // if(betsNumberMax == 0 || betsCounter < betsNumberMax){     //jezeli moze klikac w nieskonczonosc albo jeszcze nie osiagnelo limitu
        if(buttonLo){									//jezeli przycisk lo jest true to ma wykonac akcje dla lo
            $loButton.trigger('click');	                // kliknij LO
        }else{											//Jeżeli nie to
            $hiButton.trigger('click');				     //klika HI
       // }
        betsCounter++;	 //zwieksza licznik 
}

function getCurrent() {										//funkcja zwracajaca jaka jest aktualnie postawiona wartosc
	return $('#double_your_btc_stake').val();				//zmienna przechowujaca aktualnie postawiona wartosc
}

function multiply(){										//funkcja zwiekszajaca wartosc stawki
    var current = getCurrent();
    var multiply = (current * 2).toFixed(8);				//zmienna obliczajaca nowa wartosc i poprawiajaca format danych
    $('#double_your_btc_stake').val(multiply);				//wpisanie nowej wartosci stawki 
}


function getRandomWait(){										     //funkcja losująca czas oczekiwania przed kliknieciem
    var wait = Math.floor(Math.random() * maxWait) + minWait;	      //okreslanie ile czasu skrypt ma czekac
    return wait ;												   //zwrocenie czasu oczekiwania do miejsca gdzi funkcja zostala wywolana
}

function placeBet(){
   setTimeout(function(){ 
       click(); 
    }, getRandomWait());
}

function reset(){												//funkja resetujaca stawke
    $('#double_your_btc_stake').val(startValue);				//ustawienie stawki do wartosci startowej
    loseCurrent = 0;
    winCurrent = 0;
    bilansCurrent = 0;
}

function startGame(){							//funkcja rozpoczynajaca dzialanie skryptu
    reset();									//resetowanie stawki 
    placeBet();
}

function floatToInt(number){
    return number * 10000000;
}

function isMultiplyAllowed(){
    return (getCurrent() * 2) > maxValue;
    
}

function printWinInfo(){
    console.log("Aktualny bilans: " + bilansCurrent + ". Ogólny bilans: " + bilansTotal + ". Aktualne win/lose " + winCurrent+ "/" + loseCurrent + ". Ogólne win/lose " + winTotal + "/" + loseTotal);
}

$('#double_your_btc_bet_lose').unbind();										//odpiecie pilnowania stanu lose
$('#double_your_btc_bet_win').unbind();											//odpiecie pilnowania stanu win
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){		//ustawienie pilnowania stanu lose
    if( $(event.currentTarget).is(':contains("lose")') )						//jezeli stan 
    {
    	bilansCurrent-= getCurrent();													//po przegranej odejmuje aktualna stawke od bilansu 
        bilansTotal-= getCurrent();
		loseTotal++;																	//doda 1 przegrana do licznika
        loseCurrent++;
        if(isMultiplyAllowed()){
            multiply(); 
        }                											//wywolanie funkcji zwiekszajacej zaklad
        placeBet();
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){		//pilnowanie stanu zmiennej win?
    if( $(event.currentTarget).is(':contains("win")') )							//jezeli w tekscie znajduje sie "win"
    {
    	bilansCurrent+= getCurrent();													//po wygranej dodaje do bilansu aktualna stawke
        bilansTotal+= getCurrent();
        winTotal++;
        winCurrent++;
        if(bilansCurrent > 0){
            reset();
        }        
        printWinInfo();
        placeBet();
    }
});
startGame()																		//wywolanie funkcji rozpoczynajacej gre
