import { queryFirebaseAggregationREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { Composition } from "../types/composition";
import { Status } from "../types/status";
import { get, writable } from "svelte/store";

export interface CompositionFetchResult {
    compositions: Composition[];
    total: number;
    status: Status;
}

export const compositions = writable<CompositionFetchResult>({
    compositions: [],
    total: -1,
    status: Status.PENDING
});

interface RawComposition {
    name: {
        stringValue: string;
    };
    description: {
        stringValue: string;
    };
    category: {
        stringValue: string;
    };
    premiereDate: {
        timestampValue: string;
    };
    premiereLocation: {
        stringValue: string;
    };
    premierePerformers: {
        stringValue: string;
    };
    recordingVideo: {
        stringValue: string;
    };
}

function rawCompositionToComposition(rawFields: RawComposition): Composition {
    return {
        name: rawFields.name.stringValue,
        description: rawFields.description.stringValue,
        category: rawFields.category.stringValue,
        premiereDate: new Date(rawFields.premiereDate.timestampValue),
        premiereLocation: rawFields.premiereLocation.stringValue,
        premierePerformers: rawFields.premierePerformers.stringValue,
        recordingVideo: rawFields.recordingVideo.stringValue,
    };
}

export async function queryCompositionsCount(fetchFunction = fetch): Promise<number> {
    const countRaw = await queryFirebaseAggregationREST({
        structuredAggregationQuery: {
            aggregations: [
                {
                    count: {},
                },
            ],
            structuredQuery: {
                from: [{ collectionId: "compositions" }],
            },
        },
    }, fetchFunction);

    return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
}

export async function queryCompositions(limit: number, fetchFunction = fetch): Promise<Composition[]> {
    const raw = await queryFirebaseREST<RawComposition>({
        structuredQuery: {
            from: [
                {
                    collectionId: "compositions",
                },
            ],
            orderBy: [
                {
                    field: {
                        fieldPath: "premiereDate",
                    },
                    direction: "DESCENDING",
                },
            ],
            limit: limit
        }
    }, fetchFunction);

    console.log(raw);

    return raw.map((rawComposition => rawCompositionToComposition(rawComposition.document.fields)));
}

export async function updateCompositions(limit: number = 20, fetchFunction = fetch) {
    try {
        const current = get(compositions);
        if (current.compositions.length > limit && current.total < limit) {
            return;
        }
        
        const countPromise = current.total > -1 ? Promise.resolve(current.total) : queryCompositionsCount(fetchFunction);
        const [compositionsCount, compositionsArray] = await Promise.all([countPromise, queryCompositions(limit, fetchFunction)]);

        compositions.set({
            compositions: compositionsArray,
            total: compositionsCount,
            status: Status.OK
        });
    } catch (error) {
        console.log(error)
        compositions.set({
            compositions: [],
            total: -1,
            status: Status.FAILED
        });
    }
}