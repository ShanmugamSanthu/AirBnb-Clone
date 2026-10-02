export const parseCalendarDate = (dateString) => {
  const parts = dateString.split("-");

  if (parts.length !== 3) {
    throw new Error("Date must use DD-MM-YYYY format");
  }

  const [day, month, year] = parts.map(Number);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    year < 1000 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    throw new Error("Invalid calendar date");
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  // Date.UTC normalizes invalid dates, so verify the components.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Invalid calendar date");
  }

  return date;
};
