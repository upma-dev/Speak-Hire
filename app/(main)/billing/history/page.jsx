"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/api/payment-history")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Invoice</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.plan}</td>
              <td>₹{p.amount}</td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>

              <td className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const url = `/api/invoice?plan=${p.plan}&amount=${p.amount}&paymentId=${p.payment_id}`;
                    window.open(url, "_blank");
                  }}
                >
                  📥 Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const url = `/api/invoice?plan=${p.plan}&amount=${p.amount}&paymentId=${p.payment_id}`;
                    if (navigator.share) {
                      navigator.share({
                        title: `Payment Invoice - ${p.plan}`,
                        text: `Downloaded my ${p.plan} plan invoice from SpeakHire`,
                        url: window.location.origin + url,
                      });
                    } else {
                      // Fallback: WhatsApp, Twitter, LinkedIn
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check my ${p.plan} invoice from SpeakHire: ${window.location.origin + url}`)}`;
                      window.open(whatsappUrl, "_blank");
                    }
                  }}
                >
                  📱 Share
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
