/**
 * Token squeeze for tool results: compact JSON, drop Bitbucket noise, cap huge text.
 * BITBUCKET_VERBOSE=true turns it all off; BITBUCKET_MAX_CHARS tunes the text cap.
 */
const NOISE_KEYS = new Set(["links", "link", "avatarUrl"]);
const KEEP_EMPTY_KEYS = new Set(["values"]);
const DEFAULT_MAX_CHARS = 60000;
export function isVerbose() {
    return process.env.BITBUCKET_VERBOSE === "true";
}
function maxChars() {
    const n = Number(process.env.BITBUCKET_MAX_CHARS);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_MAX_CHARS;
}
function isEmpty(value) {
    if (value === null || value === undefined || value === "")
        return true;
    if (Array.isArray(value))
        return value.length === 0;
    return typeof value === "object" && Object.keys(value).length === 0;
}
export function squeeze(value) {
    if (Array.isArray(value)) {
        return value.map(squeeze);
    }
    if (value === null || typeof value !== "object") {
        return value;
    }
    const out = {};
    for (const [key, raw] of Object.entries(value)) {
        if (NOISE_KEYS.has(key))
            continue;
        const next = squeeze(raw);
        if (isEmpty(next) && !KEEP_EMPTY_KEYS.has(key))
            continue;
        out[key] = next;
    }
    return out;
}
export function serialize(data) {
    return isVerbose() ? JSON.stringify(data, null, 2) : JSON.stringify(squeeze(data));
}
export function capText(text) {
    const limit = maxChars();
    if (isVerbose() || typeof text !== "string" || text.length <= limit)
        return text;
    return `${text.slice(0, limit)}\n[truncated ${String(text.length - limit)} of ${String(text.length)} chars; raise BITBUCKET_MAX_CHARS]`;
}
