const express = require('express');
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.
app.use('/api', apiRoutes);

// Default response for any other request (Not Found). [catchall route]
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;

    console.log('Database connected.');
    // The function that will start the Express.js server on port 3001.
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});