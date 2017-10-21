var startValue = '0.00000001', 					// wartosc startowa, NIE ZMIENIAJ PRZECINKA I ILOSCI ZNAKOW
stopPercentage = 0.001,							//(stan konta)/(stawka) jakiej wartosci nie moze przekroczyc (jak przekroczy to sie resetuje do wartosci startowej)
maxWait = 777,									//maksymalna wartosc losowego czasu czekania (czas czekania bedzie mial wartosc minWait+(x < maxWait) )
minWait = 1,									//staly minimalny czas czekania
stopped = false, 								//? debugging 
stopBefore = 1, 								//? In minutes for timer before stopping redirect on webpage
maxLose = 100,                                  //ile razy maksymalnie moze przegrac do resetowania stawki

//Uzywaj wyswietlania danych tylko w formacie debug lub user bo sie syf robi w konsoli przy obu 
debugData 		= true,							//ogolne ustawienie jakie informacje maja sie wyswietlac w stylu ulatwiajacym debugowanie
userData 		= true,							//ogolne ustawienie pozwalajace wlaczyc informacje zrozumiale dla zwyklego czlowieka

debugWait 		= debugData,					//zmienne pozwalajace na indywidualne ustawianie co ma sie wyswietlac w trybie debug
debugMultiply 	= debugData,
debugStart 		= debugData,
debugStop 		= debugData,
debugLose 		= debugData,
debugWin 		= debugData,
debugBilans		= debugData,					//zeby dzialalo wpisanie "b" musi byc wlaczona przynajmniej 1 wartosc bilans
												//zmienne co ma sie wywietlac w trybie zrozumialym dla usera
userMultiply 	= userData,
userWait 		= userData,
userStart 		= userData,
usterStop 		= userData,
userRedirect 	= userData,
userLose 		= userData,
userWin 		= userData,
userBilans 		= userData;


//---------------------------------------DALEJ NIE RUSZAC BO SIE ZACZYNA KOD------------------------------------

var win = 0,									//ile razy wygrales
lose = 0,										//ile razy przegrales
bilans = 0;										//zmienna do trzymania bilansu

var $loButton = $('#double_your_btc_bet_lo_button'),		//przypisanie przycisku lo
$hiButton = $('#double_your_btc_bet_hi_button');			//przypisanie przycisku hi

function getCurrent() {										//funkcja wyciagajaca zwracajaca jaka jest aktualnie postawiona wartosc, to byla czesc funkcji multiply ale zeby nie kopiowac to zrobilem jako funkcje 
	return $('#double_your_btc_stake').val();				//zmienna przechowujaca aktualnie postawiona wartosc
}

function multiply(){										//funkcja zwiekszajaca wartosc stawki
    var multiply = (getCurrent * 2).toFixed(8);				//zmienna obliczajaca nowa wartosc i poprawiajaca format danych
    $('#double_your_btc_stake').val(multiply);				//wpisanie nowej wartosci stawki 
    if(userMultiply){
    	console.log('Stara stawka: "'+current+'". Nowa: "'+multiply+'".');	//wypisze w konsoli aktualna i nastepna stawke
    }
    if(debugMultiply){
    	console.log('T'+current+'N'+multiply);
    }
}


function getRandomWait(){											//funkcja losująca czas oczekiwania przed kliknieciem
    var wait = Math.floor(Math.random() * maxWait) + minWait;		//okreslanie ile czasu skrypt ma czekac
    if(userWait){
    	console.log('Czekanie ' + wait + 'ms przed nastepnym zakladem.');	//informacja o czasie oczekiwania
    }
    if(debugWait){
    	console.log('RW'+wait);
    }
    return wait ;													//zwrocenie czasu oczekiwania do miejsca gdzi funkcja zostala wywolana
}

function startGame(){							//funkcja rozpoczynajaca dzialanie skryptu
    if(userStart){
    	console.log('Game started!');			//informacja ze gra sie rozpoczela.
    }
    if (debugStart) {
    	console.log("START");
    }
    reset();									//resetowanie stawki 
    $loButton.trigger('click');					//klikniecie przycisku lo
}
	
function stopGame(){											//funkcja zatrzymujaca skrypt
	if(usterStop){
    	console.log('Game will stop soon! Let me finish.');		//informacja o tym ze gra sie zaraz skonczy
	}
	if(debugStop){
		console.log("STOP");
	}
    stopped = true;												//ustawienie wartosci zatrzymujacej gre
}

function reset(){												//funkja resetujaca stawke
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

function b(){		
	if(userBilans){										
		console.log('Stan konta od uruchomienia zmienil sie o: "'+bilans+'"');
	}
	if(debugBilans){
		console.log('B'+bilans);
	}
}


$('#double_your_btc_bet_lose').unbind();										//odpiecie pilnowania stanu lose?
$('#double_your_btc_bet_win').unbind();											//odpiecie pilnowania stanu win?
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){		//ustawienie pilnowania stanu lose
    if( $(event.currentTarget).is(':contains("lose")') )						//jezeli stan 
    {
    	bilans-= getCurrent;													//po przegranej odejmuje aktualna stawke od bilansu 


    	if (userLose){
        	console.log('Przegrales! Podwajanie zakladu.');						//informacja ze przegrales
    	}

        multiply();                 											//wywolanie funkcji zwiekszajacej zaklad
        if(lose>maxLose){
            reset();
        }
        if (debugLose){															//informacja do debugowania informujaca o ilosci wygran do przegania
	        if(win>0){															//jezeli miales jakies wygrane
	            console.log('W'+win);											//to wyswietli informacje ile ich bylo 
	            win=0;															//i wyczysci licznik
	        }
	        lose++;																//doda 1 przegrana do licznika
	    }
        setTimeout(function(){													//ustawia po jakim czasie ma kliknac przycisk
            $loButton.trigger('click');
        }, getRandomWait());
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){		//pilnowanie stanu zmiennej win?
    if( $(event.currentTarget).is(':contains("win")') )							//jezeli w tekscie znajduje sie "win"
    {

    	bilans+= getCurrent;													//po wygranej dodaje do bilansu aktualna stawke


    	if(debugWin){															//ifnormacja o ilosci przegranych 
	        if(lose>0){															//jezeli wczesniej przegrywales 
	            console.log(lose+'L');											//to wypisze ile razy 
	            lose=0;															//i wyczysci licznik
	        }
	        win++;																//zwiekszy licznik wygranych o 1
	    }
        if( stopBeforeRedirect() )												//zatrzyma przekierowanie ?
        {
            return;
        }
        if( iHaveEnoughMoni() )													//jezeli kod chce postawic wiecej niz pozwoliles
        {
        	if(userWin){
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
            $loButton.trigger('click');
        }, getRandomWait());
    }
});
startGame()																		//wywolanie funkcji rozpoczynajacej gre