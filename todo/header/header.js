"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoHeader = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
const model_1 = require("../../model/model");
const store_1 = require("../store/store");
const theme_1 = require("./theme");
class RemolDemoTodoHeader extends react_2.Remol {
    get store() {
        return this.$.get(store_1.RemolDemoTodoStore.instance);
    }
    title(next) {
        return next !== null && next !== void 0 ? next : '';
    }
    setTitle(e) {
        this.title(e.target.value);
    }
    setRef(ref) {
        ref === null || ref === void 0 ? void 0 : ref.focus();
    }
    submitStatus() {
        return new core_1.RemolActionQueue();
    }
    submit(e) {
        if (e.key !== 'Enter' || !this.title())
            return;
        this.submitStatus().run(() => {
            this.store.item(model_1.RemolModel.createId()).title(this.title());
            this.title('');
        });
    }
    toggleAllStatus() {
        return new core_1.RemolActionQueue();
    }
    toggleAll() {
        return (e) => {
            this.toggleAllStatus().run(() => {
                this.store.toggleAll();
            });
        };
    }
    sub({ id } = this.props) {
        // const checked = this.store.activeTodoCount2 === 0
        const checked = this.store.activeTodoCount() === 0;
        return (react_1.default.createElement("header", { id: id, className: theme_1.remolDemoTodoTheme.header },
            react_1.default.createElement("input", { id: `${id}_toggleAll`, className: theme_1.remolDemoTodoTheme.toggleAll, disabled: this.toggleAllStatus().pending, type: "checkbox", onChange: this.toggleAll(), checked: checked }),
            react_1.default.createElement("input", { id: `${id}_input`, className: theme_1.remolDemoTodoTheme.newTodo, placeholder: "What needs to be done?", onInput: this.setTitle, ref: this.setRef, disabled: this.submitStatus().pending, value: this.title(), onKeyDown: this.submit })));
    }
}
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoHeader.prototype, "title", null);
__decorate([
    core_1.action.sync
], RemolDemoTodoHeader.prototype, "setTitle", null);
__decorate([
    core_1.action
], RemolDemoTodoHeader.prototype, "setRef", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoHeader.prototype, "submitStatus", null);
__decorate([
    core_1.action
], RemolDemoTodoHeader.prototype, "submit", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoHeader.prototype, "toggleAllStatus", null);
__decorate([
    core_1.action.factory
], RemolDemoTodoHeader.prototype, "toggleAll", null);
exports.RemolDemoTodoHeader = RemolDemoTodoHeader;
//# sourceMappingURL=header.js.map