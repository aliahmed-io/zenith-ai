import { betterAuth } from "better-auth";
import { memoryAdapter } from "@better-auth/memory-adapter";
import { nextCookies } from "better-auth/next-js";
import fs from "fs";
import path from "path";

const DB_FILE = path.resolve(process.cwd(), ".zenith-auth-db.json");

export interface ZenithAuthDb {
    user: any[];
    session: any[];
    account: any[];
    verification: any[];
    jwks: any[];
    rateLimit: any[];
    [key: string]: any[];
}

function loadPersistedDb(): ZenithAuthDb {
    const initial: ZenithAuthDb = {
        user: [],
        session: [],
        account: [],
        verification: [],
        jwks: [],
        rateLimit: [],
    };

    try {
        if (fs.existsSync(DB_FILE)) {
            const raw = fs.readFileSync(DB_FILE, "utf-8");
            const parsed = JSON.parse(raw);
            return { ...initial, ...parsed };
        }
    } catch (e) {
        console.warn("Failed to read persisted auth DB:", e);
    }
    return initial;
}

const globalForAuth = globalThis as unknown as {
    zenithAuthDb?: ZenithAuthDb;
};

export const memoryDb: ZenithAuthDb = globalForAuth.zenithAuthDb ?? loadPersistedDb();

if (process.env.NODE_ENV !== "production") {
    globalForAuth.zenithAuthDb = memoryDb;
}

export const persistAuthDb = () => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
    } catch (e) {
        console.warn("Failed to persist auth DB:", e);
    }
};

export const auth = betterAuth({
    database: memoryAdapter(memoryDb),
    secret: process.env.BETTER_AUTH_SECRET || "z4x5B9k2L8q1M3w5V7y9N2p4R8s1T3u5",
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    user: {
        additionalFields: {
            virtualBalance: {
                type: "number",
                defaultValue: 100000,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 1,
        maxPasswordLength: 128,
        autoSignIn: true,
    },
    plugins: [nextCookies()],
});
