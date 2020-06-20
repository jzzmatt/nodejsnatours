const express = require('express');
const { ppid } = require('process');
const app = express();
const morgan = require('morgan'); //permit to get log about the user request

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
//https://expressjs.com/en/resources/middleware.html
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev')); //permit to retunr log regargin the request
}

app.use(express.json()); //permit to get the body request, also called body.parser

app.use(express.static('./public')) //permit to serve static File

app.use((req, res, next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req, res, next) => {
    req.requesTime = new Date().toISOString(); //the ISOSstring permit to format the date
    next();
});


/*
INITIAL TEST
app.get('/', (req, res) => {
 res.status(200)
     .json({message: 'hello from the server side!', app: 'Natours'});
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...');
})*/

// 2) ROUTE HANDLER


// --->  GET  <-----
//app.get('/api/v1/tours', getAllTours);

// --->  GET URL PARAMETERS <-----
//app.get('/api/v1/tours/:id', getTour);

// --->  POST  <-----

//app.post('/api/v1/tours', createTour);

// --->  PATCH  <-----
//app.patch('/api/v1/tours/:id', updateTour);

// --->  DELETE  <-----

//app.delete('/api/v1/tours/:id', deleteTour);


//---> REFACTORING ROUTING <----
// 3.1) Middle Route or Create Multiple router , also called sub application


//Mounting the Router
app.use('/api/v1/tours', tourRouter); 
app.use('/api/v1/users', userRouter);

module.exports = app;

