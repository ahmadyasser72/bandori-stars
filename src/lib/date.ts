import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";

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
	if (!en) return 330 * 24 * 60 * 60 * 1000; // default offset 330 days
	return en.diff(jp);
};
