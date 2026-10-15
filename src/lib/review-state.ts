/**
 * In-memory review session state management.
 *
 * When a review is active for a PR, comments added via addPRComment are
 * buffered here instead of being posted immediately. finishReview then
 * posts them all at once.
 */
// Key: "projectKey/repoSlug/prId"
export interface PendingComment {
    [key: string]: unknown;
}
const reviewSessions = new Map<string, PendingComment[]>();
export function reviewKey(projectKey: string, repoSlug: string, prId: number | string): string {
    return `${projectKey}/${repoSlug}/${String(prId)}`;
}
export function hasActiveReview(key: string): boolean {
    return reviewSessions.has(key);
}
export function startReviewSession(key: string): void {
    if (reviewSessions.has(key)) {
        throw new Error(`A review session is already active for ${key}. Finish or discard it first.`);
    }
    reviewSessions.set(key, []);
}
export function getReviewSession(key: string): PendingComment[] | undefined {
    return reviewSessions.get(key);
}
export function addPendingComment(key: string, comment: PendingComment): number {
    const session = reviewSessions.get(key);
    if (session === undefined) {
        throw new Error(`No active review session for ${key}.`);
    }
    session.push(comment);
    return session.length - 1;
}
export function clearReviewSession(key: string): PendingComment[] {
    const session = reviewSessions.get(key);
    if (session === undefined) {
        throw new Error(`No active review session for ${key}.`);
    }
    reviewSessions.delete(key);
    return session;
}
