import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
    statusCode = 400
    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters')
        // only because we are extending a built in class 'Error'
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
    serializeErrors() {
        return this.errors.filter(err => err.type === 'field').map(err => {
            return {message: err.msg, field: err.path}
        })
    }
}