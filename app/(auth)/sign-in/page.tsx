'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Sliders, Cpu } from "lucide-react";

const SignIn = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
            } else {
                toast.error('Sign in failed', {
                    description: 'Invalid credentials or database connection offline.'
                });
            }
        } catch (e) {
            console.error(e);
            toast.error('Sign in failed', {
                description: e instanceof Error ? e.message : 'Failed to sign in.'
            });
        }
    };

    return (
        <>
            {/* System Status Header */}
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase text-gray-500 border-b border-gray-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    {"01. Access Credentials"}
                </span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-bold uppercase">
                    SECURE INLET
                </span>
            </div>

            <h1 className="form-title">WELCOME BACK</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
                <InputField
                    name="email"
                    label="System Email"
                    placeholder="contact@zenith.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: 'Email is required', pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ }}
                />

                <InputField
                    name="password"
                    label="Encryption Password"
                    placeholder="Enter your password"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Password is required', minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="primary-btn w-full mt-6 uppercase tracking-wider flex items-center justify-center gap-2">
                    {isSubmitting ? 'VERIFYING...' : 'MOUNT TERMINAL'}
                    <Cpu className="w-4 h-4" />
                </Button>

                <div className="pt-2 border-t border-gray-800 mt-4">
                    <FooterLink text="Don't have an account?" linkText="Initialize Terminal" href="/sign-up" />
                </div>
            </form>
        </>
    );
};

export default SignIn;
