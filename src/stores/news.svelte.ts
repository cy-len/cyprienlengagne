import { queryCountREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { News } from "../types/news";
import { Status, type FetchResult } from "../types/status";

export type NewsFetchResult = FetchResult<News>;

interface RawNews {
    imageUrl: {
        stringValue: string;
    },
    thumbnailUrl?: {
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
        thumbnailUrl: rawFields.thumbnailUrl?.stringValue,
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

class NewsManager {
    #news: NewsFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    #queryNewsCount = async (fetchFunction = fetch) => queryCountREST("news", fetchFunction);

    async #queryNews(limit: number, fetchFunction = fetch): Promise<News[]> {
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

    async updateNews(limit: number = 20, fetchFunction = fetch) {
        try {
            if (this.#news.items.length > limit && this.#news.total < limit) {
                return;
            }
            
            const countPromise = this.#news.total > -1 ? Promise.resolve(this.#news.total) : this.#queryNewsCount(fetchFunction);
            const [newsCount, newsArray] = await Promise.all([countPromise, this.#queryNews(limit, fetchFunction)]);

            this.#news = {
                items: newsArray,
                total: newsCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);

            this.#news = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get news() {
        return this.#news;
    }
}

export const newsManager = new NewsManager();