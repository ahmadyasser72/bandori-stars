import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";

import { LATEST_EVENT_RELEASE_GAP } from "@/contents/data";

dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export const now = () => dayjs();
export { dayjs };

export const getDateOffset = ({
	en,
	jp,
}: {
	en: dayjs.Dayjs | null;
	jp: dayjs.Dayjs;
}) => {
	if (!en) return LATEST_EVENT_RELEASE_GAP;
	return en.diff(jp);
};
