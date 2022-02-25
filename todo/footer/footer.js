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
exports.RemolDemoTodoFooter = void 0;
const React = __importStar(require("react"));
const core_1 = require("@remol/core");
const react_1 = require("@remol/react");
const location_1 = require("../../location/location");
const store_1 = require("../store/store");
const theme_1 = require("./theme");
class RemolDemoTodoFooter extends react_1.Remol {
    constructor() {
        super(...arguments);
        this.css = theme_1.RemolTodoFooterTheme.css;
    }
    linkCss(isSelected) {
        return isSelected ? this.css.linkSelected : this.css.linkRegular;
    }
    get store() {
        return this.$.get(store_1.RemolDemoTodoStore.instance);
    }
    get location() {
        return this.$.get(location_1.RemolDemoLocation.instance);
    }
    filterLink(id) {
        return this.location.url({ todo_filter: id });
    }
    clickLink(e) {
        e.preventDefault();
        const linkid = e.target.dataset.linkid;
        if (!linkid)
            return;
        this.store.filter(linkid);
    }
    clearCompletedStatus() {
        return new core_1.RemolActionQueue();
    }
    clearCompleted(e) {
        this.clearCompletedStatus().run(() => {
            this.store.clearCompleted();
        });
    }
    sub({ id } = this.props, store = this.store) {
        if (store.activeTodoCount() === 0 && store.completedCount === 0)
            return null;
        return (React.createElement("footer", { id: id, className: this.css.footer },
            React.createElement("span", { className: this.css.todoCount, id: `${id}_count` },
                React.createElement("strong", { id: `${id}_number` }, store.activeTodoCount()),
                " item(s) left"),
            React.createElement("ul", { className: this.css.filters, id: `${id}_filters` }, RemolDemoTodoFooter.links.map(link => (React.createElement("li", { key: link.id, className: this.css.filterItem, id: `${id}_link["${link.id}"]` },
                React.createElement("a", { id: `${id}_link["${link.id}"].href`, className: this.linkCss(store.filter() === link.id), href: this.filterLink(link.id), "data-linkid": link.id, onClick: this.clickLink }, link.title))))),
            store.completedCount !== 0 && (React.createElement("button", { id: `${id}_clear`, className: this.css.clearCompleted, disabled: this.clearCompletedStatus().pending, onClick: this.clearCompleted }, "Clear completed"))));
    }
}
RemolDemoTodoFooter.links = [
    {
        id: store_1.TODO_FILTER.ALL,
        title: 'All',
    },
    {
        id: store_1.TODO_FILTER.ACTIVE,
        title: 'Active',
    },
    {
        id: store_1.TODO_FILTER.COMPLETE,
        title: 'Completed',
    },
];
__decorate([
    core_1.action
], RemolDemoTodoFooter.prototype, "clickLink", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoFooter.prototype, "clearCompletedStatus", null);
__decorate([
    core_1.action
], RemolDemoTodoFooter.prototype, "clearCompleted", null);
exports.RemolDemoTodoFooter = RemolDemoTodoFooter;
//# sourceMappingURL=footer.js.map