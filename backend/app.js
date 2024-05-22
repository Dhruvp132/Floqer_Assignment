const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

const dataRoutes = require("./routes/dataRoutes.js");
app.use(express.json());
app.use('/api/salaries', dataRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});