export const isNotPastDate = (date: Date): boolean => {
  const currentDay = new Date();
  const inputDate = new Date(date);

  currentDay.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= currentDay;
};
