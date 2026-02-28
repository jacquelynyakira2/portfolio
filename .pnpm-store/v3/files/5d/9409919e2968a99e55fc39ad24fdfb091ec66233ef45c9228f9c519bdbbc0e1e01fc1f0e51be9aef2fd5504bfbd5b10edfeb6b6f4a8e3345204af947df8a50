"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markVariableAsUsed = exports.findVariable = exports.getScope = exports.getSourceCode = void 0;
const utils_1 = require("@typescript-eslint/utils");
function getSourceCode(context) {
    if (typeof context.getSourceCode === "function") {
        return context.getSourceCode();
    }
    return context.sourceCode;
}
exports.getSourceCode = getSourceCode;
function getScope(context, node) {
    const sourceCode = getSourceCode(context);
    if (typeof sourceCode.getScope === "function") {
        return sourceCode.getScope(node);
    }
    if (typeof context.getScope === "function") {
        return context.getScope();
    }
    return context.sourceCode.getScope(node);
}
exports.getScope = getScope;
function findVariable(context, node) {
    return utils_1.ASTUtils.findVariable(getScope(context, node), node);
}
exports.findVariable = findVariable;
function markVariableAsUsed(context, name, node) {
    if (typeof context.markVariableAsUsed === "function") {
        context.markVariableAsUsed(name);
    }
    else {
        getSourceCode(context).markVariableAsUsed(name, node);
    }
}
exports.markVariableAsUsed = markVariableAsUsed;
