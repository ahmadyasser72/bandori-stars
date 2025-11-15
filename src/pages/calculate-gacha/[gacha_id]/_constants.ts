export const STARS_PER_PULL = 250;

// source: https://bandori.fandom.com/wiki/BanG_Dream!_Girls_Band_Party!/Login_Bonus#Normal_Login_Bonus
export const STARS_FROM_DAILY_LOGIN = [0, 50, 0, 50, 0, 0, 50];

type MonthlyPassReward = Record<"livePoints" | "stars", number>;

export const STARS_FROM_FREE_MONTHLY_PASS = [
	{ livePoints: 50, stars: 50 },
	{ livePoints: 100, stars: 50 },
	{ livePoints: 250, stars: 50 },
	{ livePoints: 400, stars: 50 },
	{ livePoints: 550, stars: 50 },
	{ livePoints: 700, stars: 50 },
	{ livePoints: 950, stars: 50 },
	{ livePoints: 1250, stars: 50 },
	{ livePoints: 1550, stars: 50 },
	{ livePoints: 1850, stars: 50 },
] satisfies MonthlyPassReward[];

export const STARS_FROM_PAID_MONTHLY_PASS = [
	{ livePoints: 10, stars: 50 },
	{ livePoints: 30, stars: 50 },
	{ livePoints: 50, stars: 50 },
	{ livePoints: 70, stars: 50 },
	{ livePoints: 90, stars: 50 },
	{ livePoints: 125, stars: 50 },
	{ livePoints: 175, stars: 50 },
	{ livePoints: 225, stars: 50 },
	{ livePoints: 275, stars: 50 },
	{ livePoints: 325, stars: 50 },
	{ livePoints: 375, stars: 50 },
	{ livePoints: 425, stars: 50 },
	{ livePoints: 475, stars: 100 },
	{ livePoints: 550, stars: 100 },
	{ livePoints: 600, stars: 100 },
	{ livePoints: 650, stars: 100 },
	{ livePoints: 700, stars: 100 },
	{ livePoints: 750, stars: 100 },
	{ livePoints: 850, stars: 100 },
	{ livePoints: 950, stars: 100 },
	{ livePoints: 1100, stars: 100 },
	{ livePoints: 1200, stars: 100 },
	{ livePoints: 1300, stars: 100 },
	{ livePoints: 1400, stars: 100 },
	{ livePoints: 1550, stars: 100 },
	{ livePoints: 1650, stars: 100 },
	{ livePoints: 1750, stars: 100 },
	{ livePoints: 1850, stars: 100 },
	{ livePoints: 1950, stars: 100 },
	{ livePoints: 2200, stars: 100 },
	{ livePoints: 2400, stars: 100 },
] satisfies MonthlyPassReward[];
