import { queryFirebaseAggregationREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import { optionalFirebaseImageSourceToOptionalImageSource, optionalStringFirebaseMapValueToObject, type FirebaseBoolean, type FirebaseDate, type FirebaseImageSource, type FirebaseInteger, type FirebaseString, type FirebaseStringMap } from "../../core/types/firebaseTypes";
import type { ImageSource } from "../../core/types/imageTypes";

export interface Concert {
    location: string;
    locationPrecise: string;

    description: string;
    lingualDescriptions: { [key: string]: string };
    
    timeEnabled: boolean;
    date: Date;
    endDate?: Date;
    
    url?: string;
    
    image?: ImageSource;
    thumbnail?: ImageSource;

    tags: { [key: string]: string };
}

export type ConcertFetchResult = FetchResult<Concert>;

export type FirebaseConcert = Concert;

interface RawConcert {
    location: FirebaseString;
    locationPrecise: FirebaseString;

    date: FirebaseDate;
    endDate?: FirebaseDate;
    timeEnabled: FirebaseBoolean;

    description: FirebaseString;
    lingualDescriptions: FirebaseStringMap;

    url?: FirebaseString;

    image?: FirebaseImageSource;
    thumbnail?: FirebaseImageSource;

    tags?: FirebaseStringMap;
};

function rawConcertToConcert(rawFields: RawConcert): Concert {
    return {
        location: rawFields.location.stringValue,
        locationPrecise: rawFields.locationPrecise?.stringValue ?? "",
        date: new Date(rawFields.date.timestampValue),
        endDate: rawFields.endDate ? new Date(rawFields.endDate.timestampValue) : undefined,
        timeEnabled: rawFields.timeEnabled?.booleanValue ?? false,
        description: rawFields.description.stringValue,
        lingualDescriptions: optionalStringFirebaseMapValueToObject(rawFields.lingualDescriptions),
        url: rawFields.url?.stringValue ?? "",
        image: optionalFirebaseImageSourceToOptionalImageSource(rawFields.image),
        thumbnail: optionalFirebaseImageSourceToOptionalImageSource(rawFields.image),
        tags: optionalStringFirebaseMapValueToObject(rawFields.tags)
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