"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Only allow resources from the same origin
            scriptSrc: ["'self'", "'unsafe-inline'"], // Allow inline scripts
            objectSrc: ["'none'"], // Disallow <object> elements
        },
    },
    xssFilter: true, // Prevent cross-site scripting (XSS) attacks
    noSniff: true, // Prevent browsers from interpreting files as a different MIME type
    frameguard: { action: "deny" }, // Prevent the site from being embedded in frames
    hidePoweredBy: true, // Hide the "X-Powered-By" header
});
exports.default = helmetConfig;
