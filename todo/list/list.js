"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoList = void 0;
const react_1 = __importDefault(require("react"));
const typestyle_1 = require("typestyle");
const react_2 = require("@remol/react");
const snippet_1 = require("../snippet/snippet");
const store_1 = require("../store/store");
const css = (0, typestyle_1.stylesheet)({
    todoList: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
    },
});
class RemolDemoTodoList extends react_2.Remol {
    sub({ id } = this.props, store = this.$.get(store_1.RemolDemoTodoStore.instance)) {
        return (react_1.default.createElement("ul", { id: id, className: css.todoList }, store.filteredTodos.map(todo => (react_1.default.createElement(snippet_1.RemolDemoTodoSnippet, { id: `${id}_todo["${todo.id()}"]`, key: todo.id(), todo: todo })))));
    }
}
exports.RemolDemoTodoList = RemolDemoTodoList;
//# sourceMappingURL=list.js.map