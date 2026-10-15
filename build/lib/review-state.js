/**
 * In-memory review session state management.
 *
 * When a review is active for a PR, comments added via addPRComment are
 * buffered here instead of being posted immediately. finishReview then
 * posts them all at once.
 */
// Key: "projectKey/repoSlug/prId"
const reviewSessions = new Map();
export function reviewKey(projectKey, repoSlug, prId) {
    return `${projectKey}/${repoSlug}/${String(prId)}`;
}
export function hasActiveReview(key) {
    return reviewSessions.has(key);
}
export function startReviewSession(key) {
    if (reviewSessions.has(key)) {
        throw new Error(`A review session is already active for ${key}. Finish or discard it first.`);
    }
    reviewSessions.set(key, []);
}
export function getReviewSession(key) {
    return reviewSessions.get(key);
}
export function addPendingComment(key, comment) {
    const session = reviewSessions.get(key);
    if (session === undefined) {
        throw new Error(`No active review session for ${key}.`);
    }
    session.push(comment);
    return session.length - 1;
}
export function clearReviewSession(key) {
    const session = reviewSessions.get(key);
    if (session === undefined) {
        throw new Error(`No active review session for ${key}.`);
    }
    reviewSessions.delete(key);
    return session;
}
//# sourceMappingURL=review-state.js.map