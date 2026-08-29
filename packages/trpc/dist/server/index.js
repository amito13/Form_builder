import { router } from './trpc.js';
import { authRouter } from './routes/auth/route.js';
import { formRouter } from './routes/form/route.js';
export const serverRouter = router({
    auth: authRouter,
    form: formRouter
});
export { createContext } from './context.js';
