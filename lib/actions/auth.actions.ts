'use server';

import { auth, memoryDb, persistAuthDb } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { headers } from "next/headers";

const normalizeAccount = (identifier: string) => {
    const trimmed = (identifier || '').trim();
    if (!trimmed) {
        return { email: 'guest@zenith.local', name: 'Guest Trader' };
    }
    if (trimmed.includes('@')) {
        const parts = trimmed.split('@');
        const usernamePart = parts[0] || 'trader';
        const formattedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
        return { email: trimmed.toLowerCase(), name: formattedName };
    }
    const formattedName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return { email: `${trimmed.toLowerCase()}@zenith.local`, name: formattedName };
};

export const signUpWithEmail = async ({ 
    email, 
    password, 
    fullName, 
    country, 
    investmentGoals, 
    riskTolerance, 
    preferredIndustry 
}: SignUpFormData) => {
    try {
        const { connectToDatabase } = await import("@/database/mongoose");
        await connectToDatabase();

        const { email: normalizedEmail, name: derivedName } = normalizeAccount(email);
        const nameToUse = fullName && fullName.trim().length > 0 ? fullName : derivedName;
        const effectivePassword = password && password.length > 0 ? password : 'password123';
        const reqHeaders = await headers();

        try {
            const response = await auth.api.signUpEmail({ 
                body: { email: normalizedEmail, password: effectivePassword, name: nameToUse },
                headers: reqHeaders
            });

            persistAuthDb();

            try {
                await inngest.send({
                    name: 'app/user.created',
                    data: { 
                        email: normalizedEmail, 
                        name: nameToUse, 
                        country: country || 'US', 
                        investmentGoals: investmentGoals || 'Growth', 
                        riskTolerance: riskTolerance || 'Medium', 
                        preferredIndustry: preferredIndustry || 'Technology' 
                    }
                });
            } catch (inngestErr) {
                console.warn('Inngest user.created event dispatch skipped:', inngestErr);
            }

            return { success: true, isNewUser: true, email: normalizedEmail, data: response };
        } catch (signUpErr) {
            // If already exists or error, sign in directly with the credentials
            return await signInWithEmail({ email: normalizedEmail, password: effectivePassword });
        }
    } catch (e) {
        console.error('Sign up failed', e);
        return { success: false, error: 'Sign up failed' };
    }
};

export const signInWithEmail = async ({ email, password }: { email: string; password?: string }) => {
    try {
        const { connectToDatabase } = await import("@/database/mongoose");
        await connectToDatabase();

        const { email: normalizedEmail, name: derivedName } = normalizeAccount(email);
        const effectivePassword = password && password.length > 0 ? password : 'password123';
        const reqHeaders = await headers();

        // 1. Attempt standard sign-in
        try {
            const response = await auth.api.signInEmail({ 
                body: { email: normalizedEmail, password: effectivePassword },
                headers: reqHeaders
            });

            if (response) {
                persistAuthDb();
                return { 
                    success: true, 
                    isNewUser: false, 
                    email: normalizedEmail,
                    data: response 
                };
            }
        } catch (signInErr) {
            // Credentials wrong or user doesn't exist yet
        }

        // 2. If user already exists in memory DB with different password, reset old credentials
        const existingIndex = memoryDb.user.findIndex((u) => u.email?.toLowerCase() === normalizedEmail.toLowerCase());
        if (existingIndex !== -1) {
            const existingUser = memoryDb.user[existingIndex];
            const userId = existingUser.id;
            memoryDb.account = memoryDb.account.filter((a) => a.userId !== userId);
            memoryDb.user.splice(existingIndex, 1);
        }

        // 3. Register user with entered credentials and auto sign-in
        const signUpResponse = await auth.api.signUpEmail({
            body: { 
                email: normalizedEmail, 
                password: effectivePassword, 
                name: derivedName 
            },
            headers: reqHeaders,
        });

        persistAuthDb();

        try {
            await inngest.send({
                name: 'app/user.created',
                data: { 
                    email: normalizedEmail, 
                    name: derivedName, 
                    country: 'US', 
                    investmentGoals: 'Growth', 
                    riskTolerance: 'Medium', 
                    preferredIndustry: 'Technology' 
                }
            });
        } catch (inngestErr) {
            // non-blocking
        }

        return { 
            success: true, 
            isNewUser: true, 
            email: normalizedEmail,
            data: signUpResponse 
        };
    } catch (e) {
        console.error('Sign in / auto-creation failed:', e);
        return { success: false, error: e instanceof Error ? e.message : 'Authentication failed' };
    }
};

export const signOut = async () => {
    try {
        const { connectToDatabase } = await import("@/database/mongoose");
        await connectToDatabase();
        
        await auth.api.signOut({ headers: await headers() });
        return { success: true };
    } catch (e) {
        console.error('Sign out failed', e);
        return { success: false, error: 'Sign out failed' };
    }
};
