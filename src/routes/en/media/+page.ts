
import { browser } from "$app/environment";
import { PUBLIC_ARTKYT_GALLERY_ID } from "$env/static/public";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { artkytClient } from "../../../artkyt/artkytClient.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        artkytClient.getGallery(PUBLIC_ARTKYT_GALLERY_ID, "en", {
            fetchFunction: fetch
        }),
        artkytClient.getRecordingsList("en", { pageSize: 100 }, { fetchFunction: fetch })
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/JarousskyPapillons_ultralowres.jpg"));
    }

    const [ gallery, recordings ] = await Promise.all(promises);

    return {
        gallery, recordings
    }
};