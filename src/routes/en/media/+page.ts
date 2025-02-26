
import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { galleryManager } from "../../../ArtistKit/modules/gallery/galleryManager.svelte";
import { videosManager } from "../../../ArtistKit/modules/videos/videosManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        galleryManager.updateGallery(1000, fetch),
        videosManager.updateVideos(1000, fetch)
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/JarousskyPapillons_ultralowres.jpg"));
    }

    await Promise.all(promises);
};