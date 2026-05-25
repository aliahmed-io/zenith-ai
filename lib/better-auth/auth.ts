import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import mongoose from "mongoose";
import type { Db } from "mongodb";

// Resilient mock collection for local offline development previews
const mockCollection = {
    findOne: async () => null,
    insertOne: async (doc: Record<string, unknown>) => ({ insertedId: "mock-id", ...doc }),
    updateOne: async () => ({ modifiedCount: 1 }),
    deleteOne: async () => ({ deletedCount: 1 }),
    find: () => ({
        toArray: async () => [],
    }),
    createIndex: async () => {},
};

// Dynamically route calls to the active Mongoose database connection or fallback to offline mocks
const getTargetCollection = (name: string) => {
    if (mongoose.connection && mongoose.connection.db) {
        return mongoose.connection.db.collection(name);
    }
    return mockCollection;
};

const dbProxy = {
    collection: (name: string) => getTargetCollection(name),
    client: {
        db: () => dbProxy,
    },
} as unknown as Db;

export const auth = betterAuth({
    database: mongodbAdapter(dbProxy),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
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
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
    },
    plugins: [nextCookies(), dash()],
});
