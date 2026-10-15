/**
 * Field filtering utilities to reduce API response sizes.
 * Bitbucket DC API doesn't support partial responses, so we filter client-side.
 */
/**
 * Creates a summary of a pull request with only essential fields.
 * Reduces token count by ~80-90% compared to full PR object.
 */
export function summarizePullRequest(pr) {
    const fromRef = pr.fromRef;
    const toRef = pr.toRef;
    const author = pr.author;
    const authorUser = author?.user;
    return {
        id: pr.id,
        title: pr.title,
        state: pr.state,
        draft: pr.draft,
        createdDate: pr.createdDate,
        updatedDate: pr.updatedDate,
        author: authorUser
            ? {
                name: authorUser.name,
                displayName: authorUser.displayName,
            }
            : undefined,
        sourceBranch: fromRef
            ? {
                id: fromRef.id,
                displayId: fromRef.displayId,
            }
            : undefined,
        targetBranch: toRef
            ? {
                id: toRef.id,
                displayId: toRef.displayId,
            }
            : undefined,
        reviewers: summarizeReviewers(pr.reviewers),
    };
}
function summarizeReviewers(reviewers) {
    if (!Array.isArray(reviewers) || reviewers.length === 0) {
        return undefined;
    }
    return reviewers.map((r) => {
        const reviewer = r;
        const user = reviewer.user;
        return {
            name: user?.name,
            displayName: user?.displayName,
            approved: reviewer.approved,
            status: reviewer.status,
        };
    });
}
/**
 * Creates a summary of a repository with only essential fields.
 */
export function summarizeRepository(repo) {
    const project = repo.project;
    return {
        slug: repo.slug,
        name: repo.name,
        description: repo.description,
        project: project
            ? {
                key: project.key,
                name: project.name,
            }
            : undefined,
        public: repo.public,
        forkable: repo.forkable,
        defaultBranch: repo.defaultBranch?.displayId,
        scmId: repo.scmId,
    };
}
/**
 * Creates a summary of a branch with only essential fields.
 */
export function summarizeBranch(branch) {
    return {
        id: branch.id,
        displayId: branch.displayId,
        type: branch.type,
        latestCommit: branch.latestCommit,
        latestChangeset: branch.latestChangeset,
        isDefault: branch.isDefault,
    };
}
/**
 * Creates a summary of a commit with only essential fields.
 */
export function summarizeCommit(commit) {
    const author = commit.author;
    const committer = commit.committer;
    return {
        id: commit.id,
        displayId: commit.displayId,
        message: commit.message,
        author: author
            ? {
                name: author.name,
                emailAddress: author.emailAddress,
            }
            : undefined,
        authorTimestamp: commit.authorTimestamp,
        committer: committer
            ? {
                name: committer.name,
                emailAddress: committer.emailAddress,
            }
            : undefined,
        committerTimestamp: commit.committerTimestamp,
        parents: commit.parents,
    };
}
/**
 * Creates a summary of a project with only essential fields.
 */
export function summarizeProject(project) {
    return {
        key: project.key,
        name: project.name,
        description: project.description,
        public: project.public,
        type: project.type,
    };
}
/**
 * Maps an array of items through a summarizer function.
 * Returns undefined if the array is empty.
 */
export function summarizeArray(items, summarizer) {
    if (!Array.isArray(items) || items.length === 0) {
        return undefined;
    }
    return items.map((item) => summarizer(item));
}
//# sourceMappingURL=field-filter.js.map