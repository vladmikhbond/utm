let initButton = document.getElementById("initButton");
let runButton = document.getElementById("runButton");
let stepButton = document.getElementById("stepButton");
let helpButton = document.getElementById("helpButton");
let helpText = document.getElementById("helpText");
let rulesText = document.getElementById("rulesText");
let input = document.getElementById("input");
let printer = document.getElementById("printer");
let tm;
let timer;

init();

initButton.onclick = init;
stepButton.onclick = step;
runButton.onclick = run;

function init() {
    tm = new Turing(rulesText.value.trim(), input.value.trim());
    printer.innerHTML = "";
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    print(tm);
}

function step() {
    if (tm.stopped)
        return;
    tm.step();
    print(tm);
}

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
    let tick = (' ' + t.tick).slice(-2);
    let pos = t.headPos;

    let left = t.tape.slice(MARGIN - 5, pos).join('');
    let right = t.tape.slice(pos + 1, MARGIN + 25).join('') ;
    let state = (t.state + '    ').slice(0, 5);

    printer.innerHTML +=
        "<span class='gray'>" + tick + "</span>"
        + ". <span class='black'>" + state + "</span>"
        + "<span class='gray'>" + left + "</span>"
        + "<span class='under-head'>" + t.tape[pos] + "</span>"
        + "<span class='gray'>" + right + "</span>\n";

    // hilight rule
    let leftPart = '\n' + t.tape[t.headPos] + t.state[0];

    let i = ('\n' + rulesText.value).indexOf(leftPart);
    if (i !== -1) {
        rulesText.selectionStart = i;
        rulesText.selectionEnd = rulesText.value.indexOf('\n', i + 3);
    } else {
        rulesText.selectionEnd = rulesText.selectionStart;
    }
    rulesText.focus()
}