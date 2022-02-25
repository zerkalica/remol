"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoStore = exports.TODO_FILTER = void 0;
const core_1 = require("@remol/core");
const fetch_1 = require("../../fetch/fetch");
const location_1 = require("../../location/location");
const model_1 = require("./model");
var TODO_FILTER;
(function (TODO_FILTER) {
    TODO_FILTER["ALL"] = "all";
    TODO_FILTER["COMPLETE"] = "complete";
    TODO_FILTER["ACTIVE"] = "active";
})(TODO_FILTER = exports.TODO_FILTER || (exports.TODO_FILTER = {}));
class RemolDemoTodoStore extends core_1.RemolContextObject {
    get fetcher() {
        return this.$.get(fetch_1.RemolDemoFetch);
    }
    reset(next) {
        return new Date().getTime();
    }
    list_last(next) {
        return next;
    }
    list_real() {
        this.reset();
        return this.fetcher.response('/todos').json();
    }
    list() {
        try {
            const list = this.list_real();
            this.list_last(list);
            return list;
        }
        catch (error) {
            const last = this.list_last();
            if (error instanceof Promise && last)
                return last;
            (0, core_1.remolFail)(error);
        }
    }
    ids() {
        return this.list().data.ids;
    }
    prefetched() {
        const ids = this.ids();
        this.reset();
        return this.fetcher.batch('/todo?id=' + ids.join(','));
    }
    dto(id, next) {
        var _a;
        if (next !== undefined) {
            // throw new Error('test')
            const updated = this.fetcher.batch('/todo', {
                method: 'PATCH',
                body: JSON.stringify({ [id]: next }),
            })[id];
            this.reset(null);
            return updated !== null && updated !== void 0 ? updated : {};
        }
        return ((_a = this.prefetched()[id]) !== null && _a !== void 0 ? _a : {
            id,
            title: '',
            checked: false,
        });
    }
    item(id) {
        const todo = new model_1.RemolDemoTodoModel(`${this[Symbol.toStringTag]}.item("${id}")`);
        todo.dto = this.dto.bind(this, id);
        return todo;
    }
    items() {
        return this.ids().map(id => this.item(id));
    }
    fetch(url, init) {
        const res = this.fetcher.response(url, init).json();
        this.reset(null);
        return res;
    }
    get location() {
        return this.$.get(location_1.RemolDemoLocation.instance);
    }
    get activeTodoCount2() {
        const count = this.list().data.activeCount;
        return count;
    }
    activeTodoCount() {
        const count = this.list().data.activeCount;
        return count;
    }
    get completedCount() {
        return this.list().data.completedCount;
    }
    filter(next) {
        var _a;
        return (_a = this.location.value('todo_filter', next)) !== null && _a !== void 0 ? _a : TODO_FILTER.ALL;
    }
    get filteredTodos() {
        const todos = this.items();
        switch (this.filter()) {
            case TODO_FILTER.ALL:
                return todos;
            case TODO_FILTER.COMPLETE:
                return todos.filter(todo => !!todo.checked());
            case TODO_FILTER.ACTIVE:
                return todos.filter(todo => !todo.checked());
        }
    }
    toggleAll() {
        this.fetch('/todos/toggle', { method: 'PATCH' });
    }
    completeAll() {
        this.fetch('/todos/complete', { method: 'PATCH' });
    }
    clearCompleted() {
        this.fetch('/todos/complete', { method: 'DELETE' });
    }
}
RemolDemoTodoStore.instance = new RemolDemoTodoStore();
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "reset", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "list_last", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "list_real", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "list", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "ids", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "prefetched", null);
__decorate([
    (0, core_1.mem)(1)
], RemolDemoTodoStore.prototype, "dto", null);
__decorate([
    (0, core_1.mem)(1)
], RemolDemoTodoStore.prototype, "item", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "items", null);
__decorate([
    core_1.field
], RemolDemoTodoStore.prototype, "activeTodoCount2", null);
__decorate([
    (0, core_1.mem)(0)
], RemolDemoTodoStore.prototype, "activeTodoCount", null);
__decorate([
    core_1.field
], RemolDemoTodoStore.prototype, "completedCount", null);
__decorate([
    core_1.field
], RemolDemoTodoStore.prototype, "filteredTodos", null);
__decorate([
    core_1.action
], RemolDemoTodoStore.prototype, "toggleAll", null);
__decorate([
    core_1.action
], RemolDemoTodoStore.prototype, "completeAll", null);
__decorate([
    core_1.action
], RemolDemoTodoStore.prototype, "clearCompleted", null);
exports.RemolDemoTodoStore = RemolDemoTodoStore;
//# sourceMappingURL=store.js.map