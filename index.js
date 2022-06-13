const express = require('express')
const path = require('path')
const cookieSession = require('cookie-session')
const bcrypt = require('bcrypt')
const dbConnecttion = require('./database')
const {body, validationResult} = require('express-validator')

const app = express()
app.use(express.urlencoded({extended: false}))

app.set("views", path.join(__dirname), "views")
app.set("view engine", "ejs")

app.use(cookieSession({
    name: 'session',
    keys: ['key1','key2'],
    maxAge: 3600*1000 //1hr
}))

//Declaring Custom Middleware
const ifNotLoggedIn = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.render('views/login-register')
    }
    next();
}

//root page
app.get('/',ifNotLoggedIn, (req,res,next)=>{
    dbConnecttion.execute("SELECT name FROM users WHERE id = ?", [req.session.userID])
    .then(([row]) =>{
        res.render('home',{
            name: row[0].name
        })
    })
})

app.listen(3000, ()=> {
    console.log("Server is Running")
})