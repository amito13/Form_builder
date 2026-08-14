import express from "express";
import cors from "cors";
import {createExpressMiddleware} from "@trpc/server/adapters/express";
import {appRouter, createContext} from "@repo/trpc";


const app = express();
app.use(express.json());
app.use(cors({
    //allowing all origins for development purposes, in production you should restrict this to your frontend domain
    origin: "*"
}));

app.use("/trpc",createExpressMiddleware({
    router:appRouter,
    createContext,
}))
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

app.listen(8000, () => {
    console.log("Server is running on http://localhost:8000");
}); 

  