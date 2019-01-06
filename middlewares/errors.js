exports.simpleNotFoud = (req, res, next) => {

    res.status(404).render('404');
}

exports.notFound = (req, res, next) => {
    const err = new Error('404 page not found');
    err.status = 404;
    next(err);
};

exports.catchErrors = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        // code: 'code: '+err.code,
        // status: 'sta: '+ err.status,
        // message: err.message,
        error: err
    });
};