export class TooManyRequestsError extends Error {
    retryAfter: number;

    constructor(message: string, retryAfter: number) {
        super(message)
        this.name = "TooManyRequestsError",
        this.retryAfter = retryAfter
    }
}