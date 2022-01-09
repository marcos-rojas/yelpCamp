class ExpressError extends Error{
    constructor(message, statusCode){
        super();
        this.statusCode = statusCode;
        this.message = message+'lol';
    }
}

module.exports = ExpressError;