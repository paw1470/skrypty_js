//Wyswietlenie bilansu od uruchomienia skryptu po wpisaniu b()

var startValue = '0.00000001', 					// wartosc startowa, NIE ZMIENIAJ PRZECINKA I ILOSCI ZNAKOW
maxValue = '0.00001000',						//ile max moze postawic 
maxWait = 777,									//maksymalna wartosc losowego czasu czekania (czas czekania bedzie mial wartosc minWait+(x < maxWait) )
minWait = 1,									//staly minimalny czas czekania
buttonLo = true,								//zmienna dla wyboru przycisku na start, jak true to lo, false to hi


//---------------------------------------DALEJ NIE RUSZAC BO SIE ZACZYNA KOD------------------------------------

var win = 0,									//ile razy wygrales
lose = 0,										//ile razy przegrales
currentLose = 0,
currentWin = 0,
clickCount = 0,									//zmienna do zapisywania ile razy kliknal przycisk
bilans = 0,                                     //ogolny bilans gry
currentBilans = 0;								//zmienna do trzymania bilansu dla aktualnej stawki

var $loButton = $('#double_your_btc_bet_lo_button'),		//przypisanie przycisku lo
$hiButton = $('#double_your_btc_bet_hi_button');			//przypisanie przycisku hi

function kliknij(){									//funkcja klikajaca	
	if(buttonLo){									//jezeli przycisk lo jest true to ma wykonac akcje dla lo
        $loButton.trigger('click');	
	}else{											//jezeli ma klikac w hi
        $hiButton.trigger('click');				//to klika w przycisk hi
	}
    clickCount++;							//i zwieksza licznik 
}

function getCurrent() {										//funkcja wyciagajaca zwracajaca jaka jest aktualnie postawiona wartosc, to byla czesc funkcji multiply ale zeby nie kopiowac to zrobilem jako funkcje 
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

function startGame(){							//funkcja rozpoczynajaca dzialanie skryptu
    reset();									//resetowanie stawki 
    kliknij();
}

function reset(){												//funkja resetujaca stawke
    $('#double_your_btc_stake').val(startValue);				//ustawienie stawki do wartosci startowej
    currentLose = 0;
    currentWin = 0;
}

function deexponentize(number){									//?
    return number * 10000000;
}

function iHaveEnoughMoni(){												//funkcja okreslajaca czy stac cie na podniesienie stawki 
    var balance = deexponentize(parseFloat($('#balance').text()));		//pobranie stanu konta?
    var current = deexponentize($('#double_your_btc_stake').val());		//pobranie wartosci aktualnej stawki 
    return ((balance)*2/100) * (current*2) > stopPercentage/100;		//obliczenie czy skrypt moze sobie pozwolic na podniesienie stawki
}

function stopBeforeRedirect(){											//zatrzymanie przed przekierowaniem? nie rozumiem o co chodzi bo nie widzialem jak dziala strona
    var minutes = parseInt($('title').text());							//pobiera tekst z tytulu strony? i zmienia go na liczbe
    if( minutes < stopBefore )											//jezeli ta liczba jest mniejsza od stop before 
    {
        stopGame();														//to zatrzymuje gre i wyswietla informacje
        return true;													//zwraca true
    }
    return false;														//zwraca false
}									//nie rozumiem o co chodzi z tym czasem

function isMultiplyAllowed(){
    return (getCurrent() * 2) > maxValue;
    
}

$('#double_your_btc_bet_lose').unbind();										//odpiecie pilnowania stanu lose?
$('#double_your_btc_bet_win').unbind();											//odpiecie pilnowania stanu win?
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){		//ustawienie pilnowania stanu lose
    if( $(event.currentTarget).is(':contains("lose")') )						//jezeli stan 
    {

    	bilans-= getCurrent();													//po przegranej odejmuje aktualna stawke od bilansu 
		lose++;																	//doda 1 przegrana do licznika
        currentLose++;
        currentBilans-= getCurrent();
        if(isMultiplyAllowed()){
            multiply(); 
        }                											//wywolanie funkcji zwiekszajacej zaklad
        console.log("Aktualny bilans " + currentBilans + ". Aktualne win/lose" + win + "/" + lose);
        setTimeout(function(){													//ustawia po jakim czasie ma kliknac przycisk
            kliknij();
        }, getRandomWait());
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){		//pilnowanie stanu zmiennej win?
    if( $(event.currentTarget).is(':contains("win")') )							//jezeli w tekscie znajduje sie "win"
    {
        
    	bilans+= getCurrent();													//po wygranej dodaje do bilansu aktualna stawke
	    currentBilans+= getCurrent();
        win++;																	//zwiekszy licznik wygranych o 1
        currentWin++;
        if(currentBilans > 0){
            reset();
        }        
        
        consoleLog("Aktualny bilans: " + currentBilans + ". Ogólny bilans: " + bilans + ". Aktualne win/lose " + win+ "/" + lose + ". Ogólne win/lose " + win + "/" + lose);
        
        if( iHaveEnoughMoni() )													//jezeli kod chce postawic wiecej niz pozwoliles
        {
            reset();
        }
        setTimeout(function(){													//klikniecie po losowym czasie oczekiwania
            kliknij();
        }, getRandomWait());
    }
});
startGame()																		//wywolanie funkcji rozpoczynajacej gre
