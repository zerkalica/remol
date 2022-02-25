"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoStoreMock = void 0;
class RemolDemoStoreMock extends Object {
    constructor() {
        super(...arguments);
        this.cache = undefined;
    }
    max() {
        return 5;
    }
    get items() {
        if (this.cache)
            return this.cache;
        const cache = (this.cache = {});
        for (let i = 0; i < this.max(); i++) {
            const id = crypto.randomUUID();
            cache[id] = this.create(id);
        }
        return cache;
    }
    list(filter) {
        return { data: { ids: Object.keys(this.items) } };
    }
    get(ids) {
        const data = {};
        for (const id of ids)
            data[id] = this.items[id];
        return { data };
    }
    patch(obj) {
        const data = {};
        for (let id in obj) {
            const next = obj[id];
            if (next === null) {
                delete this.items[id];
                continue;
            }
            if (!this.items[id])
                this.items[id] = next;
            else
                Object.assign(this.items[id], next);
            data[id] = this.items[id];
        }
        return { data };
    }
}
exports.RemolDemoStoreMock = RemolDemoStoreMock;
//# sourceMappingURL=mock.js.map