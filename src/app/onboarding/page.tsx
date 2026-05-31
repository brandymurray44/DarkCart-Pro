"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { id: "niche", label: "What's your product niche?", placeholder: "e.g., home office, wellness, fitness" },
  { id: "storeType", label: "Store type?", placeholder: "e.g., Shopify, dropshipping, POD" },
  { id: "goals", label: "What are your goals?", placeholder: "e.g., Launch 10 products this month, increase revenue by 50%" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({ niche: "", storeType: "", goals: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const step = steps[currentStep];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [step.id]: e.target.value });
  };

  const handleNext = async () => {
    if (!data[step.id as keyof typeof data]?.trim()) {
      setError("This field is required");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError("");
    } else {
      await submitOnboarding();
    }
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setError("");
    try {
      // Get current authenticated user
      const userResponse = await fetch("/api/auth/me");
      const userData = await userResponse.json();
      
      if (!userData.user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.user.id,
          niche: data.niche,
          storeType: data.storeType,
          goals: data.goals,
          completed: true,
        }),
      });

      if (!response.ok) throw new Error("Onboarding failed");
      router.push("/trends");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">TrendPilot</h1>
          <p className="text-slate-400">Step {currentStep + 1} of {steps.length}</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
          <label className="block text-sm font-semibold text-white">{step.label}</label>
          {step.id === "goals" ? (
            <textarea
              value={data[step.id as keyof typeof data]}
              onChange={handleInputChange}
              placeholder={step.placeholder}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none h-24"
            />
          ) : (
            <input
              type="text"
              value={data[step.id as keyof typeof data]}
              onChange={handleInputChange}
              placeholder={step.placeholder}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => {
                setCurrentStep(currentStep - 1);
                setError("");
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium disabled:opacity-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : currentStep === steps.length - 1 ? "Complete" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
