export interface BitbucketConfig {
    baseUrl: string;
    token: string | undefined;
    username: string | undefined;
    password: string | undefined;
    defaultProject: string | undefined;
    enableDangerous: boolean;
}
function normalizeBaseUrl(raw: string): string {
    try {
        const parsed = new URL(raw);
        const pathname = parsed.pathname.replace(/\/+$/, "");
        if (!pathname.includes("/rest/api/")) {
            return `${parsed.origin}/rest/api/1.0`;
        }
        return `${parsed.origin}${pathname}`;
    }
    catch {
        return raw;
    }
}
function isTruthy(value: string | undefined): boolean {
    if (value === undefined || value === '')
        return false;
    return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}
export function loadConfig(): BitbucketConfig {
    const rawUrl = process.env.BITBUCKET_URL;
    if (rawUrl === undefined || rawUrl === '') {
        throw new Error("BITBUCKET_URL is required (e.g. https://bitbucket.example.com)");
    }
    const token = process.env.BITBUCKET_TOKEN;
    const username = process.env.BITBUCKET_USERNAME;
    const password = process.env.BITBUCKET_PASSWORD;
    if ((token === undefined || token === '') && !((username !== undefined && username !== '') && (password !== undefined && password !== ''))) {
        throw new Error("Either BITBUCKET_TOKEN or BITBUCKET_USERNAME + BITBUCKET_PASSWORD is required");
    }
    return {
        baseUrl: normalizeBaseUrl(rawUrl),
        token,
        username,
        password,
        defaultProject: process.env.BITBUCKET_DEFAULT_PROJECT,
        enableDangerous: isTruthy(process.env.BITBUCKET_ENABLE_DANGEROUS),
    };
}
export function getAuthHeaders(config: BitbucketConfig): Record<string, string> {
    if (config.token !== undefined && config.token !== '') {
        return { Authorization: `Bearer ${config.token}` };
    }
    return {};
}
export function getBasicAuth(config: BitbucketConfig): { username: string; password: string } | undefined {
    if ((config.username !== undefined && config.username !== '') && (config.password !== undefined && config.password !== '')) {
        return { username: config.username, password: config.password };
    }
    return undefined;
}
