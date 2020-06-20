const express = require('express');
const fs = require('fs');
const { ppid } = require('process');
const app = express();
const morgan = require('morgan'); //permit to get log about the user request

// 1) MIDDLEWARES
//https://expressjs.com/en/resources/middleware.html
app.use(morgan('dev'));

app.use(express.json()); //permit to get the body request, also called body.parser

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
const tours = JSON.parse(
    fs.readFileSync('./dev-data/data/tours-simple.json')
    );

// ---> REFACTORING <---
const getAllTours = (req, res) => {
    console.log(req.requesTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
     });  
};

const getTour = (req, res) => {
    //console.log(req.params);
    const id = req.params.id * 1; //convert a string to a Number
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
};

const createTour = (req, res) => {
    //get the last id of the tour array
    const newID = tours[tours.length -1].id +1; //get the last tour and add 1
    const newTour = Object.assign({id: newID}, req.body); //Merge 2 Objects

    tours.push(newTour);
    
    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(tours), err => {
      res.status(201).json({
          status: 'success',
          data: {
              tour: newTour
          }
      });

        })
     
};

const updateTour = (req, res) => {
    const id = req.params.id * 1; //convert a string to a Number
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Update file>'
        }
    })
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1; //convert a string to a Number
    const tour = tours.find(el => el.id === id)

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: 'success',
        data: null
    })
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

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
app
   .route('/api/v1/tours')
   .get(getAllTours)
   .post(createTour);



app
   .route('/api/v1/tours/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour)

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);


app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) START SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`App runing on port ${port}...`);
});


