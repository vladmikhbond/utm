const STOP = 'STOP';
const ERROR = 'ERROR';
const MARGIN = 1000;  // tape length to one side

class Turing {
    constructor(rules) {

        // rules
        this.rules = rules.split('\n')
            .filter(r => !r.startsWith('='))
            .map( r => r.replace(/[=\s]/g, '') )
            .filter(r => r );
        let lastLine = this.rules[this.rules.length - 1];
        this.rules.length--;
        // state
        this.state = this.rules[0][1];
        // tape
        this.headPos = MARGIN;
        this.tape = Array(2 * MARGIN).fill('.');
        for (let i = 0; i < lastLine.length; i++)
            this.tape[this.headPos + i] = lastLine[i];
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

}
