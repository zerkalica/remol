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
exports.RemolDemoCounterKlass = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
class RemolDemoCounterKlass extends react_2.Remol {
    value(next) {
        return next !== null && next !== void 0 ? next : 0;
    }
    computed() {
        return 'val: ' + this.value();
    }
    add() {
        this.value(this.value() + 1);
    }
    sub(p = this.props) {
        return (react_1.default.createElement("div", { id: p.id },
            react_1.default.createElement("h3", null, "RemolDemoCounterKlass"),
            this.computed(),
            react_1.default.createElement("button", { id: `${p.id}_add`, onClick: () => this.add() }, "Add")));
    }
}
__decorate([
    (0, core_1.mem)(0)
], RemolDemoCounterKlass.prototype, "value", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoCounterKlass.prototype, "computed", null);
__decorate([
    core_1.action
], RemolDemoCounterKlass.prototype, "add", null);
exports.RemolDemoCounterKlass = RemolDemoCounterKlass;
//# sourceMappingURL=klass.js.map