"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoFetchMock = void 0;
const fetch_1 = require("./fetch");
class RemolDemoFetchMock extends fetch_1.RemolDemoFetch {
    static timeout() {
        return 700;
    }
    static data(pathname, method, body) {
        throw new Error('implement');
    }
    static async fetch(url, init = {}) {
        var _a, _b, _c;
        if (url.startsWith('/'))
            url = window.location.origin + url;
        const p = new URL(url);
        const method = (_a = init.method) !== null && _a !== void 0 ? _a : 'GET';
        const body = init.body ? JSON.parse(init.body.toString()) : (_c = { id: (_b = p.searchParams.get('id')) === null || _b === void 0 ? void 0 : _b.split(',') }) !== null && _c !== void 0 ? _c : [];
        const obj = this.data(p.pathname, method, body);
        if (obj === undefined)
            return super.fetch(url, init);
        const json = JSON.parse(JSON.stringify(obj));
        const res = new Response();
        res.json = () => {
            const pr = Promise.resolve(json);
            pr.then(() => {
                console.log('<-', method, p.pathname, json);
            });
            return pr;
        };
        console.log('->', method, p.pathname, init.body);
        const res2 = await new Promise(resolve => setTimeout(() => resolve(res), this.timeout()));
        return res2;
    }
}
exports.RemolDemoFetchMock = RemolDemoFetchMock;
//# sourceMappingURL=mock.js.map