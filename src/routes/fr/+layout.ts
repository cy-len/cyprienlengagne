import { bios } from "../../ArtistKit/modules/bio/biosManager.svelte";
import { concertsManager } from "../../ArtistKit/modules/concerts/concertsManager.svelte";
import { newsManager } from "../../ArtistKit/modules/news/newsManager.svelte";
import { socialMediasManager } from "../../ArtistKit/modules/socialMedias/socialMediasManager.svelte";
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
