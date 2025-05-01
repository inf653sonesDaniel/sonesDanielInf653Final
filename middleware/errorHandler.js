//middleware/errorHandler.js
const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
};

// Utility for manual try/catch error responses
const handleServerError = (req, res, error, userMessage = "Internal server error") => {
    logEvents(`ERROR: ${req.method} ${req.originalUrl} - ${error.message}`, 'errorLog.txt');
        res.status(500).json({ error: error.message });
};

module.exports = {
    errorHandler,        // used with next(err)
    handleServerError    // used inside try/catch
};