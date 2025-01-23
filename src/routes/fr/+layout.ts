import { concertsManager } from "../../stores/concerts.svelte";
import { newsManager } from "../../stores/news.svelte";
import { bios } from "../../stores/bios.svelte";
import { socialMediasManager } from "../../stores/socialMedias.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
    await Promise.all([
        bios.updateLanguage("fr", fetch),
        concertsManager.updateUpcoming(5, fetch),
        socialMediasManager.updateSocialMedias(fetch),
        newsManager.updateNews(3, fetch)
    ]);
};
