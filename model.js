const STOP = 'STOP';
const ERROR = 'ERROR';
const MARGIN = 1000;  // tape length to one side

class Turing {
    constructor(rules, input) {

        // rules
        this.rules = rules.split('\n')
            .filter(r => !r.startsWith('='))
            .map( r => r.replace(/[=\s]/g, '') )
            .filter(r => r );
        // state
        this.state = this.rules[0][1];
        // tape
        this.headPos = MARGIN;
        this.tape = Array(2 * MARGIN).fill('.');
        for (let i = 0; i < input.length; i++)
            this.tape[this.headPos + i] = input[i];
        //
        this.tick = 0;
    }

    step() {
        if (this.stopped)
            return;
        this.tick++;
        let charAndState = this.tape[this.headPos] + this.state;
        for (let i = 0; i < this.rules.length; i++)
        {
            let rule = this.rules[i];
            if (rule.substr(0, 2) === charAndState) {
                this.tape[this.headPos] = rule[2];
                this.state = rule[3];

                if (rule[4] === 'L')
                    this.headPos--;
                else if (rule[4] === 'R')
                    this.headPos++;

                if (rule[4] === 'S' || rule[5] === 'S')
                    this.state = STOP;
                return
            }
        }
        this.state = ERROR;
    }

    get stopped() {
        return this.state === STOP || this.state === ERROR
    }

    get output() {
        let i = this.headPos - 1;
        while(this.tape[i] !== '.' && i)
            i--;
        return this.tape.slice(i + 1, this.headPos).join('');
    }


    static exec(rules, input) {
        const INFINITY = MARGIN * 2;
        let tm = new Turing(rules, input);
        for (let t = 0; t < INFINITY && !tm.stopped; t++) {
            tm.step();
            if (tm.state === ERROR)
                return ERROR;
            if (tm.state === STOP)
                return tm.output;
        }
        return ERROR;
    }
}

let rules = `0s = 0sR
1s = 1uR
.s = .sSTOP

1u = 1uR
0u = 1rL
.u = .uSTOP

1r = 0bL

0b = 0bL
1b = 1bL
.b = .sR
`;
let res = Turing.exec(rules, "010101");

console.log(res);

