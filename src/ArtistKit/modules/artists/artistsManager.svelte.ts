import { queryFirebaseAggregationREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import { type FirebaseString, type FirebaseStringMap, optionalStringFirebaseMapValueToObject, type FirebaseImageSource, firebaseImageSourceToImageSource } from "../../core/types/firebaseTypes";
import type { ImageSource } from "../../core/types/imageTypes";

export interface Artist {
    name: string;
    role: string;

    image: ImageSource;
    thumbnail: ImageSource;
    
    bio: string;
    lingualBio: { [key: string]: string };
    websiteUrl?: string;

    tags: { [key: string]: string };
}

export type ArtistFetchResult = FetchResult<Artist>;

interface RawArtist {
    name: FirebaseString;
    role: FirebaseString;

    image: FirebaseImageSource;
    thumbnail: FirebaseImageSource;

    bio: FirebaseString;
    lingualBio: FirebaseStringMap;
    websiteUrl: FirebaseString;

    tags: FirebaseStringMap;

};

function rawArtistToArtist(rawFields: RawArtist): Artist {
    return {
        name: rawFields.name.stringValue,
        role: rawFields.role.stringValue,
        image: firebaseImageSourceToImageSource(rawFields.image),
        thumbnail: firebaseImageSourceToImageSource(rawFields.thumbnail),
        bio: rawFields.bio.stringValue,
        lingualBio: optionalStringFirebaseMapValueToObject(rawFields.lingualBio),
        websiteUrl: rawFields.websiteUrl.stringValue ?? "",
        tags: optionalStringFirebaseMapValueToObject(rawFields.tags)
    };
}

class Artistsanager {
    #artists: ArtistFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    async #queryArtistsCount(whereFilter: object, fetchFunction = fetch): Promise<number> {
        const countRaw = await queryFirebaseAggregationREST({
            structuredAggregationQuery: {
                aggregations: [
                    {
                        count: {},
                    },
                ],
                structuredQuery: {
                    from: [{ collectionId: "artists" }],
                    where: whereFilter
                },
            },
        }, fetchFunction);
    
        return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
    }

    async #queryArtists(whereFilter: object, orderBy: object[], limit: number, fetchFunction = fetch): Promise<Artist[]> {
        const raw = await queryFirebaseREST<RawArtist>({
            structuredQuery: {
                from: [
                    {
                        collectionId: "artists",
                    },
                ],
                where: whereFilter,
                orderBy,
                limit: limit
            }
        }, fetchFunction);
    
        return raw.map((rawArtist => rawArtistToArtist(rawArtist.document.fields)));
    }

    async updateDiscography(limit: number = 100, fetchFunction = fetch) {
        try {
            if (this.#artists.items.length > limit) {
                return;
            }
            
            const artistsOrderBy = {
                field: {
                    fieldPath: "date",
                },
                direction: "ASCENDING",
            };
            
    
            const upcomingCountPromise = this.#artists.total > -1 ? Promise.resolve(this.#artists.total) : this.#queryArtistsCount({}, fetchFunction);
            const [upcomingCount, upcomingArray] = await Promise.all([
                upcomingCountPromise,
                this.#queryArtists({}, [artistsOrderBy], limit, fetchFunction)
            ]);

            this.#artists = {
                items: upcomingArray,
                total: upcomingCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);
            this.#artists = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get artists() {
        return this.#artists;
    }
}

export const artistsManager = new Artistsanager();