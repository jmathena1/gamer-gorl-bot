import "dotenv/config";

export function getCredential(credentialName: string): string | undefined {
  const key: string =
    process.env.TEST_ENV === "true" ? `TEST_${credentialName}` : credentialName;

  return process.env[key];
}
