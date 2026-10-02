export const calculateDays = (date2, date1) => {
  const differenceInMs = Math.abs(new Date(date2) - new Date(date1));
  const msInDay = 1000 * 60 * 60 * 24;
  const days = Math.round(differenceInMs / msInDay);
  return `${days + 1}`;
};
