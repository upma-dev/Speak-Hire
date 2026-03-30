import { deductCredit } from "@/lib/credits";

export async function POST(req) {
  const { userId } = await req.json();

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  const updatedUser = deductCredit(user);

  await db.user.update({
    where: { id: userId },
    data: {
      credits: updatedUser.credits,
    },
  });

  return Response.json({
    success: true,
    creditsRemaining: updatedUser.credits,
  });
}
