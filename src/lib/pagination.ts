import type { AxiosInstance } from "axios";
export const DC_DEFAULT_LIMIT = 25;
export const DC_MAX_LIMIT = 100;
export const DC_ALL_ITEMS_CAP = 1000;
export interface PageResult<T = unknown> {
    values: T[];
    start: number | undefined;
    limit: number;
    isLastPage: boolean;
    nextPageStart?: number;
    totalFetched: number;
    fetchedPages: number;
}
export interface FetchPageOptions {
    limit?: number;
    start?: number;
    all?: boolean;
    params?: Record<string, unknown>;
    maxItems?: number;
}
interface PagedResponse {
    values?: unknown;
    start?: number;
    limit?: number;
    isLastPage?: boolean;
    nextPageStart?: number;
}
function clampLimit(value: number | undefined): number {
    if (value === undefined || !Number.isFinite(value))
        return DC_DEFAULT_LIMIT;
    const n = Math.floor(value);
    if (n < 1)
        return 1;
    return Math.min(n, DC_MAX_LIMIT);
}
// eslint-disable-next-line max-params
async function fetchSinglePage<T>(client: AxiosInstance, path: string, requestParams: Record<string, unknown>, resolvedLimit: number): Promise<PageResult<T>> {
    const response = await client.get<PagedResponse>(path, { params: requestParams });
    const data = response.data;
    const values: T[] = Array.isArray(data.values) ? data.values : [];
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
async function fetchAllPages<T>(client: AxiosInstance, path: string, params: Record<string, unknown>, resolvedLimit: number, maxItems: number): Promise<PageResult<T>> {
    const aggregated: T[] = [];
    let fetchedPages = 0;
    let nextStart: number | undefined = undefined;
    let lastLimit = resolvedLimit;
    while (aggregated.length < maxItems) {
        const pageParams: Record<string, unknown> = {
            ...params,
            limit: resolvedLimit,
        };
        if (nextStart !== undefined) {
            pageParams.start = nextStart;
        }
        const response = await client.get<PagedResponse>(path, { params: pageParams });
        const data = response.data;
        const values: T[] = Array.isArray(data.values) ? data.values : [];
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
export async function fetchPage<T = Record<string, unknown>>(client: AxiosInstance, path: string, options: FetchPageOptions = {}): Promise<PageResult<T>> {
    const { limit, start, all = false, params = {}, maxItems = DC_ALL_ITEMS_CAP, } = options;
    const resolvedLimit = clampLimit(limit);
    const requestParams: Record<string, unknown> = {
        ...params,
        limit: resolvedLimit,
    };
    if (start !== undefined) {
        requestParams.start = start;
    }
    // Single page fetch
    if (!all || start !== undefined) {
        return await fetchSinglePage<T>(client, path, requestParams, resolvedLimit);
    }
    // Fetch all pages
    return await fetchAllPages<T>(client, path, params, resolvedLimit, maxItems);
}
