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
exports.RemolDemoList = void 0;
const react_1 = __importDefault(require("react"));
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
const f = (0, core_1.remolSync)({
    v() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(Math.random());
            }, 1000);
        });
    },
});
class RemolDemoList extends react_2.Remol {
    value(id, next) {
        console.log('load', id);
        return f.v();
    }
    sub(p = this.props) {
        return (react_1.default.createElement("div", { id: p.id },
            react_1.default.createElement("h3", null, "RemolDemoList"),
            [1, 2].map(id => (react_1.default.createElement(RemolDemoListItem, { key: id, value: this.value.bind(this, id) })))));
    }
}
__decorate([
    (0, core_1.mem)(1)
], RemolDemoList.prototype, "value", null);
exports.RemolDemoList = RemolDemoList;
class RemolDemoListItem extends react_1.default.Component {
    render() {
        return react_1.default.createElement("div", null,
            "item: ",
            this.props.value());
    }
}
//# sourceMappingURL=list.js.map