import "dotenv/config";
import { Pool } from "pg";
import * as schema from "./db/schema.js";
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
export { eq, asc, desc, max } from "drizzle-orm";
export * from "./db/schema.js";
//# sourceMappingURL=index.d.ts.map