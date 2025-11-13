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
	if (!en) throw new Error("EN date is not defined.");
	return en.diff(jp);
};
