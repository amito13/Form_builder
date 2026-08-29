import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter, createContext } from "@repo/trpc";
const app = express();
app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
app.use(cors({
    origin(origin, callback) {
        if (!origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
}));
app.use("/trpc", createExpressMiddleware({
    router: appRouter,
    createContext,
}));
// app.get("/health", (req, res) => {
//     return res.json({ status: "ok" });
// });
// app.post("/users", (req, res) => {
//     const result = createUserSchema.safeParse(req.body);
//     if (!result.success) {
//         console.error("Validation error:", result.error);
//         return res.status(400).json({ error: result.error.message });
//     }
//     // Process the valid user data
//     console.log("User data:", result.data);
//     return res.status(201).json({ message: "User created successfully" });
// });
const port = Number(process.env.PORT ?? 8000);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
