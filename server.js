const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Environement Setup
dotenv.config({path: './config.env'});
const app = require('./app');

//Connect Mongoose to MONGODB
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successful!'));


//START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App runing on port ${port}...`);
});


