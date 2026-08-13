import {TRPCError,initTRPC} from '@trpc/server';

import {createContext} from './context';
import { getAuthenticationCookie } from './utils/cookie';

import {userService} from './services';

export const tRPCContext = initTRPC
    .context<typeof createContext>()
    .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async options => {
  const { ctx } = options

  const userToken = getAuthenticationCookie(ctx)
  if (!userToken) throw new Error(`user is not logged in`)

  const { id, } = await userService.verifyAndDecodeUserToken(userToken)

  return options.next({
    ctx: {
      ...ctx,
      user: { id }
    }
  })
})