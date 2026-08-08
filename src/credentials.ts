import "dotenv/config";

export function getCredential(credentialName: string): string {
  const key: string =
    process.env.TEST_ENV === "true" ? `TEST_${credentialName}` : credentialName;
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required credential: ${credentialName}`);
  }

  return value;
}
