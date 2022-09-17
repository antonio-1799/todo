import {StatusCodes} from "./enums.js";

export class ApiResponse {
    async success(res, message, data = null, statusCode = StatusCodes.OK) {
        return res.status(statusCode).json({
            message,
            data
        })
    }

    async successWithPagination(res, maxPage, currentPage, data = []) {
        return res.status(StatusCodes.OK).json({
            max_page: maxPage,
            current_page: currentPage,
            data
        })
    }

    async error(res, err, errorMessage = 'General Exception', statusCode = StatusCodes.INTERNAL_SERVER) {
        return res.status(statusCode).json({
            message: errorMessage,
            error: err
        })
    }
}