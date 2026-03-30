import PDFDocument from "pdfkit";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
      },
    },
  );

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");
  const paymentId = searchParams.get("paymentId");

  if (!plan || !amount || !paymentId) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Verify user owns this payment
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: payments, error: dbError } = await supabase
    .from("payments")
    .select("plan, amount")
    .eq("payment_id", paymentId)
    .eq("user_id", session.user.id);

  console.log("DB query result:", {
    payments,
    dbError,
    paymentId,
    userId: session.user.id,
  });

  if (dbError || !payments || payments.length === 0) {
    return new Response("Payment not found", { status: 404 });
  }

  const payment = payments[0];

  if (payment.plan !== plan || payment.amount.toString() !== amount) {
    return new Response("Invalid payment details", { status: 403 });
  }

  const doc = new PDFDocument();
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  // Improved PDF
  doc
    .fontSize(24)
    .fillColor("#1e40af")
    .text("SpeakHire Invoice", { align: "center" });
  doc
    .fillColor("#000")
    .fontSize(16)
    .text(`Payment ID: ${paymentId}`, { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Plan: ${plan}`, 50, 150);
  doc.text(`Amount: ₹${amount}`, 50, 170);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, 190);
  doc.moveDown(2);
  doc.fontSize(12).text("Thank you for using SpeakHire AI Interview Platform", {
    align: "center",
  });

  doc.end();

  const buffer = Buffer.concat(chunks);

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${paymentId}.pdf"`,
    },
  });
}
