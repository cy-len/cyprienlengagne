import { queryFirebaseAggregationREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { PlatformPossibility, Recording } from "../types/recording";
import { Status, type FetchResult } from "../types/status";

export interface Album {
    title: string;
    subtitle?: string;
    date: Date;
    description: string;
    lingualDescriptions: { [key: string]: string };
    imgUrl: string;
    thumbnailUrl: string;
    recordings: Recording[];
    buyUrl?: string;
}

export type AlbumFetchResult = FetchResult<Album>;

interface RawAlbum {
    title: {
        stringValue: string;
    };
    subtitle: {
        stringValue: string;
    };
    date: {
        timestampValue: string;
    };
    description: {
        stringValue: string;
    };
    lingualDescriptions: {
        mapValue: {
            fields: {
                [key: string]: {
                    stringValue: string;
                };
            };
        };
    };
    imgUrl: {
        stringValue: string;
    };
    thumbnailUrl: {
        stringValue: string;
    };
    buyUrl?: {
        stringValue: string;
    };
    recordings: {
        arrayValue: {
            values: {
                mapValue: {
                    fields: {
                        platform: {
                            stringValue: PlatformPossibility;
                        };
                        link: {
                            stringValue: string;
                        };
                    };
                };
            }[];
        };
    };
};

function rawAlbumToAlbum(rawFields: RawAlbum): Album {
    const lingual: { [key: string]: string } = {};
    if (rawFields.lingualDescriptions) {
        for (const lang in rawFields.lingualDescriptions.mapValue.fields) {
            lingual[lang] = rawFields.lingualDescriptions.mapValue.fields[lang].stringValue;
        }
    }

    return {
        title: rawFields.title.stringValue,
        subtitle: rawFields.subtitle.stringValue,
        date: new Date(rawFields.date.timestampValue),
        description: rawFields.description.stringValue,
        lingualDescriptions: lingual,
        imgUrl: rawFields.imgUrl.stringValue,
        thumbnailUrl: rawFields.thumbnailUrl.stringValue,
        buyUrl: rawFields.buyUrl?.stringValue ?? "",
        recordings: (rawFields.recordings?.arrayValue.values ?? []).map((v) => {
            return {
                platform: v.mapValue.fields.platform.stringValue,
                link: v.mapValue.fields.link.stringValue,
            };
        })
    };
}

class DiscographyManager {
    #albums: AlbumFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    async #queryAlbumsCount(whereFilter: object, fetchFunction = fetch): Promise<number> {
        const countRaw = await queryFirebaseAggregationREST({
            structuredAggregationQuery: {
                aggregations: [
                    {
                        count: {},
                    },
                ],
                structuredQuery: {
                    from: [{ collectionId: "albums" }],
                    where: whereFilter
                },
            },
        }, fetchFunction);
    
        return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
    }

    async #queryAlbums(whereFilter: object, orderBy: object[], limit: number, fetchFunction = fetch): Promise<Album[]> {
        const raw = await queryFirebaseREST<RawAlbum>({
            structuredQuery: {
                from: [
                    {
                        collectionId: "albums",
                    },
                ],
                where: whereFilter,
                orderBy,
                limit: limit
            }
        }, fetchFunction);
    
        return raw.map((rawAlbum => rawAlbumToAlbum(rawAlbum.document.fields)));
    }

    async updateDiscography(limit: number = 100, fetchFunction = fetch) {
        try {
            if (this.#albums.items.length > limit) {
                return;
            }
            
            const albumsOrderBy = {
                field: {
                    fieldPath: "date",
                },
                direction: "ASCENDING",
            };
            
    
            const upcomingCountPromise = this.#albums.total > -1 ? Promise.resolve(this.#albums.total) : this.#queryAlbumsCount({}, fetchFunction);
            const [upcomingCount, upcomingArray] = await Promise.all([
                upcomingCountPromise,
                this.#queryAlbums({}, [albumsOrderBy], limit, fetchFunction)
            ]);

            this.#albums = {
                items: upcomingArray,
                total: upcomingCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);
            this.#albums = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get albums() {
        return this.#albums;
    }
}

export const discographyManager = new DiscographyManager();