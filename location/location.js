"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoLocation = void 0;
const core_1 = require("@remol/core");
class RemolDemoLocation extends Object {
    constructor($ = core_1.RemolContext.instance) {
        super();
        this.$ = $;
    }
    get history() {
        return this.$.get(globalThis.history);
    }
    get location() {
        return this.$.get(globalThis.location);
    }
    ns() {
        return 'app';
    }
    params() {
        return new URLSearchParams(this.location.search);
    }
    paramsToString(params) {
        const result = params.toString();
        return result ? `?${result}` : '';
    }
    url(next = {}, hash) {
        const params = this.params();
        const keys = Object.keys(next);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const val = next[key];
            if (val === null || val === undefined) {
                params.delete(key);
            }
            else {
                params.set(key, val);
            }
        }
        const q = this.paramsToString(params);
        return `${this.location.origin}${q}${hash ? `#${hash}` : ''}`;
    }
    pushState(params) {
        this.history.pushState(null, this.ns(), this.paramsToString(params));
    }
    value(key, next) {
        const params = this.params();
        if (next === undefined)
            return params.get(key);
        next === null ? params.delete(key) : params.set(key, String(next));
        this.pushState(params);
        return next;
    }
}
Symbol.toStringTag;
RemolDemoLocation.instance = new RemolDemoLocation();
__decorate([
    (0, core_1.mem)(1)
], RemolDemoLocation.prototype, "value", null);
exports.RemolDemoLocation = RemolDemoLocation;
//# sourceMappingURL=location.js.map