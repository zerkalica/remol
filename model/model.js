"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolModel = void 0;
const core_1 = require("@remol/core");
const fetch_1 = require("../fetch/fetch");
class RemolModel extends Object {
    constructor($ = core_1.RemolContext.instance) {
        super();
        this.$ = $;
    }
    static createId() {
        return crypto.randomUUID() || (0, core_1.remolFail)(new Error('Crypto.randomUUID() not supported, update your browser'));
    }
    get fetcher() {
        return this.$.get(fetch_1.RemolDemoFetch);
    }
    id(next) {
        return next !== null && next !== void 0 ? next : RemolModel.createId();
    }
    dto_pick(field, next) {
        return this.dto(next === undefined ? undefined : { ...this.dto(), [field]: next })[field];
    }
    dto(next) {
        throw new Error('implement');
    }
    get pending() {
        return this.patching() instanceof Promise;
    }
    get error() {
        const v = this.patching();
        return v instanceof Error ? v : undefined;
    }
    patching(next) {
        return next !== null && next !== void 0 ? next : null;
    }
    remove() {
        try {
            this.dto(null);
            this.patching(null);
        }
        catch (error) {
            this.patching(error);
            (0, core_1.remolFail)(error);
        }
    }
}
__decorate([
    (0, core_1.mem)(0)
], RemolModel.prototype, "id", null);
__decorate([
    (0, core_1.mem)(1)
], RemolModel.prototype, "dto_pick", null);
__decorate([
    (0, core_1.mem)(0)
], RemolModel.prototype, "patching", null);
__decorate([
    core_1.action
], RemolModel.prototype, "remove", null);
__decorate([
    core_1.action
], RemolModel, "createId", null);
exports.RemolModel = RemolModel;
//# sourceMappingURL=model.js.map