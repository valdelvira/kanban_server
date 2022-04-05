module.exports = app => {
    app.use((req, res, next) => {
        res.status(404).json({
            message: 'Not Found'
        })
    })
    app.use((err, req, res, next) => {
        console.error("ERROR", req.method, req.path, err)
        if (!res.headersSent) {
            res
                .status(err.status || 500)
                .json({
                    message: err.message
                })
        }
    })
}
