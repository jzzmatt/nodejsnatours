const mongoose = require('mongoose');

//Create SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trime: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']

    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trime: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trime: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'] 
    },
    images: [String],

    createAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
});

//Create Model from the SCHEMA
const Tour = mongoose.model('Tour', tourSchema);

//Create a Document from the MODEL Created
// const testTour = new Tour({
//     name: 'The Forest Hiker',
//     rating: 4.7,
//     price: 497
// })

//this save the Document to the DB & return a promise
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('ERROR', err)
// }) 

module.exports = Tour;