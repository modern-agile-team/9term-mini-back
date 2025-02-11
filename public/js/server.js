"use strict"

const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require("./routes/auth");

const app = express();

app.use(bodyParser.json());
app.use("/index", authRouter);
