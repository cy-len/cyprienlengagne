import { concertsManager } from "../../stores/concerts.svelte";
import { newsManager } from "../../stores/news.svelte";
import { bios } from "../../stores/bios.svelte";
import { socialMediasManager } from "../../stores/socialMedias.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url }) => {
    const promises = [
        bios.updateLanguage("fr", fetch),
        socialMediasManager.updateSocialMedias(fetch),
    ];

    // We skip if already asked by the page to avoid race conditions and useless fetches
    if (!url.pathname.includes("/concerts")) {
        promises.push(concertsManager.updateUpcoming(5, fetch));
    }
    if (!url.pathname.includes("/news")) {
        promises.push(newsManager.updateNews(3, fetch));
    }

    await Promise.all(promises);
};
