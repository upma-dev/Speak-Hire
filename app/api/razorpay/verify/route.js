import crypto from "crypto";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PLAN_CREDITS, PLAN_PRICES } from "@/lib/credit";

export async function POST(req) {
  const body = await req.json();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
    body;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // For API routes, cookies are typically not set in the response
          // If needed, use NextResponse to set cookies
        },
        remove(name, options) {
          // For API routes, cookies are typically not removed in the response
          // If needed, use NextResponse to remove cookies
        },
      },
    },
  );

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    const credits = PLAN_CREDITS[plan] || 0;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          plan: plan,
          credits: credits,
        })
        .eq("id", user.id);

      if (updateError) {
        console.error("User update error:", updateError);
      }

      const { error: insertError } = await supabase.from("payments").insert({
        user_id: user.id,
        plan,
        amount: PLAN_PRICES[plan],
        payment_id: razorpay_payment_id,
        gateway: "razorpay",
      });

      if (insertError) {
        console.error("Payment insert error:", insertError);
      }

      return Response.json({
        success: true,
        paymentId: razorpay_payment_id,
        plan,
        amount: PLAN_PRICES[plan],
      });
    }
  }

  return Response.json({ success: false });
}
