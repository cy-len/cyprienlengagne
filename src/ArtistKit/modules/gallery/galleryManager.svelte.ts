import { queryCountREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import type { FirebaseDate, FirebaseInteger, FirebaseString } from "../../core/types/firebaseTypes";

export interface GalleryPicture {
    url: string;
    thumbnailUrl: string;
    thumbnailOffset: {
        x: number;
        y: number;
    };
    copyright: string;
    uploadedDate: Date;
}

export type GalleryFetchResult = FetchResult<GalleryPicture>;

interface RawGalleryPicture {
    url: FirebaseString;

    thumbnailUrl: FirebaseString;
    thumbnailXOffset?: FirebaseInteger;
    thumbnailYOffset?: FirebaseInteger;

    copyright: FirebaseString;

    uploadedDate: FirebaseDate;
}

function rawGalleryPictureToGalleryPicture(rawPicture: RawGalleryPicture): GalleryPicture {
    return {
        url: rawPicture.url.stringValue,
        thumbnailUrl: rawPicture.thumbnailUrl?.stringValue ?? rawPicture.url.stringValue,
        thumbnailOffset: {
            x: rawPicture.thumbnailXOffset?.integerValue ?? 0,
            y: rawPicture.thumbnailYOffset?.integerValue ?? 0
        },
        copyright: rawPicture.copyright.stringValue,
        uploadedDate: new Date(rawPicture.uploadedDate.timestampValue),
    };
}

class GalleryManager {
    #gallery: GalleryFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    #queryGalleryPicturesCount = async (fetchFunction = fetch) => queryCountREST("gallery", fetchFunction);

    async #queryGalleryPictures(limit: number, fetchFunction = fetch): Promise<GalleryPicture[]> {
        const raw = await queryFirebaseREST<RawGalleryPicture>({
            structuredQuery: {
                from: [
                    {
                        collectionId: "gallery",
                    },
                ],
                orderBy: [
                    {
                        field: {
                            fieldPath: "uploadedDate",
                        },
                        direction: "DESCENDING",
                    },
                ],
                limit: limit
            }
        }, fetchFunction);
    
        return raw.map((rawGalleryPicture => rawGalleryPictureToGalleryPicture(rawGalleryPicture.document.fields)));
    }
    
    async updateGallery(limit: number = 20, fetchFunction = fetch) {
        try {
            if (this.#gallery.items.length > limit) {
                return;
            }
            
            const countPromise = this.#gallery.total > -1 ? Promise.resolve(this.#gallery.total) : this.#queryGalleryPicturesCount(fetchFunction);
            const [galleryPicturesCount, galleryPicturesArray] = await Promise.all([countPromise, this.#queryGalleryPictures(limit, fetchFunction)]);

            this.#gallery = {
                items: galleryPicturesArray,
                total: galleryPicturesCount,
                status: Status.OK
            };
        } catch (error) {
            console.log(error);

            this.#gallery = {
                items: [],
                total: -1,
                status: Status.FAILED
            };
        }
    }

    get gallery() {
        return this.#gallery;
    }
}


export const galleryManager = new GalleryManager();