export const STARS_PER_PULL = 250;

// source: https://bandori.fandom.com/wiki/BanG_Dream!_Girls_Band_Party!/Login_Bonus#Normal_Login_Bonus
export const STARS_FROM_DAILY_LOGIN = [0, 50, 0, 50, 0, 0, 50];

type MonthlyPassReward = Record<"live_points" | "stars", number>;

export const STARS_FROM_FREE_MONTHLY_PASS = [
	{ live_points: 50, stars: 50 },
	{ live_points: 100, stars: 50 },
	{ live_points: 250, stars: 50 },
	{ live_points: 400, stars: 50 },
	{ live_points: 550, stars: 50 },
	{ live_points: 700, stars: 50 },
	{ live_points: 950, stars: 50 },
	{ live_points: 1250, stars: 50 },
	{ live_points: 1550, stars: 50 },
	{ live_points: 1850, stars: 50 },
] satisfies MonthlyPassReward[];

export const STARS_FROM_PAID_MONTHLY_PASS = [
	{ live_points: 10, stars: 50 },
	{ live_points: 30, stars: 50 },
	{ live_points: 50, stars: 50 },
	{ live_points: 70, stars: 50 },
	{ live_points: 90, stars: 50 },
	{ live_points: 125, stars: 50 },
	{ live_points: 175, stars: 50 },
	{ live_points: 225, stars: 50 },
	{ live_points: 275, stars: 50 },
	{ live_points: 325, stars: 50 },
	{ live_points: 375, stars: 50 },
	{ live_points: 425, stars: 50 },
	{ live_points: 475, stars: 100 },
	{ live_points: 550, stars: 100 },
	{ live_points: 600, stars: 100 },
	{ live_points: 650, stars: 100 },
	{ live_points: 700, stars: 100 },
	{ live_points: 750, stars: 100 },
	{ live_points: 850, stars: 100 },
	{ live_points: 950, stars: 100 },
	{ live_points: 1100, stars: 100 },
	{ live_points: 1200, stars: 100 },
	{ live_points: 1300, stars: 100 },
	{ live_points: 1400, stars: 100 },
	{ live_points: 1550, stars: 100 },
	{ live_points: 1650, stars: 100 },
	{ live_points: 1750, stars: 100 },
	{ live_points: 1850, stars: 100 },
	{ live_points: 1950, stars: 100 },
	{ live_points: 2200, stars: 100 },
	{ live_points: 2400, stars: 100 },
] satisfies MonthlyPassReward[];
