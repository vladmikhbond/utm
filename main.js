let initButton = document.getElementById("initButton");
let runButton = document.getElementById("runButton");
let stepButton = document.getElementById("stepButton");
let helpButton = document.getElementById("helpButton");
let helpText = document.getElementById("helpText");
let rulesText = document.getElementById("rulesArea");
let input = document.getElementById("input");
let printer = document.getElementById("printer");
let tm;
let timer;

initButton.onclick = init;
stepButton.onclick = step;
runButton.onclick = run;

function init() {
    tm = new Turing(rulesText.value.trim(), input.value.trim());
    alignRulesArea();
    printer.innerHTML = "";
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    print(tm);
}

function alignRulesArea() {
    let ss = rulesText.value.split('\n');
    let maxLength = Math.max(...ss.map(s => s.trim().length));
    ss = ss.map(s => (s + '                  ').slice(0, maxLength+1));
    rulesText.value = ss.join('\n');

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

function print(tm) {
    let tick = (' ' + tm.tick).slice(-2);
    let pos = tm.headPos;

    let left = tm.tape.slice(MARGIN - 5, pos).join('');
    let right = tm.tape.slice(pos + 1, MARGIN + 25).join('') ;
    let state = (tm.state + '    ').slice(0, 5);

    printer.innerHTML +=
        "<span class='gray'>" + tick + "</span>"
        + ". <span class='black'>" + state + "</span>"
        + "<span class='gray'>" + left + "</span>"
        + "<span class='under-head'>" + tm.tape[pos] + "</span>"
        + "<span class='gray'>" + right + "</span>\n";

    // highlight rule
    let leftPart = '\n' + tm.state[0] + tm.tape[tm.headPos];
    let i = ('\n' + rulesText.value).indexOf(leftPart);
    if (i == -1) {
        leftPart = leftPart.slice(0, -1) + "_";
        i = ('\n' + rulesText.value).indexOf(leftPart);
    }
    if (i !== -1) {
        rulesText.selectionStart = i;
        rulesText.selectionEnd = rulesText.value.indexOf('\n', i + 3);
    } else {
        rulesText.selectionEnd = rulesText.selectionStart;
    }
    rulesText.focus()
}

//////////////////////// main /////////////////////

init();