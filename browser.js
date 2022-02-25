"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = require("react-dom");
const core_1 = require("@remol/core");
const react_2 = require("@remol/react");
const fetch_1 = require("./fetch/fetch");
const mock_1 = require("./fetch/mock");
const page_1 = require("./page/page");
const mock_2 = require("./todo/store/mock");
const id = 'remol_demo';
const el = document.getElementById(id + '_main');
const root = (0, react_dom_1.createRoot)(el);
class RemolDemoFetchMockApp extends mock_1.RemolDemoFetchMock {
    static data(pathname, method, body) {
        return this.todos.data(pathname, method, body);
    }
}
RemolDemoFetchMockApp.todos = new mock_2.RemolDemoTodoStoreMock();
const $ = new core_1.RemolContext().set(fetch_1.RemolDemoFetch, RemolDemoFetchMockApp);
root.render(react_1.default.createElement(react_2.Remol.Provide$, { value: $, children: react_1.default.createElement(page_1.RemolDemoPage, { id: id }) }));
//# sourceMappingURL=browser.js.map