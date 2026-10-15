export const DC_DEFAULT_LIMIT = 25;
export const DC_MAX_LIMIT = 100;
export const DC_ALL_ITEMS_CAP = 1000;
function clampLimit(value) {
    if (value === undefined || !Number.isFinite(value))
        return DC_DEFAULT_LIMIT;
    const n = Math.floor(value);
    if (n < 1)
        return 1;
    return Math.min(n, DC_MAX_LIMIT);
}
// eslint-disable-next-line max-params
async function fetchSinglePage(client, path, requestParams, resolvedLimit) {
    const response = await client.get(path, { params: requestParams });
    const data = response.data;
    const values = (Array.isArray(data.values) ? data.values : []);
    return {
        values,
        start: data.start,
        limit: data.limit ?? resolvedLimit,
        isLastPage: data.isLastPage ?? true,
        nextPageStart: data.nextPageStart,
        totalFetched: values.length,
        fetchedPages: 1,
    };
}
// eslint-disable-next-line max-params
async function fetchAllPages(client, path, params, resolvedLimit, maxItems) {
    const aggregated = [];
    let fetchedPages = 0;
    let nextStart = undefined;
    let lastLimit = resolvedLimit;
    while (aggregated.length < maxItems) {
        const pageParams = {
            ...params,
            limit: resolvedLimit,
        };
        if (nextStart !== undefined) {
            pageParams.start = nextStart;
        }
        const response = await client.get(path, { params: pageParams });
        const data = response.data;
        const values = (Array.isArray(data.values) ? data.values : []);
        aggregated.push(...values);
        fetchedPages++;
        lastLimit = data.limit ?? resolvedLimit;
        const isLastPage = data.isLastPage ?? true;
        if (isLastPage)
            break;
        const nps = data.nextPageStart;
        if (nps === undefined)
            break;
        nextStart = nps;
    }
    if (aggregated.length > maxItems) {
        aggregated.length = maxItems;
    }
    return {
        values: aggregated,
        start: 0,
        limit: lastLimit,
        isLastPage: true,
        totalFetched: aggregated.length,
        fetchedPages,
    };
}
export async function fetchPage(client, path, options = {}) {
    const { limit, start, all = false, params = {}, maxItems = DC_ALL_ITEMS_CAP, } = options;
    const resolvedLimit = clampLimit(limit);
    const requestParams = {
        ...params,
        limit: resolvedLimit,
    };
    if (start !== undefined) {
        requestParams.start = start;
    }
    // Single page fetch
    if (!all || start !== undefined) {
        return await fetchSinglePage(client, path, requestParams, resolvedLimit);
    }
    // Fetch all pages
    return await fetchAllPages(client, path, params, resolvedLimit, maxItems);
}
//# sourceMappingURL=pagination.js.map