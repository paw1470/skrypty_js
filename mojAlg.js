//Wyswietlenie bilansu od uruchomienia skryptu po wpisaniu b()

var startValue = '0.00000001', 					// wartosc startowa, NIE ZMIENIAJ PRZECINKA I ILOSCI ZNAKOW
stopPercentage = 0.001,							//(stan konta)/(stawka) jakiej wartosci nie moze przekroczyc (jak przekroczy to sie resetuje do wartosci startowej)
maxWait = 777,									//maksymalna wartosc losowego czasu czekania (czas czekania bedzie mial wartosc minWait+(x < maxWait) )
minWait = 1,									//staly minimalny czas czekania
stopped = false, 								//? debugging 
stopBefore = 1, 								//? In minutes for timer before stopping redirect on webpage
maxLose = 100,									//ile razy mozesz przegrac
buttonLo = true,								//zmienna dla wyboru przycisku na start, jak true to lo, false to hi
loMax = 1,										//ile razy ma kliknac przycisk lo zanim zmieni na hi   (jezeli obie zmienne beda mialy 0 to skrypt sie zawiesi, ale jedna zmienna moze miec 0)
hiMax = 1,										//ile razy ma kliknac przycisk hi zamin zmieni na lo

//Uzywaj wyswietlania danych tylko w formacie debug lub user bo sie syf robi w konsoli przy obu 
debugData 		= false,							//ogolne ustawienie jakie informacje maja sie wyswietlac w stylu ulatwiajacym debugowanie
userData 		= false,							//ogolne ustawienie pozwalajace wlaczyc informacje zrozumiale dla zwyklego czlowieka

//zmienne pozwalajace na indywidualne ustawianie co ma sie wyswietlac w trybie debug
//informacje w trybie streszczonym do debugowania
debugWait 		= debugData,					//informacja o czasie oczekiwania przed kliknieciem "T?"		
debugMultiply 	= debugData,					//informacja o dzialaniu funkcji multiply "M?N?"
debugStart 		= debugData,					//informacja o wywolaniu start "START"
debugStop 		= debugData,					//informacja o wywolaniu stop "STOP"
debugWin        = debugData,					//informacja o wygranej "WIN"
debugLose       = debugData,					//informacja o przegranej "LOSE"
debugCountLose 	= debugData,					//informacja o passie przegranyc "L?"
debugCountWin 	= debugData,					//informacja o passie wygranych "W?"
debugBilans		= debugData,					//informacja o bilansie zyskow i strat od uruchomienia skryptu (po wpisaniu "b()")
debugReset      = debugData,					//informacja o resetowaniu zakladu do wartosci poczatkowej

//informaje wyswietlane w trybie dla zwyklego usera
userMultiply 	= userData,						//wyswietlanie dzialania funkcji multiply
userWait 		= userData,						//wyswietlanie czasu oczekiwania przed kliknieciem
userStart 		= userData,						//wyswietlanie informacji o wywolaniu funkcji start
userStop 		= userData,						//wyswietlenie informacji o funkcji stop
userRedirect 	= userData,						//informacja o zatrzymaniu przekierowania
userCountLose 	= true,						//informacja ile trwala passa przegranych
userCountWin 	= true,						//informacja ile trwala passa wygranych
userBilans 		= true,							//wyswietlenie ile zarobil lub stracil skrypt (zwraca wartosc po wpisaniu "b()")
userWinReset    = userData,						//informacja o resetowaniu zakladu do wartosci startowej
userLose        = userData,						//informacja ze wygrales
userWin         = userData;						//informacja ze przegrales


//---------------------------------------DALEJ NIE RUSZAC BO SIE ZACZYNA KOD------------------------------------

var win = 0,									//ile razy wygrales
lose = 0,										//ile razy przegrales
clickCount = 0,									//zmienna do zapisywania ile razy kliknal przycisk
bilans = 0;										//zmienna do trzymania bilansu

var $loButton = $('#double_your_btc_bet_lo_button'),		//przypisanie przycisku lo
$hiButton = $('#double_your_btc_bet_hi_button');			//przypisanie przycisku hi


function kliknij(){									//funkcja klikajaca	
	if(buttonLo){									//jezeli przycisk lo jest true to ma wykonac akcje dla lo
		if(clickCount<loMax){						//jezeli licznik klikniec jest mniejszy niz loMax to kliknie lo i zwiekszy licznik
			$loButton.trigger('click');	
			clickCount++;
		 }else{										//jezli licznik ma tyle co max to jest zerowany i zmieniany na przeciwny
		 	clickCount = 0;
		 	buttonLo = false;
		 	kliknij();								//i funkcja kliknij jest wykonywana drugi raz
		 }
	}else{											//jezeli ma klikac w hi
		if(clickCount<hiMax){						//jezeli licznik jest mniejszy od max
		 	$hiButton.trigger('click');				//to klika w przycisk hi
		 	clickCount++;							//i zwieksza licznik 
		}else{										//jezeli jest rowny albo wiekszy 
			clickCount = 0;							//to licznik jest zerowany 
			buttonLo = true;						//przycisk zmieniany na lo
			kliknij();								//i jest wywolywane klikniecie
		}
	}
}

function getCurrent() {										//funkcja wyciagajaca zwracajaca jaka jest aktualnie postawiona wartosc, to byla czesc funkcji multiply ale zeby nie kopiowac to zrobilem jako funkcje 
	return $('#double_your_btc_stake').val();				//zmienna przechowujaca aktualnie postawiona wartosc
}

