"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoUserStore = void 0;
const core_1 = require("@remol/core");
const fetch_1 = require("../fetch/fetch");
class RemolDemoUserStore {
    constructor($ = core_1.RemolContext.instance) {
        this.$ = $;
    }
    get fetcher() {
        return this.$.get(fetch_1.RemolDemoFetch);
    }
    user(id, next) {
        if (next) {
            console.log('saving user');
            return next; // PUT to server
        }
        return this.fetcher.response(`https://reqres.in/api/users/${id}?delay=1`).json().data;
    }
}
__decorate([
    (0, core_1.mem)(1)
], RemolDemoUserStore.prototype, "user", null);
exports.RemolDemoUserStore = RemolDemoUserStore;
//# sourceMappingURL=store.js.map