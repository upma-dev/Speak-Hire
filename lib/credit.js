export const PLAN_CREDITS = {
  Free: 3,
  Pro: 50,
  Team: 200,
};

export const PLAN_PRICES = {
  Pro: 499,
  Team: 1499,
};

export function deductCredit(user) {
  if (user.credits <= 0) {
    throw new Error("No credits remaining");
  }

  user.credits -= 1;

  return user;
}
