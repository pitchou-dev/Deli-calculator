//license PitchouDeveloper all right reserved
//any copy without permission is prohibited 
const allBouttons = document.querySelectorAll(".bouton");
const entree = document.querySelector(".haut-ecran p");
const underscore = document.createElement("span");
underscore.setAttribute("id", "underscore");
underscore.textContent = "_";    
const result = document.querySelector(".bas-ecran p");
const shift = document.querySelector(".btn-shift");
let shiftClicked = false;
const modeClr = document.querySelector(".btn-modeclr");
let isModeActived = false;
let isClrActived = false;
const ON = document.querySelector(".btn-on");
let isON = false;
const DEL = document.querySelector(".DEL");
const AC = document.querySelector(".AC");
const allNumbers = document.querySelectorAll(".btn-2 , .btn-3"); 
const btnEgal = document.querySelector(".egal");
let traitInterval;
let mode = 0;
let solution;
let Ans;
let isError = false;
let memClear = false;
let modeclear = 0;
let resetAll = 0;

ON.addEventListener("click", demarrage);

shift.addEventListener("click" , () => {
        shiftClicked = true;
    })

modeClr.addEventListener("click", activerModeClr);

AC.addEventListener("click" , () => {
        if (shiftClicked) {                           //si shift est cliqué et que AC est cliqué juste après, alors éteindre la calcu
            result.textContent = "";
            entree.textContent = "";
            isON = false;           
        } else {
            demarrage();                            //si shift n'est pas cliqué alors suprimer tout ce qui avait été entré à l'écran (un redémarrage plus furtivement)
        }
})  

DEL.addEventListener("click", () => {
        entree.removeChild(underscore);
        entree.textContent = entree.textContent.slice(0, -1)
        entree.appendChild(underscore);
    })

        //disable the shift mode (and alpha soon):
allBouttons.forEach(bouton => {
    if (bouton !== shift) {          
        bouton.addEventListener("click", () => {
            shiftClicked = false;
        })
    }
})

allNumbers.forEach(bouton => {
    bouton.addEventListener("click", () => {
        if(isON && !isError){                                           //if the calculator is on and there is no error
            if(!isModeActived && !isClrActived) {                         //if the mode and clr are not actived
                if(entree.contains(underscore)){        
                    entree.removeChild(underscore);     
                }
                entree.textContent += bouton.dataset.display;
                entree.appendChild(underscore);
                 //if the mode is enabled let only 1 2 and 3 works:
            } else if(isModeActived) { 
                switch(mode) {
                    case 1 :
                        switch(bouton.dataset.display) {
                            case "1" : 
                                COMP();
                            break;
                            case "2" : 
                                SD();
                            break;
                            case "3" :
                                REG();
                            break;
                        }
                    break;
                    case 2 : 
                        switch(bouton.dataset.display) {
                            case "1" : 
                                Deg();
                            break;
                            case "2" : 
                                Rad();
                            break;
                            case "3" :
                                Gra();
                            break;
                        }
                    break;
                    case 3 : 
                        switch(bouton.dataset.display) {
                            case "1" : 
                                Fix();
                            break;
                            case "2" : 
                                Sci();
                            break;
                            case "3" :
                                Norm();
                            break;
                        }
                    break;
                    case 4 :
                        switch(bouton.dataset.display) {
                            case "1" : 
                               Disp();
                            break;
                        }
                    break;
                }       
            } else {
                switch (bouton.dataset.display) {
                    case "1" : 
                        if(entree.contains(underscore)){        
                            entree.removeChild(underscore);     
                        }
                        entree.innerHTML = "Mem clear";
                        entree.appendChild(underscore);
                        result.innerHTML = "0.";
                        memClear = true;                                         
                    break;
                    case "2" : 
                        if(entree.contains(underscore)){
                            entree.removeChild(underscore);
                        }
                        entree.innerHTML = "Mode clear";
                        result.innerHTML = "0.";
                        modeclear = 1;                                                  
                    break;
                    case "3" :
                        if(entree.contains(underscore)){
                            entree.removeChild(underscore);
                        }
                        entree.innerHTML = "Reset All";
                        result.innerHTML = "0.";
                        resetAll = 1;                               
                    break;
                }
            }
        }
    })
})

