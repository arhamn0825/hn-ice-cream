export function isValidPKPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^(\+92|0)3\d{9}$/.test(cleaned);
}

export function normalizePKPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "");
  if (cleaned.startsWith("0")) return "+92" + cleaned.slice(1);
  if (cleaned.startsWith("+92")) return cleaned;
  if (cleaned.startsWith("92")) return "+" + cleaned;
  return cleaned;
}

export const PHONE_HINT = "e.g. 03001234567 or +923001234567";