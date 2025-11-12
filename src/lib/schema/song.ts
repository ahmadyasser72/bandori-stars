import type { RegionTuple } from "./utilities";

export type SongList = Record<string, Pick<Song, "publishedAt" | "difficulty">>;

export interface Song {
	tag: string;
	bandId: number;
	achievements: Achievement[];
	jacketImage: string[];
	musicTitle: RegionTuple<string>;
	publishedAt: RegionTuple<string>;
	difficulty: Record<"0" | "1" | "2" | "3", Difficulty> & {
		"4"?: Difficulty & { publishedAt?: RegionTuple<string> };
	};
}

export interface Achievement {
	achievementType: AchievementType;
	rewardType: RewardType;
	quantity: number;
}

type Difficulties = "easy" | "normal" | "hard" | "expert" | "special";
export type AchievementType =
	| `combo_${Difficulties}`
	| `full_combo_${Difficulties}`
	| `score_rank_${"c" | "b" | "a" | "s" | "ss"}`;

export type RewardType = "coin" | "star" | "practice_ticket";

export interface Difficulty {
	playLevel: number;
}
