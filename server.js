const express = require('express');
const app = express();
const storeRoute = require('./route/store.route');
const bookRoute = require('./route/book.route');
const userRoute = require('./route/user.route');
var cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const port = 3000;
// const noteRouter = require('./route/noteRouter')
// middleware used to enable cross origin request
app.use(cors());


// using body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {

    res.send('server started..........');
});

// app.use('/api', noteRouter);

app.use('/api/v1', storeRoute);
app.use('/api/v1', bookRoute);
app.use('/api/v1', userRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
module.exports = app