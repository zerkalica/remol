"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoFetch = void 0;
const core_1 = require("@remol/core");
const batch_1 = require("./batch");
class RemolDemoFetch {
    static fetch(input, init = {}) {
        return window.fetch(input, init);
    }
    static request(input, init = {}) {
        let ctl = new AbortController();
        const promise = this.fetch(input, {
            ...init,
            signal: ctl.signal,
        }).finally(() => {
            ctl = undefined;
        });
        return Object.assign(promise, {
            destructor() {
                ctl === null || ctl === void 0 ? void 0 : ctl.abort();
            },
        });
    }
    static response(input, init) {
        const response = (0, core_1.remolSync)(this).request(input, init);
        if (Math.floor(response.status / 100) === 2)
            return (0, core_1.remolSync)(response);
        throw new Error(response.statusText || `HTTP Error ${response.status}`);
    }
    static batch(input, init) {
        return batch_1.RemoDemoFetchBatch.response(input, this.response(input, init).json());
    }
}
__decorate([
    core_1.action
], RemolDemoFetch, "response", null);
__decorate([
    core_1.action
], RemolDemoFetch, "batch", null);
exports.RemolDemoFetch = RemolDemoFetch;
//# sourceMappingURL=fetch.js.map