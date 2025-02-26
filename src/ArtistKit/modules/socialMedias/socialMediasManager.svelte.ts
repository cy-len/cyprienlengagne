import { Status } from "../../core/types/fetchTypes";

export interface SocialMediaFetchResult {
    facebook: {
        handle: string;
    };
    instagram: {
        handle: string;
    };
    twitter: {
        handle: string;
    };
    youtube: {
        handle: string;
    };
    status: Status;
}

class SocialMediaManager {
    #socialMedias: SocialMediaFetchResult = $state({
        facebook: {
            handle: ""
        },
        instagram: {
            handle: ""
        },
        twitter: {
            handle: ""
        },
        youtube: {
            handle: ""
        },
        status: Status.PENDING
    });

    async updateSocialMedias(fetchFunction = fetch) {
        try {
            const res = await fetchFunction("https://firestore.googleapis.com/v1/projects/cyprienlengagne-73f1d/databases/(default)/documents/socialMedias/handles");
            const json = await res.json();

            this.#socialMedias = {
                facebook: {
                    handle: json.fields.facebook?.stringValue ?? ""
                },
                instagram: {
                    handle: json.fields.instagram?.stringValue ?? ""
                },
                twitter: {
                    handle: json.fields.twitter?.stringValue ?? ""
                },
                youtube: {
                    handle: json.fields.youtube?.stringValue ?? ""
                },
                status: Status.OK
            };
        } catch (error) {
            this.#socialMedias = {
                facebook: {
                    handle: ""
                },
                instagram: {
                    handle: ""
                },
                twitter: {
                    handle: ""
                },
                youtube: {
                    handle: ""
                },
                status: Status.FAILED
            };
        }
    }

    get socialMedias() {
        return this.#socialMedias;
    }
}

export const socialMediasManager = new SocialMediaManager();