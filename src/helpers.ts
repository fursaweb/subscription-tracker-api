export const extractBearerToken = (authHeader: string): string | null => {
  const parts = authHeader.trim().split(" ");

  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return null;
};

export const isNotPastDate = (date: Date): boolean => {
  const currentDay = new Date();
  const inputDate = new Date(date);

  currentDay.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= currentDay;
};
