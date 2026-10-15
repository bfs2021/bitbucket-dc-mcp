import axios, {} from "axios";
import { getAuthHeaders, getBasicAuth } from "./config.js";
let client;
let config;
export function initClient(cfg) {
    config = cfg;
    client = axios.create({
        baseURL: cfg.baseUrl,
        headers: {
            ...getAuthHeaders(cfg),
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        auth: getBasicAuth(cfg),
    });
}
export function getClient() {
    if (client === undefined) {
        throw new Error("Bitbucket client not initialized. Call initClient() first.");
    }
    return client;
}
export function getConfig() {
    if (config === undefined) {
        throw new Error("Config not initialized. Call initClient() first.");
    }
    return config;
}
/** Get the Bitbucket server origin (e.g. https://bitbucket.example.com) */
export function getOriginUrl() {
    const cfg = getConfig();
    return new URL(cfg.baseUrl).origin;
}
/** Build the DC API path for a project's repository */
export function repoPath(projectKey, repoSlug) {
    return `/projects/${projectKey}/repos/${repoSlug}`;
}
/** Build the DC API path for a pull request */
export function prPath(projectKey, repoSlug, prId) {
    return `${repoPath(projectKey, repoSlug)}/pull-requests/${String(prId)}`;
}
//# sourceMappingURL=client.js.map