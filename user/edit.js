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
exports.RemolDemoUserEdit = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
const store_1 = require("./store");
class RemolDemoUserEdit extends react_2.Remol {
    constructor() {
        super(...arguments);
        this.errorCount = 0;
    }
    users() {
        return new store_1.RemolDemoUserStore(this.$);
    }
    userSelectedId(next) {
        return next !== null && next !== void 0 ? next : 1;
    }
    userSelected() {
        return this.users().user('' + this.userSelectedId());
    }
    userNext() {
        this.errorCount++;
        this.userSelectedId(this.userSelectedId() + 1);
    }
    userSave() {
        this.users().user('' + this.userSelectedId(), {
            first_name: this.userEditableName(),
        });
    }
    userEditableName(next) {
        return next !== null && next !== void 0 ? next : this.userSelected().first_name;
    }
    sub(p = this.props) {
        if (this.errorCount > 0 && this.errorCount % 3 === 0) {
            const str = 'fake error ' + this.errorCount;
            this.errorCount++;
            throw new Error(str);
        }
        return (react_1.default.createElement("div", { id: p.id, style: {
                minHeight: 50,
                minWidth: 100,
            } },
            react_1.default.createElement("h3", null, "RemolDemoUserEdit"),
            react_1.default.createElement("button", { type: "button", onClick: () => this.userNext() }, "Load Next"),
            react_1.default.createElement("p", null, "Click 3 times to generate error"),
            react_1.default.createElement("div", null,
                "Original: ",
                this.userSelected().first_name,
                this.userSelected().first_name === this.userEditableName() ? '' : ' [changed]'),
            react_1.default.createElement("input", { value: this.userEditableName(), onChange: e => {
                    this.userEditableName(e.target.value);
                } }),
            react_1.default.createElement("button", { type: "button", onClick: () => this.userSave() }, "Save"),
            react_1.default.createElement(Inner, { c: this.errorCount === 2 })));
    }
}
__decorate([
    (0, core_1.mem)(0)
], RemolDemoUserEdit.prototype, "users", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoUserEdit.prototype, "userSelectedId", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoUserEdit.prototype, "userSelected", null);
__decorate([
    core_1.action
], RemolDemoUserEdit.prototype, "userNext", null);
__decorate([
    core_1.action
], RemolDemoUserEdit.prototype, "userSave", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoUserEdit.prototype, "userEditableName", null);
exports.RemolDemoUserEdit = RemolDemoUserEdit;
function Inner(p) {
    if (p.c)
        throw new Error('Inner error');
    return react_1.default.createElement("div", null, "inner");
}
//# sourceMappingURL=edit.js.map