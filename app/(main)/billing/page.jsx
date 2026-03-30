"use client";

import { useState } from "react";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/services/supabaseClient";

export default function BillingPage() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentPayment, setRecentPayment] = useState(null);

  const refreshUserData = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        if (sessionError.name !== "AuthSessionMissingError") {
          console.error("Supabase session error:", sessionError);
        }
        return;
      }

      const authUser = session?.user;
      if (!authUser) return;

      const { data: userData, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", authUser.email)
        .single();

      if (!error && userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  const plans = [
    {
      name: "Free",
      price: 0,
      credits: 3,
      icon: Zap,
      description: "Perfect for testing",
    },
    {
      name: "Pro",
      price: 499,
      credits: 50,
      icon: CreditCard,
      description: "Best for startups",
    },
    {
      name: "Team",
      price: 1499,
      credits: 200,
      icon: Crown,
      description: "Ideal for companies",
    },
  ];

  const buyPlan = async (plan) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        order_id: data.orderId,

        name: "SpeakHire",
        description: plan + " Plan",

        // OLD: razor.prefs = { suppress_payment_button: false };
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                plan,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error("Payment verification failed");
            }

            // Auto download slip
            const invoiceUrl = `/api/invoice?plan=${encodeURIComponent(verifyData.plan)}&amount=${verifyData.amount}&paymentId=${encodeURIComponent(verifyData.paymentId)}`;
            window.open(invoiceUrl, "_blank");

            // Store recent payment for UI
            setRecentPayment({
              plan: verifyData.plan,
              amount: verifyData.amount,
              paymentId: verifyData.paymentId,
            });

            toast.success(
              "Payment successful! Your plan has been upgraded 🎉 Check slip below.",
            );
            await refreshUserData(); // Refresh user data instead of reloading page
          } catch (err) {
            toast.error("Payment verification failed: " + err.message);
          }
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      setError(err.message);
      toast.error("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Billing & Credits
      </h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
        <h2 className="text-lg text-white mb-3">Current Usage</h2>

        <div className="flex justify-between">
          <div>
            <p className="text-gray-400 text-sm">Current Plan</p>

            <h3 className="text-white font-semibold">{user?.plan || "Free"}</h3>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Credits Remaining</p>

            <h3 className="text-white font-semibold">{user?.credits || 0}</h3>
          </div>
        </div>
        {recentPayment && (
          <div className="bg-green-500/20 border border-green-500/50 p-6 rounded-xl mb-6">
            <h3 className="text-lg font-bold text-green-400 mb-3">
              ✅ Latest Payment
            </h3>
            <p>
              <strong>Plan:</strong> {recentPayment.plan}
            </p>
            <p>
              <strong>Amount:</strong> ₹{recentPayment.amount}
            </p>
            <p>
              <strong>ID:</strong> {recentPayment.paymentId}
            </p>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => {
                  const url = `/api/invoice?plan=${encodeURIComponent(recentPayment.plan)}&amount=${recentPayment.amount}&paymentId=${encodeURIComponent(recentPayment.paymentId)}`;
                  window.open(url, "_blank");
                }}
              >
                📥 Download Slip
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const url = `/api/invoice?plan=${encodeURIComponent(recentPayment.plan)}&amount=${recentPayment.amount}&paymentId=${encodeURIComponent(recentPayment.paymentId)}`;
                  const shareText = `Payment successful! ${recentPayment.plan} plan - ₹${recentPayment.amount}\nInvoice: ${window.location.origin}${url}`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                📱 Share
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <plan.icon className="text-blue-400" />
              <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
            </div>

            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

            <h2 className="text-3xl text-white font-bold mb-3">
              ₹{plan.price}
              <span className="text-sm text-gray-400">/month</span>
            </h2>

            <p className="text-gray-400 mb-6">
              {plan.credits} Interview Credits
            </p>

            {plan.price !== 0 && (
              <Button
                onClick={() => buyPlan(plan.name)}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Upgrade Plan"}
              </Button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
