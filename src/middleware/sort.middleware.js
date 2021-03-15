const sortMiddleware = (req, res, next) => {
    res.locals.sort = {
        enable: false,
        type: 'default'
    }

    // if (req.query.sort) {
    //     res.locals._sort.enable = true
    //     res.locals._sort.type = req.query.sortBy
    // }
}

module.exports = sortMiddleware