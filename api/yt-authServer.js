require('dotenv').config()

const express = require('express')
var app =  express();

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username: "Kyle",
        title: "Post 1"
    },
    {
        username: "Jim",
        title: "Post 2"
    },
    {
        username: "Hello",
        title: "Post 3"
    },

]

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

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

app.listen(4000);