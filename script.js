const btns = document.querySelectorAll ("button");
const ScreenOper = document.getElementById ("Operacion");
const ScreenRes = document.getElementById ("Resultado");

let Num = [];
let Number = 0;
let  Result = 0 ;

btns.forEach ( element => {
    element.addEventListener ("click",()=>{
        const value = element.textContent;
        if (value === "C"){
            Num = [];
            Result = [];
            ScreenOper.textContent = " ";
            ScreenRes.textContent = " ";
        }
        else if (value === "="){
            Result = eval(Number)
            ScreenOper.ScreenRes.textContent. = eval(Number);
            ScreenRes.textContent = Result;
            Num = [];
            Num.push (Result);
            
        }
        else{
            Num.push(value);
            Number = Num.join('');
            ScreenOper.textContent = Number;
            console.log(Number);
        }  
    })
});