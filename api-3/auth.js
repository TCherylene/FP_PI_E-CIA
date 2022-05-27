require('dotenv').config()

const express = require('express')
var app =  express();

const jwt = require('jsonwebtoken')

app.use(express.json())

const users = [
    {id:1, username: "John", password: "John123", saldo:100},
    {id:2, username: "Marie", password: "Marie123", saldo: 200},
    {id:3, username: "Claire", password: "Claire123", saldo: 300}
]

//GET Method
app.get ('/', (req, res) => {
    //res.redirect('/');
    res.send("Hello World")
});

// POST - REGISTER - USERNAME & PASS
app.post('/register', (req,res) => {
    //to add a new users, input a username
    if(!req.body.username || req.body.username.length < 3){
        //400 bad request
        res.status(400).send('username is too short');
    };

    //no password
    if(!req.body.password){
        //400 bad request
        res.status(400).send("Please input password");
    }

    //id will be automatically added
    new_id = users.length + 1

    //response format from server (in json)
    const user = {
        id: new_id,
        username: req.body.username,
        password: req.body.password,
        saldo: 0
    };

    const message = "Username atas nama " + users.user + " berhasil didaftarkan";

    //adding the new users
    users.push(user);
    res.send({message: message});
});

// POST - LOGIN - USERNAME & PASS
app.post('/login', (req, res) => {
    //Authenticate User
    //ada codingannya sendiri di video lain

    const username = req.body.username

    const user = {
        name: username
    }

    const accessToken = generateAccessToken(user)

    res.json({
        accessToken: accessToken,
    })
})

// Generate Token
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

// Connect to Auth Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.warn(`App listening on ${PORT}`);
})