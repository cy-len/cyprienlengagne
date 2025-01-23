import { queryCountREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import type { Composition } from "../types/composition";
import { Status, type FetchResult } from "../types/status";

export type CompositionFetchResult = FetchResult<Composition>;

interface RawComposition {
    name: {
        stringValue: string;
    };
    compositionDate: {
        timestampValue: string;
    };
    duration: {
        stringValue: string;
    };
    category: {
        stringValue: string;
    };
    instrumentation: {
        stringValue: string;
    };
    premiered: {
        booleanValue: boolean;
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
}

function rawCompositionToComposition(rawFields: RawComposition): Composition {
    const lingual: { [key: string]: string } = {};
    if (rawFields.lingualDescriptions) {
        for (const lang in rawFields.lingualDescriptions.mapValue.fields) {
            lingual[lang] = rawFields.lingualDescriptions.mapValue.fields[lang].stringValue;
        }
    }

    return {
        name: rawFields.name.stringValue,
        compositionDate: new Date(rawFields.compositionDate.timestampValue),
        duration: rawFields.duration.stringValue,
        category: rawFields.category.stringValue,
        instrumentation: rawFields.instrumentation.stringValue,
        premiered: rawFields.premiered.booleanValue,
        premiereDate: new Date(rawFields.premiereDate.timestampValue),
        premiereLocation: rawFields.premiereLocation.stringValue,
        premierePerformers: rawFields.premierePerformers.stringValue,
        recordingVideo: rawFields.recordingVideo.stringValue,
        description: rawFields.description.stringValue,
        lingualDescriptions: lingual
    };
}

class CompositionsManager {
    #compositions: CompositionFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    #queryCompositionsCount = async (fetchFunction = fetch) => queryCountREST("compositions", fetchFunction);

    async #queryCompositions(limit: number, fetchFunction = fetch): Promise<Composition[]> {
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
    
        return raw.map((rawComposition => rawCompositionToComposition(rawComposition.document.fields)));
    }

    async updateCompositions(limit: number = 20, fetchFunction = fetch) {
        try {
            if (this.#compositions.items.length > limit && this.#compositions.total < limit) {
                return;
            }
            
            const countPromise = this.#compositions.total > -1 ? Promise.resolve(this.#compositions.total) : this.#queryCompositionsCount(fetchFunction);
            const [compositionsCount, compositionsArray] = await Promise.all([countPromise, this.#queryCompositions(limit, fetchFunction)]);

            this.#compositions = {
                items: compositionsArray,
                total: compositionsCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);

            this.#compositions = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get compositions() {
        return this.#compositions;
    }
}

export const compositionsManager = new CompositionsManager();