const { Sequelize } = require('sequelize');

// Initialize Sequelize with MySQL connection parameters
const sequelize = new Sequelize(process.env.MYSQL_URI);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false })
        console.log('Connected to MySQL using Sequelize');
    } catch (error) {
        console.error('Unable to connect to MySQL:', error);
    }
})();



const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('MongoDB using Mongoose connected.');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

module.exports = {sequelize,mongoose};
