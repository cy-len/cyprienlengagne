import { queryCountREST, queryFirebaseREST } from "../firebase/firebaseUtils";
import { Status, type FetchResult } from "../types/status";

export interface Video {
    youtubeHandle: string;
    title: string;
    addedDate: Date;
}

export type VideosFetchResult = FetchResult<Video>;

interface RawVideo {
    youtubeHandle: {
        stringValue: string;
    }
    title: {
        stringValue: string;
    }
    addedDate: {
        timestampValue: string;
    }
}

function rawVideoToVideo(rawPicture: RawVideo): Video {
    return {
        youtubeHandle: rawPicture.youtubeHandle.stringValue,
        title: rawPicture.title.stringValue,
        addedDate: new Date(rawPicture.addedDate.timestampValue),
    };
}

class VideosManager {
    #videos: VideosFetchResult = $state({
        items: [],
        total: -1,
        status: Status.PENDING
    });

    #queryVideosCount = async (fetchFunction = fetch) => queryCountREST("videos", fetchFunction);

    async #queryVideos(limit: number, fetchFunction = fetch): Promise<Video[]> {
            const raw = await queryFirebaseREST<RawVideo>({
                structuredQuery: {
                    from: [
                        {
                            collectionId: "videos",
                        },
                    ],
                    orderBy: [
                        {
                            field: {
                                fieldPath: "addedDate",
                            },
                            direction: "DESCENDING",
                        },
                    ],
                    limit: limit
                }
            }, fetchFunction);
        
            return raw.map((rawNews => rawVideoToVideo(rawNews.document.fields)));
        }
        
        async updateVideos(limit: number = 20, fetchFunction = fetch) {
            try {
                if (this.#videos.items.length > limit) {
                    return;
                }
                
                const countPromise = this.#videos.total > -1 ? Promise.resolve(this.#videos.total) : this.#queryVideosCount(fetchFunction);
                const [videosCount, videosArray] = await Promise.all([countPromise, this.#queryVideos(limit, fetchFunction)]);
    
                this.#videos = {
                    items: videosArray,
                    total: videosCount,
                    status: Status.OK
                };
            } catch (error) {
                console.log(error);
    
                this.#videos = {
                    items: [],
                    total: -1,
                    status: Status.FAILED
                };
            }
        }
    
        get videos() {
            return this.#videos;
        }
}

export const videosManager = new VideosManager();