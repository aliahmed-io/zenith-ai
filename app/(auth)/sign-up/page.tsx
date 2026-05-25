'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sliders, Cpu, ShieldAlert } from "lucide-react";

const SignUp = () => {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);

    const {
        register,
        handleSubmit,
        control,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'US',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    });

    const handleNext = async (e: React.MouseEvent) => {
        e.preventDefault();
        const isValid = await trigger(["fullName", "email", "password"]);
        if (isValid) setStep(2);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.preventDefault();
        setStep(1);
    };

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
            } else {
                toast.error('Sign up failed', {
                    description: 'Email already registered or database offline.'
                });
            }
        } catch (e) {
            console.error(e);
            toast.error('Sign up failed', {
                description: e instanceof Error ? e.message : 'Failed to create an account.'
            });
        }
    };

    return (
        <>
            {/* Step Indicator Header */}
            <div className="flex justify-between items-center mb-6 font-mono text-[10px] uppercase text-gray-500 border-b border-gray-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" />
                    {step === 1 ? "01. System Credentials" : "02. Allocator Profile"}
                </span>
                <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 font-bold">
                    STEP {step} / 2
                </span>
            </div>

            <h1 className="form-title">
                {step === 1 ? "INITIALIZE ACCOUNT" : "ALLOCATION PARAMETERS"}
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
                        <InputField
                            name="fullName"
                            label="Full Name"
                            placeholder="John Doe"
                            register={register}
                            error={errors.fullName}
                            validation={{ required: 'Full name is required', minLength: 2 }}
                        />

                        <InputField
                            name="email"
                            label="System Email"
                            placeholder="contact@zenith.com"
                            register={register}
                            error={errors.email}
                            validation={{ 
                                required: 'Email is required', 
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Invalid email address'
                                }
                            }}
                        />

                        <InputField
                            name="password"
                            label="Encryption Password"
                            placeholder="Min. 8 characters"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={{ required: 'Password is required', minLength: 8 }}
                        />

                        <Button onClick={handleNext} className="primary-btn w-full mt-6 uppercase tracking-wider flex items-center justify-center gap-2">
                            NEXT PARAMETERS <Cpu className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
                        <CountrySelectField
                            name="country"
                            label="Jurisdiction / Country"
                            control={control}
                            error={errors.country}
                            required
                        />

                        <SelectField
                            name="investmentGoals"
                            label="Investment Mandate / Goals"
                            placeholder="Select goal"
                            options={INVESTMENT_GOALS}
                            control={control}
                            error={errors.investmentGoals}
                            required
                        />

                        <SelectField
                            name="riskTolerance"
                            label="Volatility Threshold / Risk"
                            placeholder="Select risk level"
                            options={RISK_TOLERANCE_OPTIONS}
                            control={control}
                            error={errors.riskTolerance}
                            required
                        />

                        <SelectField
                            name="preferredIndustry"
                            label="Preferred Sector Focus"
                            placeholder="Select industry"
                            options={PREFERRED_INDUSTRIES}
                            control={control}
                            error={errors.preferredIndustry}
                            required
                        />

                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <Button onClick={handleBack} variant="outline" className="col-span-1 h-12 uppercase font-bold text-xs border border-gray-400 text-gray-400 hover:bg-gray-800 transition-colors">
                                BACK
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="col-span-2 primary-btn uppercase tracking-wider flex items-center justify-center gap-2">
                                {isSubmitting ? 'CREATING...' : 'INITIALIZE LEDGER'}
                                <ShieldAlert className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="pt-2 border-t border-gray-800 mt-4">
                    <FooterLink text="Already registered?" linkText="Sign In" href="/sign-in" />
                </div>
            </form>
        </>
    );
};

export default SignUp;
