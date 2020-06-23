//const fs = require('fs');
const Tour = require('./../models/tourModel');
const e = require('express');
const { Query } = require('mongoose');
const { listen } = require('../app');


// const tours = JSON.parse(
//     fs.readFileSync('./dev-data/data/tours-simple.json')
//     );

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     // if (req.params.id * 1 > tours.length) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'Invalid ID'
//     //     });
//     // }
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
//     next();
// }

//this middleware, permit to modify req on behalf of the user query
exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5';
    req.query.sort ='-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

// ---> REFACTORING <---

exports.getAllTours = async (req, res) => {

    //Query all asset on the DB
    try {
        //BUILD & Check for Query Request
        //console.log(req.query)

        //--1) Normal Filtering

        const queryObj = {...req.query}
        const excludedFields = ['page','sort','limit','fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //console.log(req.query, queryObj);


        //Query DB Case 0

        
        
        // Query CHAINING Prototype

        //  //Query DB Case 1
        // const tours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });  
        //Query DB Case 2
        // const tours = await Tour.find()
        //                         .where('duration')
        //                         .equals(5)
        //                         .where('difficulty')
        //                         .equals('easy')

        //--2) Advanced Filtering

        // { difficulty : 'easy', duration: {$gte: 5}} //mongo format
        // { difficulty: 'easy', duration: { gte: '5'}} // req.query format
        //need to match [gte, gt, lte, lt] and change it to $gte, $gt, $lte which is mongo format
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        //--3) Sorting
        //console.log(req.query.sort)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            //console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');  //this will be as a default filtering , if the user doesn't specify
        }

        //--4) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);  
        }else {
            query = query.select('-__v')
        }

        //--5) Pagination
        
        const page = req.query.page * 1 || 1;// or giv it the default value of 1
        const limit = req.query.limit * 1 || 100; //giv it the default of 100
        const skip = (page -1) * limit;

        //page=2&limit=10, 1-10,page1; 11-20,page2 ; 21-30,page3
        //query = query.skip(10).limit(10);

        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const numTours = await Tour.countDocuments(); //get the amount of document on db
            if (skip >= numTours) throw new Error('This page does not Exist')
        }
    
     
        //EXECUTE QUERY
        //now we have query.sort().select().skip().limit()
        const tours = await query;
                                
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });  

    }catch(err) {
       res.status(404).json({
           status: 'fail',
           message: err
       })
    }
};

exports.getTour = async (req, res) => {
    //Using findByID to return Id document
    try {
       const tour = await Tour.findById(req.params.id);
       //Tour.findOne({_id: req.params.id})

       res.status(200).json({
        status: 'success',
        data: {
             tour
        }
    });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })

    }

 
};

exports.createTour = async (req, res) => {
    //Create new Tour on DB
    try {
    const newTour = await Tour.create(req.body);

      res.status(201).json({
          status: 'success',
          data: {
              tour: newTour
          }
      });

    }catch(err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent!'
        })
    }

    };

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, 
            {new: true,
             runValidators: true
            })
        res.status(200).json({
            status: 'success',
            data: {
                 tour
             }
        })

    }
    catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })

    }
    
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        

    res.status(204).json({
        status: 'success',
        data: null
    })
   } catch(err) {
    res.status(404).json({
        status: 'fail',
        message: err
    })

 }
};

