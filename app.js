const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('This is my first server! so cool!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
    res.send("We don't serve that here. Never call again!")
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
        Base URL: ${req.baseUrl}
        Host: ${req.hostname}
        Path: ${req.path}
        IP: ${req.ip}
        Route: ${req.route}
        Orig URL: ${req.originalUrl}
        Params: ${req.params}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end();
});

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if(!name) {
        return res.status(400).send('Please provide a name');
    }
    if(!race) {
        return res.status(400).send('Please provide a race');
    }
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;
    res.send(greeting);
});

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;
    if(!a || !b) {
        return res.status(400).send('Please enter a or b');
    }
    const sum = parseInt(a) + parseInt(b);
    const sumString = `The sum of ${a} and ${b} is ${sum}`;
    res.send(sumString);
});

app.get('/cipher', (req, res) => {
    const {text, shift} = req.query;

    if(!text) {
        return res.status(400).send('text query required');
    }
    if(!shift) {
        return res.status(400).send('shift query required');
    }
    const shiftNum = parseFloat(shift);
    if(Number.isNaN(shiftNum)) {
        return res.status(400).send('Please enter a number for shift')
    }
    const base = 'A'.charCodeAt(0);

    const cipher = text
        .toUpperCase()
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            if(code < base || code > (base + 26)) {
                return char;
            }
            
            let diff = code - base;
            diff = diff + shiftNum;
            diff = diff % 26;

            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })
        .join('')
    ;

    res.status(200).send(cipher);

    
});

app.get('/lotto', (req, res) => {
    const { arr } = req.query;
    if(!arr) {
        return res.status(400).send('Numbers are required');
    }
    if(!Array.isArray(arr)) {
        return res.status(400).send('Numbers must be in array')
    }
    if(arr.length < 6) {
        return res.status(400).send('Please enter at least 6 numbers');
    }
    if(arr.length > 6) {
        return res.status(400).send('Please enter only 6 numbers')
    }
    arr.map(num => {
        if(Number.isNaN(num)){
            return res.status(400).send('Please enter numbers only')
        }
        if(num < 1 || num > 20) {
            return res.status(400).send('Please enter numbers between 1 and 20')
        }
    })
    const winningNumbers = [];
    for(let i = 0; i < arr.length; i++) {
        let randomNum = parseInt(Math.random() * 20);
        (randomNum === 0) 
            ? winningNumbers.push(1) 
            : winningNumbers.push(randomNum)
        ;

    }
    let numMatch = 0;
    arr.map(num => winningNumbers.includes(parseInt(num))
        ? numMatch += 1 : numMatch += 0)
    ;
    if(numMatch === 6) {
        res.send('Wow! Unbelievable! You could have won the mega millions!');
    }
    else if(numMatch === 5) {
        res.send('Congratulations! You win $100!');
    }
    else if(numMatch === 4) {
        res.send('Congratulations, you win a free ticket.')
    }
    else {
        res.send('Sorry, you lose.')
    }
    
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});