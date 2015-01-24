/**
 * Created by sercand on 24/01/15.
 */
var express = require('express');
var app = express();

app.use(express.static(__dirname));


app.listen(3000); //the port you want to use