export const extractBearerToken = (authHeader: string) => {
  const parts = authHeader.trim().split(" ");

  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return null;
};
