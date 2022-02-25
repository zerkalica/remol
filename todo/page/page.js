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
exports.RemolDemoTodoPage = void 0;
const react_1 = __importDefault(require("react"));
const typestyle_1 = require("typestyle");
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
const footer_1 = require("../footer/footer");
const header_1 = require("../header/header");
const list_1 = require("../list/list");
const store_1 = require("../store/store");
const css = (0, typestyle_1.stylesheet)({
    todoapp: {
        background: '#fff',
        border: '1px solid #ededed',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1)',
    },
});
class RemolDemoTodoPage extends react_2.Remol {
    store() {
        return new store_1.RemolDemoTodoStore(this.context);
    }
    get $() {
        return super.$.clone().set(store_1.RemolDemoTodoStore.instance, this.store());
    }
    sub({ id } = this.props) {
        return (react_1.default.createElement("div", { id: id, className: css.todoapp },
            react_1.default.createElement(header_1.RemolDemoTodoHeader, { id: `${id}_header` }),
            this.store().filteredTodos.length ? react_1.default.createElement(list_1.RemolDemoTodoList, { id: `${id}_list` }) : null,
            react_1.default.createElement(footer_1.RemolDemoTodoFooter, { id: `${id}_footer` })));
    }
}
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoPage.prototype, "store", null);
__decorate([
    core_1.field
], RemolDemoTodoPage.prototype, "$", null);
exports.RemolDemoTodoPage = RemolDemoTodoPage;
//# sourceMappingURL=page.js.map