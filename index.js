const express = require("express")
const path = require("path")
const cookieSession = require("cookie-session")
const bcrypt = require("bcrypt")
const dbConnecttion = require("./database")
const {body, validationResult} = require("express-validator")

const app = express()
app.use(express.urlencoded({extended: false}))