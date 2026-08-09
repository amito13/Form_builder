"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const trpc_1 = require("./trpc");
const zod_1 = require("zod");
const database_1 = require("@repo/database");
const schema = __importStar(require("@repo/database"));
const unstable_core_do_not_import_1 = require("@trpc/server/unstable-core-do-not-import");
exports.appRouter = (0, trpc_1.router)({
    health: trpc_1.publicProcedure.query(() => {
        return {
            message: "health check ok"
        };
    }),
    addTodo: trpc_1.publicProcedure.input(zod_1.z.object({
        title: zod_1.z.string().min(1).max(256),
        description: zod_1.z.string().max(1024).optional(),
    })).mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        try {
            const result = yield database_1.db.insert(schema.todos).values({
                title: input.title,
                description: input.description,
            }).returning();
            return result;
        }
        catch (error) {
            console.error("DATABASE ERROR:");
            console.dir(error, { depth: null });
            throw new unstable_core_do_not_import_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : String(error),
                cause: error,
            });
        }
    })),
    getTodos: trpc_1.publicProcedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield database_1.db.select().from(schema.todos);
            return result;
        }
        catch (error) {
            console.error("DATABASE ERROR:");
            console.dir(error, { depth: null });
            throw new unstable_core_do_not_import_1.TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: error instanceof Error ? error.message : String(error),
                cause: error,
            });
        }
    }))
});
