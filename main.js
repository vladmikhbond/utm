let initButton = document.getElementById("initButton");
let runButton = document.getElementById("runButton");
let stepButton = document.getElementById("stepButton");
let helpButton = document.getElementById("helpButton");
let helpText = document.getElementById("helpText");
let rulesText = document.getElementById("rulesText");
let printer = document.getElementById("printer");
let tm;
let timer;

init();

initButton.onclick = init;
function init() {
    let rules = rulesText.value.trim();
    tm = new Turing(rules);
    printer.innerHTML = "";
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    print(tm);
}

stepButton.onclick = step;
function step() {
    if (tm.stopped)
        return;
    tm.step();
    print(tm);
}

runButton.onclick = run;
function run() {
    init();
    timer = setInterval(function() {
        step();
        if (tm.stopped) {
            clearInterval(timer);
            timer = null;
        }
    }, 10);
}

helpButton.onclick = function () {
    if (helpText.style.display === 'none' || helpText.style.display === '')
        helpText.style.display = 'block';
    else
        helpText.style.display = 'none'
};

function print(t) {
    const margin = 12;
    let tick = (' ' + t.tick).slice(-2);
    let pos = t.headPos;
    let left = t.tape.slice(pos - margin, pos).join('');
    let right = t.tape.slice(pos + 1, pos + margin).join('');
    let state = (t.state + '    ').slice(0, 5);
    printer.innerHTML += `${tick}. <span class="red">${state}</span>${left}<b>${t.tape[pos]}</b>${right}  \n`
}