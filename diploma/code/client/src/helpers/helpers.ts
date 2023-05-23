import dayjs from "dayjs";

export const formatDate = (date: string) =>
  dayjs(date).format("HH:mm, D MMMM YYYY");
