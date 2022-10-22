export function sanitizeString(string: string | null) {
  const parsed = string
    ?.normalize("NFD")
    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "")
    .toLowerCase();
  return parsed;
}
