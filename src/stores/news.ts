import { queryFirebaseAggregationREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { News } from "../types/news";
import { Status } from "../types/status";
import { get, writable } from "svelte/store";

export interface NewsFetchResult {
    news: News[];
    total: number;
    status: Status;
}

export const news = writable<NewsFetchResult>({
    news: [],
    total: -1,
    status: Status.PENDING
});

interface RawNews {
    imageUrl: {
        stringValue: string;
    },
    imageCopyright: {
        stringValue: string;
    },
    text: {
        mapValue: {
            fields: {
                [key: string]: {
                    mapValue: {
                        fields: {
                            title: {
                                stringValue: string;
                            };
                            content: {
                                stringValue: string;
                            }
                        }
                    }
                }
            }
        }
    }
    title: {
        stringValue: string;
    },
    content: {
        stringValue: string;
    },
    date: {
        timestampValue: string;
    }
}

function rawNewsToNews(rawFields: RawNews): News {
    return {
        imageUrl: rawFields.imageUrl.stringValue,
        imageCopyright: rawFields.imageCopyright.stringValue,
        text: {
            en: {
                title: rawFields.text.mapValue.fields["en"].mapValue.fields.title.stringValue,
                content: rawFields.text.mapValue.fields["en"].mapValue.fields.content.stringValue,
            },
            fr: {
                title: rawFields.text.mapValue.fields["fr"].mapValue.fields.title.stringValue,
                content: rawFields.text.mapValue.fields["fr"].mapValue.fields.content.stringValue,
            },
        },
        date: new Date(rawFields.date.timestampValue),
    };
}

export async function queryNewsCount(fetchFunction = fetch): Promise<number> {
    const countRaw = await queryFirebaseAggregationREST({
        structuredAggregationQuery: {
            aggregations: [
                {
                    count: {},
                },
            ],
            structuredQuery: {
                from: [{ collectionId: "news" }],
            },
        },
    }, fetchFunction);

    return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
}

export async function queryNews(limit: number, fetchFunction = fetch): Promise<News[]> {
    const raw = await queryFirebaseREST<RawNews>({
        structuredQuery: {
            from: [
                {
                    collectionId: "news",
                },
            ],
            orderBy: [
                {
                    field: {
                        fieldPath: "date",
                    },
                    direction: "DESCENDING",
                },
            ],
            limit: limit
        }
    }, fetchFunction);

    return raw.map((rawNews => rawNewsToNews(rawNews.document.fields)));
}

export async function updateNews(limit: number = 20, fetchFunction = fetch) {
    try {
        const current = get(news);
        if (current.news.length > limit && current.total < limit) {
            return;
        }
        
        const countPromise = current.total > -1 ? Promise.resolve(current.total) : queryNewsCount(fetchFunction);
        const [newsCount, newsArray] = await Promise.all([countPromise, queryNews(limit, fetchFunction)]);

        news.set({
            news: newsArray,
            total: newsCount,
            status: Status.OK
        });
    } catch (error) {
        console.log(error)
        news.set({
            news: [],
            total: -1,
            status: Status.FAILED
        });
    }
}