import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { plan } = await req.json();

  const priceMap = {
    Pro: 499,
    Team: 1499,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: plan + " Plan" },
          unit_amount: priceMap[plan] * 100,
        },
        quantity: 1,
      },
    ],

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`,
  });

  return Response.json({ url: session.url });
}
