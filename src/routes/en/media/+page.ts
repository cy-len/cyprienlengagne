
import { galleryManager } from "../../../ArtistKit/modules/gallery/galleryManager.svelte";
import { videosManager } from "../../../ArtistKit/modules/videos/videosManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([
        galleryManager.updateGallery(1000, fetch),
        videosManager.updateVideos(1000, fetch)
    ]);
};