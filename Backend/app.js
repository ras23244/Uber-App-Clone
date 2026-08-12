const dotenv=require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors')
const connectToDb=require('./db/db')
const userRoutes= require('./routes/user.routes')
const captainRoutes= require('./routes/captain.routes')
const mapsRoutes = require('./routes/maps.routes')
const rideRoutes = require('./routes/ride.routes')
const errorHandler = require('./middlewares/errorHandler');

connectToDb()

const app=express();
const cookieParser= require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: 'https://ridebookingapp-o6ko.onrender.com',
    credentials: true
}));
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("Hello")
})


app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps',mapsRoutes);
app.use('/rides',rideRoutes);

app.use(errorHandler);

module.exports=app;
