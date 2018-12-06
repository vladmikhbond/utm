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
        this.state = this.rules[0][0];
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
        let sc = this.state + this.tape[this.headPos];
        for (let i = 0; i < this.rules.length; i++)
        {
            let rule = this.rules[i];
            if (rule.substr(0, 2) === sc) {
                this.tape[this.headPos] = rule[3];
                this.state = rule[2];

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
// сортировка
let rules = `s0 = s0R
s1 = u1R
s. = s.STOP

u1 = u1R
u0 = r1L
u. = u.STOP

r1 = b0L

b0 = b0L
b1 = b1L
b. = s.R
`;
let res = Turing.exec(rules, "010101");

console.log(res);

