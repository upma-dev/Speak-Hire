export async function getUsage(userId) {
  const interviews = await db.interview.count({
    where: { user_id: userId },
  });

  return {
    interviews,
  };
}
