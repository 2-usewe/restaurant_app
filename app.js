var express = require("express");
var app = express();
var path = require("path");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT||8080;
//db 
const {sequelize,mongoose}=require('./dbs/connectDB');
const cron=require('node-cron');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//user routes
const userRouter = require('./routers/user');
const categoryRouter = require("./routers/menuCategory");
const itemRouter = require("./routers/item");
const { syncData } = require("./dataSync");
app.use('/api/v1/user',userRouter);
app.use('/api/v1/menu/category',categoryRouter);
app.use('/api/v1/menu/item',itemRouter);

//call the cron job
cron.schedule('*/10 * * * *', () => {
    syncData();
});

app.listen(PORT, function (err) {
    if (err) {
        console.log("Error in server setup");
    }
    console.log("Server listening on Port", PORT);
});

app.use((req, res) => {
    res.status(404).send("Not Found");
});