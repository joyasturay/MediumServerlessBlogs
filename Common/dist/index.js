"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostSchema = exports.updatePostSchema = exports.postSchema = exports.signUpSchema = exports.signInSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signInSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.signUpSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string().optional(),
});
exports.postSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    content: zod_1.default.string().min(1),
});
exports.updatePostSchema = zod_1.default.object({
    id: zod_1.default.string().min(1),
    title: zod_1.default.string().min(1),
    content: zod_1.default.string().min(1),
});
exports.deletePostSchema = zod_1.default.object({
    id: zod_1.default.string().min(1),
});
//# sourceMappingURL=index.js.map