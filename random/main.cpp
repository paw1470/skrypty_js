#include <iostream>
#include <cstdlib>
#include <ctime>
//jezeli wpiszesz 0 to znaczy ze wybierasz mniejsza od polowy a jezeli 1 to wieksza
using namespace std;

int main()
{
    srand( time( NULL ) );
    int chance = 50;
    int r;
    bool win;
    string s;
    do{
        cin>>s;
        if(s[0]=='%'){
            s.erase(0,1);
            try{
                chance = stoi(s);
                cout<<"Nowe prawdopodobienstwo wygrnanej "<<s<<endl;
            }catch(string w){
                cout<<"Zla wartosc "<<endl;
            }
        }
        else if(s[0]=='1'||s[0]=='0'){
            r =rand() % 500;
            if(chance>(rand() % 100)){
                win = true;
            }
            else{
                win = false;
            }
            if(s[0]=='1'){
                if(win){
                    r+=500;
                }
            }
            else{
                if(!win){
                    r+=500;
                }
            }
            cout<<"Wylosowana liczba to: "<<r<<endl;
            if(win){
                cout<<"Wygrales"<<endl;
            }
            else{
                cout<<"Przegrales"<<endl;
            }
        }
        else{
            cout<<s<<endl;

        }

    }while(true);
    return 0;
}
