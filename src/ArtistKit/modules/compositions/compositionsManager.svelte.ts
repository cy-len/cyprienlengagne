import type { PlatformPossibility } from "../../../types/recording";
import { queryCountREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import { optionalStringFirebaseMapValueToObject, type FirebaseArray, type FirebaseBoolean, type FirebaseDate, type FirebaseMap, type FirebaseObject, type FirebaseString, type FirebaseStringEnum, type FirebaseStringMap } from "../../core/types/firebaseTypes";
import type { Recording } from "../../core/types/recording";

export interface Composition {
    name: string;
    compositionDate: Date;
    duration: string;
    category: string;
    instrumentation: string;

    premiered: boolean;
    premiereDate: Date;
    premiereLocation: string;
    premierePerformers: string;

    description: string;
    lingualDescriptions: { [key: string]: string };

    recordings: Recording[];
}

export type CompositionFetchResult = FetchResult<Composition>;

interface RawComposition {
    name: FirebaseString;
    compositionDate: FirebaseDate;
    duration: FirebaseString;
    category: FirebaseString;
    instrumentation: FirebaseString;

    premiered: FirebaseBoolean;
    premiereDate: FirebaseDate;
    premiereLocation: FirebaseString;
    premierePerformers: FirebaseString;

    description: FirebaseString;
    lingualDescriptions: FirebaseStringMap;
    
    recordings?: FirebaseArray<FirebaseObject<{
        platform: FirebaseStringEnum<PlatformPossibility>;
        link: FirebaseString;
    }>>;
};

function rawCompositionToComposition(rawFields: RawComposition): Composition {
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
        description: rawFields.description.stringValue,
        lingualDescriptions: optionalStringFirebaseMapValueToObject(rawFields.lingualDescriptions),
        recordings: (rawFields.recordings?.arrayValue.values ?? []).map((v) => {
            return {
                platform: v.mapValue.fields.platform.stringValue,
                link: v.mapValue.fields.link.stringValue,
            };
        })
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
            if (this.#compositions.items.length > limit) {
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

    get availableCompositionCategories(): Set<string> {
        const categories = new Set<string>();
        for (const composition of this.#compositions.items) {
            categories.add(composition.category);
        }

        return categories;
    }
}

export const compositionsManager = new CompositionsManager();