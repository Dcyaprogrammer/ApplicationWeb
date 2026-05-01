import { sanitizeEnvValue } from "../shared/env";

const POSTGRES_PROTOCOLS = ["postgres://", "postgresql://"];

const splitUserInfo = (userInfo: string) => {
  const separatorIndex = userInfo.indexOf(":");
  if (separatorIndex === -1) {
    return {
      username: userInfo,
      password: "",
    };
  }

  return {
    username: userInfo.slice(0, separatorIndex),
    password: userInfo.slice(separatorIndex + 1),
  };
};

export const normalizePostgresConnectionString = (value: string) => {
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
  const connectionString =
    quoteCutIndex !== undefined
      ? withoutTrailingQuote.slice(0, quoteCutIndex)
      : withoutTrailingQuote;

  const protocol = POSTGRES_PROTOCOLS.find((candidate) =>
    connectionString.startsWith(candidate),
  );

  if (!protocol) {
    throw new Error(
      "Unsupported database URL protocol. Expected postgres:// or postgresql://",
    );
  }

  try {
    return new URL(connectionString).toString();
  } catch {
    const withoutProtocol = connectionString.slice(protocol.length);
    const atIndex = withoutProtocol.lastIndexOf("@");

    if (atIndex === -1) {
      throw new Error("DATABASE_URL is not a valid Postgres connection string.");
    }

    const userInfo = withoutProtocol.slice(0, atIndex);
    const hostAndPath = withoutProtocol.slice(atIndex + 1);
    const { username, password } = splitUserInfo(userInfo);

    const encodedUserInfo = password
      ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}`
      : encodeURIComponent(username);

    const normalized = `${protocol}${encodedUserInfo}@${hostAndPath}`;

    return new URL(normalized).toString();
  }
};

export const resolveDatabaseUrl = (env: NodeJS.ProcessEnv) => {
  const candidate = sanitizeEnvValue(env.DIRECT_DATABASE_URL) || sanitizeEnvValue(env.DATABASE_URL);

  if (!candidate) {
    throw new Error(
      "Neither DIRECT_DATABASE_URL nor DATABASE_URL is set.",
    );
  }

  return normalizePostgresConnectionString(candidate);
};
