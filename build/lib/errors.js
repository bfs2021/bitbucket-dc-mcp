import axios from "axios";
function extractAxiosErrorMessage(error) {
    const responseData = error.response?.data;
    const msg = responseData?.message ?? responseData?.errors ?? error.message;
    return msg ?? "";
}
function formatHttpStatus(status) {
    return status !== undefined ? ` (HTTP ${String(status)})` : "";
}
function formatMessage(msg) {
    return typeof msg === "string" ? msg : JSON.stringify(msg);
}
export function formatError(error) {
    if (axios.isAxiosError(error)) {
        const msg = extractAxiosErrorMessage(error);
        const status = formatHttpStatus(error.response?.status);
        return `Bitbucket API error${status}: ${formatMessage(msg)}`;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}
export function jsonResult(data) {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}
export function textResult(text) {
    return {
        content: [{ type: "text", text }],
    };
}
//# sourceMappingURL=errors.js.map