require('dotenv').config();
const express = require('express');
const errorHandler = require('./middleware/errorMiddleware');
const router = require('./routers/index');
const fileUpload = require('express-fileupload');
const path = require('path');
const logger = require('./logger');

const app = express();
app.use(express.json());
app.use(fileUpload({}))
app.use(express.static(path.resolve(__dirname, 'static')));
app.use('/api', router);


app.use(errorHandler.errorMiddleware)

app.listen(process.env.PORT, () => {
    logger.info(`server started on ${process.env.PORT}`);
});