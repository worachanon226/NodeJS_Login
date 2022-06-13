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

const ifLoggedIn = (req,res,next)=>{
    if(!req.session.isLoggedIn){
        return res.redirect('/home')
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

//Register Page
app.post('/register', ifLoggedIn, [
    body('user_email', 'Invalid Email Address!').isEmail().custom((value)=>{
        return dbConnecttion.execute('SELECT email FROM users WHERE email = ?', [value])
        .then(([rows])=>{
            if(rows.length > 0){
                return Promise.reject('This email already in use!')
            }
            return true;
        })
    }),
    body('user_name', 'Username is empty!').trim().not().isEmpty(),
    body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({min:6})
], //end of post data validation
    (req,res,next)=>{
        const validation_result = validationResult(req)
        
    }
)

app.listen(3000, ()=> {
    console.log("Server is Running")
})