function multiply(){										//funkcja zwiekszajaca wartosc stawki
    var current = getCurrent();
    var multiply = (current * 2).toFixed(8);				//zmienna obliczajaca nowa wartosc i poprawiajaca format danych
    $('#double_your_btc_stake').val(multiply);				//wpisanie nowej wartosci stawki 
    if(userMultiply){
    	console.log('Stara stawka: "'+current+'". Nowa: "'+multiply+'".');	//wypisze w konsoli aktualna i nastepna stawke
    }
    if(debugMultiply){
    	console.log('M'+current+'N'+multiply);             //M0.00000001N0.00000002       Multiply + newMultiply
    }
}


function getRandomWait(){										     //funkcja losująca czas oczekiwania przed kliknieciem
    var wait = Math.floor(Math.random() * maxWait) + minWait;	      //okreslanie ile czasu skrypt ma czekac
    if(userWait){
    	console.log('Czekanie ' + wait + 'ms przed nastepnym zakladem.');	//informacja o czasie oczekiwania
    }
    if(debugWait){
    	console.log('T'+wait);                                     //Wait+time 
    }
    return wait ;												   //zwrocenie czasu oczekiwania do miejsca gdzi funkcja zostala wywolana
}

function startGame(){							//funkcja rozpoczynajaca dzialanie skryptu
    if(userStart){
    	console.log('Game started!');			//informacja ze gra sie rozpoczela.
    }
    if (debugStart) {
    	console.log("START");
    }
    reset();									//resetowanie stawki 

    kliknij();
}
	
function stopGame(){											//funkcja zatrzymujaca skrypt
	if(userStop){
    	console.log('Game will stop soon! Let me finish.');		//informacja o tym ze gra sie zaraz skonczy
	}
	if(debugStop){
		console.log("STOP");
	}
    stopped = true;												//ustawienie wartosci zatrzymujacej gre
}

function reset(){												//funkja resetujaca stawke
    if(debugReset){
        console.log("R"+getCurrent()+"N"+startValue);
    }
    $('#double_your_btc_stake').val(startValue);				//ustawienie stawki do wartosci startowej
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
    	if(userRedirect){
        	console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
    	}
        stopGame();														//to zatrzymuje gre i wyswietla informacje
        return true;													//zwraca true
    }
    return false;														//zwraca false
}									//nie rozumiem o co chodzi z tym czasem

function b(){		                                             //funkcja zwracajaca bilans b()
	if(userBilans){										
		console.log('Stan konta od uruchomienia zmienil sie o: "'+bilans+'"');
	}
	if(debugBilans){
		console.log('B'+bilans);       
	}
}

function s(){
	stopGame();
}

$('#double_your_btc_bet_lose').unbind();										//odpiecie pilnowania stanu lose?
$('#double_your_btc_bet_win').unbind();											//odpiecie pilnowania stanu win?
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){		//ustawienie pilnowania stanu lose
    if( $(event.currentTarget).is(':contains("lose")') )						//jezeli stan 
    {

    	bilans-= getCurrent();													//po przegranej odejmuje aktualna stawke od bilansu 
		lose++;																	//doda 1 przegrana do licznika

        if(debugLose){
            console.log("LOSE");
        }
    	if (userLose){
        	console.log('Przegrales! Podwajanie zakladu.');						//informacja ze przegrales
    	}
        multiply();                 											//wywolanie funkcji zwiekszajacej zaklad
	    if(win>0){																//jezeli miales jakies wygrane
        	if (debugCountLose){												//informacja do debugowania informujaca o ilosci wygran do przegania
	            console.log('W'+win);											//to wyswietli informacje ile ich bylo  															
	        }
	        win=0;																//i wyczysci licznik
	    }
	    if(lose>maxLose){														//jezeli przegrales wiecej razy niz ustawiles to resetuje stawke
	    	reset();
	    }

        setTimeout(function(){													//ustawia po jakim czasie ma kliknac przycisk
            kliknij();
        }, getRandomWait());
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){		//pilnowanie stanu zmiennej win?
    if( $(event.currentTarget).is(':contains("win")') )							//jezeli w tekscie znajduje sie "win"
    {
        
    	bilans+= getCurrent();													//po wygranej dodaje do bilansu aktualna stawke
	    win++;																	//zwiekszy licznik wygranych o 1

        if(debugWin){
            console.log("WIN");
        }
	    if(lose>0){																//jezeli wczesniej przegrywales 
			if(debugCountWin){													//ifnormacja o ilosci przegranych 
	            console.log(lose+'L');											//to wypisze ile razy 
	        }
	       	lose=0;																//i wyczysci licznik
	    }
        if( stopBeforeRedirect() )												//zatrzyma przekierowanie ?
        {
            return;
        }
        if( iHaveEnoughMoni() )													//jezeli kod chce postawic wiecej niz pozwoliles
        {
        	if(userWinReset){
            	console.log('You WON! But don\'t be greedy. Restarting!');		//informacja ze wygrales ale stawiasz wiecej niz planowales wiec cie restartuje
        	}
            reset();
            if( stopped )														//zatrzymanie
            {
                stopped = false;
                return false;
            }
        }
        else
        {
        	if(userWin){
            	console.log('Wygrales! Stawiam jeszcze raz');					//informacja ze stawiasz jeszcze raz tyle samo bo wygrales
        	}
        }
        setTimeout(function(){													//klikniecie po losowym czasie oczekiwania
            kliknij();
        }, getRandomWait());
    }
});
startGame()																		//wywolanie funkcji rozpoczynajacej gre
