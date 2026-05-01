export const sanitizeEnvValue = (value: string | undefined | null) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const withoutLeadingQuote =
    trimmed.startsWith('"') || trimmed.startsWith("'")
      ? trimmed.slice(1)
      : trimmed;
  const withoutTrailingQuote =
    withoutLeadingQuote.endsWith('"') || withoutLeadingQuote.endsWith("'")
      ? withoutLeadingQuote.slice(0, -1)
      : withoutLeadingQuote;

  const quoteCutIndex = [withoutTrailingQuote.indexOf('"'), withoutTrailingQuote.indexOf("'")]
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];

  return quoteCutIndex !== undefined
    ? withoutTrailingQuote.slice(0, quoteCutIndex).trim()
    : withoutTrailingQuote.trim();
};
