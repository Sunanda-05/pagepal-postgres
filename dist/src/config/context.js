"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncLocalStorage = void 0;
exports.setUserContext = setUserContext;
exports.getCurrentUser = getCurrentUser;
const node_async_hooks_1 = require("node:async_hooks");
exports.asyncLocalStorage = new node_async_hooks_1.AsyncLocalStorage();
function setUserContext(req, res, next) {
    const user = req.user;
    exports.asyncLocalStorage.run({
        user: user,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    }, () => next());
}
function getCurrentUser() {
    return exports.asyncLocalStorage.getStore();
}
