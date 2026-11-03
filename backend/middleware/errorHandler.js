const errorHandler = (err, req, res, next) => {
    console.error('API Error Stack:', err.stack || err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected server error occurred.',
        error: process.env.NODE_NODE_ENV === 'development' ? err : undefined
    });
};

module.exports = errorHandler;