btnEgal.addEventListener("click", () => {
    if(!isModeActived && !isClrActived) {                   //the function works only if the mode and clr are disabled
        try {
            filtre = entree.textContent
                .replace("×" ,"*")
                .replace("÷", "/")
                .replace("Ans", Ans)
                .replace(/√(\d+)/g, "Math.sqrt($1)")
                .replace(/cos (\d+)/g, "Math.cos($1)")                  //replace decoration characters with computer characters
                .replace(/sin (\d+)/g, "Math.sin($1)")
                .replace(/tan (\d+)/g, "Math.tan($1)")
                .replace(/log (\d+)/g, "Math.log($1)")
                .slice(0, -1);
            solution = eval(filtre);                                            //remove the last character (underscore)
        } catch (error) {
            console.log(error)
            entree.innerHTML = "<pre>    Syntax ERROR</pre>";
            result.innerHTML = "";
            isError = true;
            return;
        }   
        if(solution !== Infinity && solution !== undefined) {       //if the solution is not infinite and not undefined:
                                                                        //to remove the + "." because we will have to check if the solution is a natural number ect...
            result.textContent = solution + ".";
            Ans = solution;
        } else if(solution === Infinity) {                      //if the solution is undefined we will display an error message
            entree.innerHTML = "<pre>     Math ERROR</pre>";
            result.innerHTML = "";
            isError = true;
        } else {                                        //in this case the solution is empty, we display the 0 number
            result.textContent = "0.";
        }
    } else if(memClear) {
        Ans = 0;
    } else if(modeclear === 1) {
        result.textContent = "---------------------";
        modeclear++;
    } else if(modeclear === 2) {
        resetMode();
        demarrage();
    } else if(resetAll === 1) {
        result.textContent = "---------------------";
        resetAll++;
    } else if(resetAll === 2) {
        Ans = 0;
        resetMode();
        demarrage();
    }
})


function demarrage() {
    entree.innerHTML = "";
    result.innerHTML = "";
    result.textContent = "0.";
    entree.appendChild(underscore);
    isON = true;
    sortieModeClr();
    isError = false;
}

function sortieModeClr() {
    mode = 0;
    isModeActived = false;
    isClrActived = false;
    memClear = false;
    modeclear = 0;
    resetAll = 0;
}

function activerModeClr() {
    if (isON) {
        if (shiftClicked) {
            entree.innerHTML = "<pre>   Mcl  Mode  All</pre>";
            result.innerHTML = "<pre>1    2    3    </pre>";
            sortieModeClr();
            isClrActived = true;
            //don't forget to add a "modeClr.removeEventListener" here and in the same function of the code to avoid leaving the keys on
        } else {
            isClrActived = false
            isModeActived = true;
            switch (mode) {
                case 0:
                    entree.innerHTML = "<pre>   COMP  SD  REG</pre>";
                    mode = 1;
                    break;
                case 1:
                    entree.innerHTML = "<pre>   Deg   Rad  Gra</pre>";
                    mode = 2;
                    break;
                case 2:
                    entree.innerHTML = "<pre>   Fix  Sci  Norm</pre>";
                    mode = 3;
                    break;
                case 3:
                    entree.innerHTML = "<pre> Disp </pre>";
                    mode = 4;
                    break;
                case 4:
                    demarrage();
                    mode = 5;
                    break;
            }
        }
        if (mode < 4) {
            result.innerHTML = "<pre>1    2    3    </pre>";
        } else if (mode !== 5) {
            result.innerHTML = "<pre>1                 </pre>";
        } else {
            mode = 0;
        }
    }
}

function COMP() {
    demarrage();
}

function SD() {
    demarrage();
}

function REG() {
    demarrage();
}

function Deg() {
    demarrage();
}

function Rad() {
    demarrage();
}

function Gra() {
    demarrage();
}

function Fix() {
    demarrage();
}

function Sci() {
    demarrage();
}

function Norm() {
    demarrage()
}

function Disp() {
    demarrage();
}

function resetMode() {

}

