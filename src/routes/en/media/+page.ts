import { updateGallery } from "../../../stores/gallery";
import { updateVideos } from "../../../stores/videos";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([
        updateGallery(fetch),
        updateVideos(fetch)
    ]);
};