import { queryFirebaseAggregationREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { Concert } from "../types/concert";
import { Status } from "../types/status";
import { get, writable } from "svelte/store";

export interface ConcertFetchResult {
    concerts: Concert[];
    total: number;
    status: Status;
}

export const upcomingConcerts = writable<ConcertFetchResult>({
    concerts: [],
    total: -1,
    status: Status.PENDING
});

export const pastConcerts = writable<ConcertFetchResult>({
    concerts: [],
    total: -1,
    status: Status.PENDING
});

interface RawConcert {
    date: {
        timestampValue: string;
    };
    endDate?: {
        timestampValue: string;
    };
    location: {
        stringValue: string;
    };
    description: {
        stringValue: string;
    };
    url?: {
        stringValue: string;
    };
};

function rawConcertToConcert(rawFields: RawConcert): Concert {
    return {
        location: rawFields.location.stringValue,
        description: rawFields.description.stringValue,
        date: new Date(rawFields.date.timestampValue),
        url: rawFields.url?.stringValue ?? ""
    };
}

export async function queryConcertsCount(whereFilter: object, fetchFunction = fetch): Promise<number> {
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

export async function queryConcerts(whereFilter: object, orderBy: object[], limit: number, fetchFunction = fetch): Promise<Concert[]> {
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

export async function updateUpcomingConcerts(limit: number = 100, fetchFunction = fetch) {
    try {
        const current = get(upcomingConcerts);
        if (current.concerts.length > limit && current.total < limit) {
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
        

        const upcomingCountPromise = current.total > -1 ? Promise.resolve(current.total) : queryConcertsCount(upcomingWhere, fetchFunction);
        const [upcomingCount, upcomingArray] = await Promise.all([upcomingCountPromise, queryConcerts(upcomingWhere, [upcomingOrderBy], limit, fetchFunction)]);

        upcomingConcerts.set({
            concerts: upcomingArray,
            total: upcomingCount,
            status: Status.OK
        });
    } catch (error) {
        upcomingConcerts.set({
            concerts: [],
            total: -1,
            status: Status.FAILED
        });
    }
}

export async function updatePastConcerts(limit: number = 100, fetchFunction = fetch) {
    try {
        const current = get(pastConcerts);
        if (current.concerts.length > limit && current.total < limit) {
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

        const pastCountPromise = current.total > -1 ? Promise.resolve(current.total) : queryConcertsCount(pastWhere, fetchFunction);
        const [pastCount, pastArray] = await Promise.all([pastCountPromise, queryConcerts(pastWhere, [pastOrderBy], limit, fetchFunction)]);

        pastConcerts.set({
            concerts: pastArray,
            total: pastCount,
            status: Status.OK
        });
    } catch (error) {
        pastConcerts.set({
            concerts: [],
            total: -1,
            status: Status.FAILED
        });
    }
}