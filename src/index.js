"use strict";
exports.__esModule = true;
exports.useModal = void 0;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
function useModal(_a) {
    var Component = _a.Component;
    var containerIdPostfix = react_1.useState(getRandomPostfix)[0];
    var onResolve = function (resolve) {
        return function (result) {
            cleanupContainer();
            resolve(result);
        };
    };
    var showModal = function () {
        return new Promise(function (resolve) {
            createModal(resolve);
        });
    };
    var createModal = function (resolve) {
        var body = document.querySelector("body");
        var modalContainer = document.createElement("div");
        modalContainer.setAttribute("id", "modal__" + containerIdPostfix);
        body === null || body === void 0 ? void 0 : body.appendChild(modalContainer);
        react_dom_1["default"].render(<Component onResolve={onResolve(resolve)}/>, modalContainer);
    };
    var cleanupContainer = function () {
        var body = document.querySelector("body");
        var modalContainer = document.querySelector("div#modal__" + containerIdPostfix);
        if (!modalContainer || !body) {
            return;
        }
        body.removeChild(modalContainer);
    };
    return showModal;
}
exports.useModal = useModal;
var getRandomPostfix = function () { return Math.random().toString(36).substring(2); };
