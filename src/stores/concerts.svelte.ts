import { queryFirebaseAggregationREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { Concert } from "../types/concert";
import { Status, type FetchResult } from "../types/status";

export type ConcertFetchResult = FetchResult<Concert>;

interface RawConcert {
    location: {
        stringValue: string;
    };
    locationPrecise: {
        stringValue: string;
    };
    date: {
        timestampValue: string;
    };
    endDate?: {
        timestampValue: string;
    };
    timeEnabled: {
        booleanValue: boolean;
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
    url?: {
        stringValue: string;
    };
    imgUrl?: {
        stringValue: string;
    };
    imgXOffset?: {
        integerValue: number;
    };
    imgYOffset?: {
        integerValue: number;
    };
    thumbnailUrl?: {
        stringValue: string;
    };
    thumbnailXOffset?: {
        integerValue: number;
    };
    thumbnailYOffset?: {
        integerValue: number;
    };
    tags?: {
        mapValue: {
            fields: {
                [key: string]: {
                    stringValue: string;
                };
            };
        };
    }
};

function rawConcertToConcert(rawFields: RawConcert): Concert {
    const lingual: { [key: string]: string } = {};
    if (rawFields.lingualDescriptions) {
        for (const lang in rawFields.lingualDescriptions.mapValue.fields) {
            lingual[lang] = rawFields.lingualDescriptions.mapValue.fields[lang].stringValue;
        }
    }
    
    const tags: { [key: string]: string } = {};
    if (rawFields.tags) {
        for (const tag in rawFields.tags.mapValue.fields) {
            tags[tag] = rawFields.tags.mapValue.fields[tag].stringValue;
        }
    }

    return {
        location: rawFields.location.stringValue,
        locationPrecise: rawFields.locationPrecise?.stringValue ?? "",
        date: new Date(rawFields.date.timestampValue),
        endDate: rawFields.endDate ? new Date(rawFields.endDate.timestampValue) : undefined,
        timeEnabled: rawFields.timeEnabled?.booleanValue ?? false,
        description: rawFields.description.stringValue,
        lingualDescriptions: lingual,
        url: rawFields.url?.stringValue ?? "",
        image: rawFields.imgUrl ? {
                url: rawFields.imgUrl.stringValue,
                xOffset: rawFields.imgXOffset?.integerValue ?? 50,
                yOffset: rawFields.imgYOffset?.integerValue ?? 50
            } : undefined,
        thumbnail: rawFields.thumbnailUrl ? {
                url: rawFields.thumbnailUrl.stringValue,
                xOffset: rawFields.thumbnailXOffset?.integerValue ?? 50,
                yOffset: rawFields.thumbnailYOffset?.integerValue ?? 50
            } : undefined,
        tags
    };
}

class ConcertsManager {
    #upcoming: ConcertFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    #past: ConcertFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    async #queryConcertsCount(whereFilter: object, fetchFunction = fetch): Promise<number> {
        const countRaw = await queryFirebaseAggregationREST({
            structuredAggregationQuery: {
                aggregations: [
                    {
                        count: {},
                    },
                ],
                structuredQuery: {
                    from: [{ collectionId: "concerts" }],
                    where: whereFilter
                },
            },
        }, fetchFunction);
    
        return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
    }

    async #queryConcerts(whereFilter: object, orderBy: object[], limit: number, fetchFunction = fetch): Promise<Concert[]> {
        const raw = await queryFirebaseREST<RawConcert>({
            structuredQuery: {
                from: [
                    {
                        collectionId: "concerts",
                    },
                ],
                where: whereFilter,
                orderBy,
                limit: limit
            }
        }, fetchFunction);
    
        return raw.map((rawConcert => rawConcertToConcert(rawConcert.document.fields)));
    }

    async updateUpcoming(limit: number = 100, fetchFunction = fetch) {
        try {
            if (this.#upcoming.items.length > limit) {
                return;
            }
    
            const todayMorning = new Date();
            todayMorning.setHours(0, 0, 0);
            const upcomingWhere = {
                fieldFilter: {
                    field: { fieldPath: "date" },
                    op: "GREATER_THAN",
                    value: { timestampValue: todayMorning.toISOString() },
                },
            };
            const upcomingOrderBy = {
                field: {
                    fieldPath: "date",
                },
                direction: "ASCENDING",
            };
            
    
            const upcomingCountPromise = this.#upcoming.total > -1 ? Promise.resolve(this.#upcoming.total) : this.#queryConcertsCount(upcomingWhere, fetchFunction);
            const [upcomingCount, upcomingArray] = await Promise.all([
                upcomingCountPromise,
                this.#queryConcerts(upcomingWhere, [upcomingOrderBy], limit, fetchFunction)
            ]);

            this.#upcoming = {
                items: upcomingArray,
                total: upcomingCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);
            this.#upcoming = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    async updatePast(limit: number = 100, fetchFunction = fetch) {
        try {
            if (this.#past.items.length > limit) {
                return;
            }
            
            const todayMorning = new Date();
            todayMorning.setHours(0, 0, 0);
            const pastWhere = {
                fieldFilter: {
                    field: { fieldPath: "date" },
                    op: "LESS_THAN",
                    value: { timestampValue: todayMorning.toISOString() },
                },
            };
            const pastOrderBy = {
                field: {
                    fieldPath: "date",
                },
                direction: "DESCENDING",
            };
    
            const pastCountPromise = this.#past.total > -1 ? Promise.resolve(this.#past.total) : this.#queryConcertsCount(pastWhere, fetchFunction);
            const [pastCount, pastArray] = await Promise.all([
                pastCountPromise,
                this.#queryConcerts(pastWhere, [pastOrderBy], limit, fetchFunction)
            ]);

            this.#past = {
                items: pastArray,
                total: pastCount,
                status: Status.OK
            };
        } catch (error) {
            this.#past = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get upcoming() {
        return this.#upcoming;
    }

    get past() {
        return this.#past;
    }
}

export const concertsManager = new ConcertsManager();