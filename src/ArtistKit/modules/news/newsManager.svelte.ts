import { queryCountREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import { firebaseImageSourceToImageSource, type FirebaseDate, type FirebaseImageSource, type FirebaseInteger, type FirebaseMap, type FirebaseObject, type FirebaseString } from "../../core/types/firebaseTypes";
import type { ImageSource } from "../../core/types/imageTypes";

export interface NewsContent {
    title: string;
    content: string;
}

export interface News {
    image: ImageSource;
    thumbnail: ImageSource;
    imageCopyright: string;
    text: {
        [key: string]: NewsContent;
    }
    date: Date;
}

export type NewsFetchResult = FetchResult<News>;

export type FirebaseNews = News;

interface RawNews {
    image: FirebaseImageSource;
    thumbnail: FirebaseImageSource;

    imageCopyright: FirebaseString;

    text: FirebaseMap<FirebaseObject<{
        title: FirebaseString;
        content: FirebaseString;
    }>>;
    title: FirebaseString;
    content: FirebaseString;
    date: FirebaseDate;
}

function rawNewsToNews(rawFields: RawNews): News {
    return {
        image: firebaseImageSourceToImageSource(rawFields.image),
        thumbnail: firebaseImageSourceToImageSource(rawFields.thumbnail),
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
            if (this.#news.items.length > limit) {
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