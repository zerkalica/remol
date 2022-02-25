"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemolDemoPage = void 0;
require("@remol/react/fallback.css");
const react_1 = __importDefault(require("react"));
const typestyle_1 = require("typestyle");
const react_2 = require("@remol/react");
const page_1 = require("../todo/page/page");
const css = (0, typestyle_1.stylesheet)({
    app: {
        display: 'grid',
        gridGap: '1rem',
        gridTemplateColumns: '1fr',
    },
});
class RemolDemoPage extends react_2.Remol {
    sub(p = this.props) {
        return (react_1.default.createElement("div", { id: p.id, className: css.app },
            react_1.default.createElement(page_1.RemolDemoTodoPage, { id: `${p.id}_todo` })));
    }
}
exports.RemolDemoPage = RemolDemoPage;
//# sourceMappingURL=page.js.map