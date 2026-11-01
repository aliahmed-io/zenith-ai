'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sliders, Cpu, Zap, ArrowRight } from "lucide-react";
import { useState } from 'react';

const SignIn = () => {
    const router = useRouter();
    const [isInstantMounting, setIsInstantMounting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<{ email: string; password?: string }>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (data: { email: string; password?: string }) => {
        try {
            const result = await signInWithEmail({
                email: data.email || 'guest@zenith.local',
                password: data.password || 'password123',
            });

            if (result.success) {
                if (result.isNewUser) {
                    toast.success('New Account Created!', {
                        description: `Account initialized for "${data.email || 'guest'}". $100,000 virtual balance credited.`,
                        duration: 4500,
                    });
                } else {
                    toast.success('Welcome Back!', {
                        description: `Terminal authenticated for "${data.email}".`,
                        duration: 3000,
                    });
                }
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error('Authentication Notice', {
                    description: result.error || 'Failed to initialize terminal session.'
                });
            }
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to mount terminal.'
            });
        }
    };

    const handleQuickEnter = async () => {
        setIsInstantMounting(true);
        const randomId = Math.floor(100 + Math.random() * 900);
        const guestUsername = `trader_${randomId}`;
        setValue('email', guestUsername);
        setValue('password', 'demo123');
        await onSubmit({ email: guestUsername, password: 'demo123' });
        setIsInstantMounting(false);
    };

    const isBusy = isSubmitting || isInstantMounting;

    return (
        <>
            {/* System Status Header */}
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase text-gray-500 border-b border-gray-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    {"01. Access Credentials"}
                </span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-bold uppercase">
                    OPEN INLET
                </span>
            </div>

            <h1 className="form-title">WELCOME BACK</h1>
            <p className="text-xs text-gray-400 font-mono mb-4">
                Enter any username/email & password. If the account doesn't exist, one will be created automatically.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
                <InputField
                    name="email"
                    label="Account / Username or Email"
                    placeholder="e.g. alihassan or any username/email"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Please enter any username or email' }}
                />

                <InputField
                    name="password"
                    label="Encryption Password"
                    placeholder="Enter any password"
                    type="password"
                    register={register}
                    error={errors.password}
                />

                <Button 
                    type="submit" 
                    disabled={isBusy} 
                    className="primary-btn w-full mt-4 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                    {isBusy ? 'INITIALIZING TERMINAL...' : 'MOUNT TERMINAL'}
                    <Cpu className="w-4 h-4" />
                </Button>

                {/* Instant 1-Click Access */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-mono">
                        <span className="bg-gray-900 px-2 text-gray-500">OR INSTANT ENTRY</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleQuickEnter}
                    disabled={isBusy}
                    className="w-full border-primary/40 bg-primary/10 hover:bg-primary hover:text-black text-primary uppercase tracking-wider font-mono text-xs py-2.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Instant 1-Click Entry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Button>

                <div className="pt-2 border-t border-gray-800 mt-4">
                    <FooterLink text="Need custom onboarding?" linkText="Initialize Terminal" href="/sign-up" />
                </div>
            </form>
        </>
    );
};

export default SignIn;
