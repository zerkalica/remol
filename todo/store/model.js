"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoModel = void 0;
const core_1 = require("@remol/core");
class RemolDemoTodoModel extends Object {
    constructor(id = 'RemolDemoTodo') {
        super();
        this[Symbol.toStringTag] = id;
    }
    title(next) {
        var _a;
        return (_a = this.dto_pick('title', next)) !== null && _a !== void 0 ? _a : 'test';
    }
    pipe() {
        return new core_1.RemolActionQueue();
    }
    toggle() {
        console.log(this.id(), 'checked=', this.checked());
        const checked = this.checked();
        this.toggle2(!checked);
    }
    toggle2(checked) {
        this.checked(!checked);
    }
    checked(next) {
        var _a;
        return (_a = this.dto_pick('checked', next)) !== null && _a !== void 0 ? _a : false;
    }
    id(next) {
        return this.dto_pick('id', next);
    }
    dto_pick(field, value) {
        const prev = this.dto();
        if (value === undefined)
            return prev[field];
        const next = this.dto({ ...prev, [field]: value });
        return next[field];
    }
    dto(next) {
        return next !== null && next !== void 0 ? next : {};
    }
    get pending() {
        return this.status() === true;
    }
    get error() {
        const v = this.status();
        return v instanceof Error ? v : undefined;
    }
    status(next) {
        return next !== null && next !== void 0 ? next : false;
    }
    remove() {
        this.update(null);
    }
    update(patch) {
        try {
            this.dto(patch);
            this.status(false);
        }
        catch (error) {
            this.status(error instanceof Promise ? true : error);
            (0, core_1.remolFail)(error);
        }
    }
}
Symbol.toStringTag;
RemolDemoTodoModel.instance = new RemolDemoTodoModel();
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoModel.prototype, "pipe", null);
__decorate([
    core_1.action
], RemolDemoTodoModel.prototype, "toggle", null);
__decorate([
    core_1.action
], RemolDemoTodoModel.prototype, "toggle2", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoModel.prototype, "id", null);
__decorate([
    (0, core_1.mem)(1)
], RemolDemoTodoModel.prototype, "dto_pick", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoModel.prototype, "dto", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoModel.prototype, "status", null);
__decorate([
    core_1.action
], RemolDemoTodoModel.prototype, "update", null);
exports.RemolDemoTodoModel = RemolDemoTodoModel;
//# sourceMappingURL=model.js.map