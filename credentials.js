import 'dotenv/config'

export function getCredential(credentialName) {
    if (process.env.TEST_ENV) {
        return process.env[`TEST_${credentialName}`];
    }
    return process.env[`${credentialName}`];
}
