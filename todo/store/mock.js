"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoTodoStoreMock = void 0;
const mock_1 = require("../../model/mock");
class RemolDemoTodoStoreMock extends mock_1.RemolDemoStoreMock {
    max() {
        return 1;
    }
    create(id) {
        return {
            id,
            title: 'todo #' + id,
            checked: false,
        };
    }
    data(pathname, method, body) {
        if (pathname === '/todo' && method === 'GET' && body.id)
            return this.get(body.id);
        if (pathname === '/todo' && method === 'PATCH')
            return this.patch(body);
        if (pathname === '/todos' && method === 'GET')
            return this.list();
        if (pathname === '/todos/complete' && method === 'PATCH')
            return this.completeAll();
        if (pathname === '/todos/complete' && method === 'DELETE')
            return this.clearCompleted();
        if (pathname === '/todos/toggle' && method === 'PATCH')
            return this.toggleAll();
    }
    list(filter) {
        const ids = [];
        let activeCount = 0;
        const todos = Object.values(this.items);
        for (const todo of todos) {
            ids.push(todo.id);
            activeCount += todo.checked ? 0 : 1;
        }
        return {
            data: {
                ids,
                activeCount,
                completedCount: todos.length - activeCount,
            },
        };
    }
    toggleAll() {
        const items = Object.values(this.items);
        const checked = !!items.find(todo => !todo.checked);
        for (const todo of items) {
            todo.checked = checked;
        }
        return {
            data: {
                ids: items.map(todo => todo.id),
            },
        };
    }
    completeAll() {
        const items = Object.values(this.items);
        for (const todo of items) {
            todo.checked = true;
        }
        return {
            data: {
                ids: items.map(todo => todo.id),
            },
        };
    }
    clearCompleted() {
        const items = Object.values(this.items);
        for (const todo of items) {
            if (todo.checked)
                delete this.items[todo.id];
            todo.checked = true;
        }
        return {
            data: {
                ids: items.map(todo => todo.id),
            },
        };
    }
}
exports.RemolDemoTodoStoreMock = RemolDemoTodoStoreMock;
//# sourceMappingURL=mock.js.map