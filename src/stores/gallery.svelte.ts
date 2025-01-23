import { queryCountREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import { Status, type FetchResult } from "../types/status";

export interface GalleryPicture {
    url: string;
    thumbnailUrl: string;
    copyright: string;
    uploadedDate: Date;
}

export type GalleryFetchResult = FetchResult<GalleryPicture>;

interface RawGalleryPicture {
    url: {
        stringValue: string;
    }
    thumbnailUrl: {
        stringValue: string;
    }
    copyright: {
        stringValue: string;
    }
    uploadedDate: {
        timestampValue: string;
    }
}

function rawGalleryPictureToGalleryPicture(rawPicture: RawGalleryPicture): GalleryPicture {
    console.log(rawPicture);
    return {
        url: rawPicture.url.stringValue,
        thumbnailUrl: rawPicture.thumbnailUrl?.stringValue ?? rawPicture.url.stringValue,
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
    
        return raw.map((rawNews => rawGalleryPictureToGalleryPicture(rawNews.document.fields)));
    }
    
    async updateGallery(limit: number = 20, fetchFunction = fetch) {
        try {
            if (this.#gallery.items.length > limit && this.#gallery.total < limit) {
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