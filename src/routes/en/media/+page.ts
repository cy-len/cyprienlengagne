import { galleryManager } from "../../../stores/gallery.svelte";
import { videosManager } from "../../../stores/videos.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([
        galleryManager.updateGallery(1000, fetch),
        videosManager.updateVideos(1000, fetch)
    ]);
};