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
exports.RemolDemoCounterFunc = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
let some = 1;
exports.RemolDemoCounterFunc = react_2.Remol.fc(function RemolDemoCounterFunc(p) {
    const { value } = react_2.Remol.mem(0, {
        value(next) {
            return next !== null && next !== void 0 ? next : 0;
        },
    });
    const { add } = react_2.Remol.action({
        add() {
            value(value() + 1);
        },
    });
    return (react_1.default.createElement("div", { id: p.id },
        react_1.default.createElement(TestInput, { key: 1, some: value() }),
        react_1.default.createElement(TestInput2, null),
        react_1.default.createElement(TestInput3, null),
        react_1.default.createElement("h3", null, "RemolDemoCounterFunc"),
        value(),
        react_1.default.createElement("button", { id: `${p.id}_add`, onClick: () => add() }, "Add")));
});
const TestInput = react_1.default.memo(function TestInput(p) {
    const [v, setValue] = react_1.default.useState('');
    return react_1.default.createElement("input", { onChange: e => setValue(e.target.value), value: v });
});
class TestInput2 extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.v = '';
    }
    render() {
        return (react_1.default.createElement("input", { onChange: e => {
                this.v = e.target.value;
                this.forceUpdate();
            }, value: this.v, placeholder: "klass" }));
    }
}
class TestInput3 extends react_2.Remol {
    v(next) {
        return next !== null && next !== void 0 ? next : '';
    }
    sub() {
        return (react_1.default.createElement("input", { onChange: e => {
                this.v(e.target.value);
            }, value: this.v(), placeholder: "remol klass" }));
    }
}
__decorate([
    (0, core_1.mem)(0)
], TestInput3.prototype, "v", null);
//# sourceMappingURL=func.js.map