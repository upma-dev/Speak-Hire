import Razorpay from "razorpay";
import { PLAN_PRICES } from "@/lib/credit";

export async function POST(req) {
  const { plan } = await req.json();

  // Old hardcoded prices (commented out)
  /*
  const priceMap = {
    Pro: 499,
    Team: 1499,
  };
  */

  const amount = (PLAN_PRICES[plan] || 0) * 100;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
  });

  return Response.json({
    orderId: order.id,
    amount: order.amount,
  });
}
