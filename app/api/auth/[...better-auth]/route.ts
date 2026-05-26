import { connectToDatabase } from "@/database/mongoose";
import { auth } from "../../../../lib/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

const nextHandler = toNextJsHandler(auth.handler);

export const GET = async (req: Request) => {
    await connectToDatabase();
    return nextHandler.GET(req);
};

export const POST = async (req: Request) => {
    await connectToDatabase();
    return nextHandler.POST(req);
};