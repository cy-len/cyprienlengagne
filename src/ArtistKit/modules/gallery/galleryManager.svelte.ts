import { queryCountREST, queryFirebaseREST } from "../../core/rest/firebase";
import { Status, type FetchResult } from "../../core/types/fetchTypes";
import { firebaseImageSourceToImageSource, type FirebaseDate, type FirebaseImageSource, type FirebaseInteger, type FirebaseString } from "../../core/types/firebaseTypes";
import type { ImageSource } from "../../core/types/imageTypes";

export interface GalleryPicture {
    url: string;
    thumbnail: ImageSource;
    copyright: string;
    uploadedDate: Date;
}

export type GalleryFetchResult = FetchResult<GalleryPicture>;
export type FirebaseGalleryPicture = GalleryPicture;

interface RawGalleryPicture {
    url: FirebaseString;
    thumbnail: FirebaseImageSource;

    copyright: FirebaseString;

    uploadedDate: FirebaseDate;
}

function rawGalleryPictureToGalleryPicture(rawPicture: RawGalleryPicture): GalleryPicture {
    return {
        url: rawPicture.url.stringValue,
        thumbnail: firebaseImageSourceToImageSource(rawPicture.thumbnail),
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