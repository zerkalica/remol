"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoSnippet = void 0;
const React = __importStar(require("react"));
const core_1 = require("@remol/core");
const react_1 = require("@remol/react");
const model_1 = require("../store/model");
const theme_1 = require("./theme");
const theme = new theme_1.RemolDemoTodoSnippetTheme();
class RemolDemoTodoSnippet extends react_1.Remol {
    toggle() {
        this.props.todo.toggle();
    }
    remove() {
        this.props.todo.remove();
    }
    draft(next) {
        return next !== null && next !== void 0 ? next : null;
    }
    beginEdit() {
        const todo = this.props.todo;
        if (this.draft())
            return;
        if (todo.pending)
            return;
        const draft = new model_1.RemolDemoTodoModel(`${this.props.id}.draft()`);
        draft.dto(todo.dto());
        this.draft(draft);
    }
    submit() {
        const todo = this.props.todo;
        const draft = this.draft();
        if (!draft)
            return;
        const title = draft.title().trim();
        if (title) {
            if (todo.title() !== title) {
                todo.update(draft.dto());
            }
        }
        else {
            todo.remove();
        }
        this.draft(null);
    }
    submitOrRestore({ key }) {
        if (key === 'Escape')
            return this.draft(null);
        if (key === 'Enter')
            return this.submit();
    }
    setFocusRef(el) {
        el === null || el === void 0 ? void 0 : el.focus();
    }
    setTitle(e) {
        var _a;
        (_a = this.draft()) === null || _a === void 0 ? void 0 : _a.title(e.target.value.trim());
    }
    Form({ id, todo } = this.props, css = theme.css, draft = this.draft()) {
        if (!draft)
            return null;
        return (React.createElement("li", { id: id, className: css.editing },
            React.createElement("input", { id: `${id}_editing`, ref: this.setFocusRef, className: css.edit, disabled: todo.pending, value: draft.title(), onBlur: this.submit, onInput: this.setTitle, onKeyDown: this.submitOrRestore })));
    }
    View({ id, todo } = this.props, css = theme.css) {
        return (React.createElement("li", { id: id, className: css.regular },
            React.createElement("input", { id: `${id}_toggle`, className: css.toggle, type: "checkbox", disabled: todo.pending, checked: todo.checked(), onChange: this.toggle }),
            React.createElement("label", { id: `${id}_beginEdit`, className: theme.label(todo.checked(), todo.pending), onDoubleClick: this.beginEdit }, todo.title()),
            React.createElement("button", { id: `${id}_destroy`, className: css.destroy, disabled: todo.pending, onClick: this.remove })));
    }
    sub() {
        if (this.draft())
            return this.Form();
        else
            return this.View();
    }
}
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "toggle", null);
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "remove", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoSnippet.prototype, "draft", null);
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "beginEdit", null);
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "submit", null);
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "submitOrRestore", null);
__decorate([
    core_1.action
], RemolDemoTodoSnippet.prototype, "setFocusRef", null);
__decorate([
    core_1.action.sync
], RemolDemoTodoSnippet.prototype, "setTitle", null);
exports.RemolDemoTodoSnippet = RemolDemoTodoSnippet;
//# sourceMappingURL=snippet.js.map