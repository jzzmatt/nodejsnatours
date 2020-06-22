const mongoose = require('mongoose');

//Create SCHEMA
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    }
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