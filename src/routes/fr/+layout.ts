import { updateUpcomingConcerts } from "../../stores/concerts";
import { updateNews } from "../../stores/news";
import { updateBio } from "../../stores/bios";
import { updateSocialMedias } from "../../stores/socialMedias";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
    await Promise.all([
        updateBio("fr", fetch),
        updateUpcomingConcerts(5, fetch),
        updateSocialMedias(fetch),
        updateNews(3, fetch)
    ]);
};
