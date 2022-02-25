"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoDemoFetchBatch = exports.RemoDemoFetchBatchError = void 0;
class RemoDemoFetchBatchError extends Error {
    constructor(p) {
        var _a;
        super(`${p.input}: [${p.id}], ${p.cause.code} (${(_a = p.cause.message) !== null && _a !== void 0 ? _a : ''})`);
        this.cause = p === null || p === void 0 ? void 0 : p.cause;
    }
    get code() {
        var _a;
        return (_a = this.cause) === null || _a === void 0 ? void 0 : _a.code;
    }
}
exports.RemoDemoFetchBatchError = RemoDemoFetchBatchError;
class RemoDemoFetchBatch extends Object {
    constructor(input, errors) {
        super();
        this.input = input;
        this.errors = errors;
    }
    static response(input, res) {
        return res.errors ? new Proxy(res.data, new RemoDemoFetchBatch(input, res.errors)) : res.data;
    }
    get(data, id) {
        const error = this.errors[id];
        if (error === undefined)
            return data[id];
        throw new RemoDemoFetchBatchError({ id, cause: error, input: this.input });
    }
}
exports.RemoDemoFetchBatch = RemoDemoFetchBatch;
//# sourceMappingURL=batch.js.map