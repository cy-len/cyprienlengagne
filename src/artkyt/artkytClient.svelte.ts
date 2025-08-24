import { PUBLIC_ARTKYT_PROFILE_ID, PUBLIC_ARTKYT_WEBSITE_ID } from "$env/static/public";
import { failure, ok, type Result } from "../utils/result";
import type { SocialPlatformCode } from "./constants/externalPlatforms";
import type { APIComposition, APIConcert, APIConcertPreview, APIConcertPreviewsListParams, APIGallery, APINewsItem, APIPostContactMessageBody, APIRecording, APISubscribeToNewsletterBody, ArtkytImage, ArtkytProfileLink, Paginated, Pagination, SingleBioPreview } from "./types";


async function fetchArtkytEndpoint<T>(endpoint: string, fetchFunction = fetch, options: RequestInit = {}): Promise<Result<T>> {
    try {
        const res = await fetchFunction(`http://www.artkyt.com/api/public/profile/${PUBLIC_ARTKYT_PROFILE_ID}/${endpoint}`, options);
        const json = await res.json() as T;
        
        if (!res.ok) {
            return failure({
                code: res.status.toString(),
                message: `Artkyt API returned status ${res.status}`
            });
        }

        return ok(json);
    } catch (error) {
        return failure({
            code: "error",
            message: "An error occured while fetching artkyt"
        });
    }
}

const ONE_HOUR_MS = 60 * 60 * 1000;

function paginationToUrlParams(pagination: Partial<Pagination> = {}): string {
    return `page=${pagination.page ?? 0}&pageSize=${pagination.pageSize ?? 10}`;
}

function concertsListParamsToUrlParams(params: Partial<APIConcertPreviewsListParams>): string {
    const queryParams = new URLSearchParams();

    if (params.ids && params.ids.length > 0) {
        queryParams.set("ids", params.ids.join(";"));
    }

    if (params.tags && params.tags.length > 0) {
        queryParams.set("tags", params.tags.map(t => t.value ? `${t.name}:${t.value}` : t.name).join(";"));
    }

    if (params.getPerformances) {
        queryParams.set("getPerformances", params.getPerformances);
    }

    if (params.includeCancelled !== undefined) {
        queryParams.set("includeCancelled", params.includeCancelled.toString());
    }

    if (params.includeFull !== undefined) {
        queryParams.set("includeFull", params.includeFull.toString());
    }

    if (params.fromDate) {
        queryParams.set("from", params.fromDate.toISOString());
    }

    if (params.toDate) {
        queryParams.set("to", params.toDate.toISOString());
    }

    if (params.sort) {
        queryParams.set("sort", params.sort);
    }

    return queryParams.toString();
}

interface CacheItem<T = any> {
    value: T;
    lastFetchTimestamp: number;
}

interface EndpointFetchOptions {
    fetchFunction?: typeof fetch;
    ttl?: number;
}

class ArtkytEndpointMemCache {
    #cache: Record<string, CacheItem> = {};

    async getItem<T>(endpoint: string, options: EndpointFetchOptions = {}): Promise<Result<T>> {
        const ttl = options.ttl ?? ONE_HOUR_MS;

        if (!this.#cache[endpoint] || Date.now() - this.#cache[endpoint].lastFetchTimestamp > ttl) {
            console.log("Cache miss");
            const value = await fetchArtkytEndpoint(endpoint, options.fetchFunction ?? fetch);
            this.#cache[endpoint] = {
                value,
                lastFetchTimestamp: Date.now()
            };
        } else {
            console.log("Cache hit");
        }

        return this.#cache[endpoint].value;
    }

    async getProfileLinks(platforms: SocialPlatformCode[] | undefined = undefined, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ links: ArtkytProfileLink[] }>>> {
        return this.getItem(
            `links?${platforms ? `platforms=${platforms.join(";")}&` : ""}${paginationToUrlParams(pagination)}`,
            options
        );
    }

    async getBio(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ bio: SingleBioPreview}>> {
        return this.getItem(`bios/${id}?lang=${lang}`, options);
    }

    async getNewsList(lang: string, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ news: APINewsItem[] }>>> {
        return this.getItem(`news?lang=${lang}&${paginationToUrlParams(pagination)}`, options);
    }

    async getNews(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ news: APINewsItem }>> {
        return this.getItem(`news/${id}?lang=${lang}`, options);
    }

    async getConcertsList(lang: string, params: Partial<APIConcertPreviewsListParams> = {}, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ concerts: APIConcertPreview[] }>>> {
        console.log(lang, params, pagination)
        return this.getItem(
            `concerts?lang=${lang}&${concertsListParamsToUrlParams(params)}&${paginationToUrlParams(pagination)}`,
            options
        );
    }

    async getConcert(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ concert: APIConcert }>> {
        return this.getItem(
            `concerts/${id}?lang=${lang}`,
            options
        );
    }

    async getCompositionsList(lang: string, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ compositions: APIComposition[] }>>> {
        return this.getItem(
            `compositions?lang=${lang}&${paginationToUrlParams(pagination)}`,
            options
        );
    }

    async getComposition(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ composition: APIComposition }>> {
        return this.getItem(
            `compositions/${id}?lang=${lang}`,
            options
        );
    }

    async getGalleriesList(lang: string, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ galleries: APIGallery[] }>>> {
        return this.getItem(
            `galleries?lang=${lang}&${paginationToUrlParams(pagination)}`,
            options
        );
    }

    async getGallery(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ gallery: APIGallery }>> {
        return this.getItem(
            `galleries/${id}?lang=${lang}`,
            options
        );
    }

    async getRecordingsList(lang: string, pagination: Partial<Pagination> = {}, options: EndpointFetchOptions = {}): Promise<Result<Paginated<{ recordings: APIRecording[] }>>> {
        return this.getItem(
            `recordings?lang=${lang}&${paginationToUrlParams(pagination)}`,
            options
        );
    }

    async getRecording(id: string, lang: string, options: EndpointFetchOptions = {}): Promise<Result<{ recording: APIRecording }>> {
        return this.getItem(
            `recordings/${id}?lang=${lang}`,
            options
        );
    }

    async postContactMessage(message: APIPostContactMessageBody, fetchFunction = fetch) {
        return fetchArtkytEndpoint(`postContactMessage/${PUBLIC_ARTKYT_WEBSITE_ID}`, fetchFunction, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        });
    }

    async subscribeToNewsletter(newsletterId: string, subscription: APISubscribeToNewsletterBody, fetchFunction = fetch) {
        return fetchArtkytEndpoint(`subscribeToNewsletter/${newsletterId}/${PUBLIC_ARTKYT_WEBSITE_ID}`, fetchFunction, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription)
        });
    }
}

export const artkytClient = new ArtkytEndpointMemCache();