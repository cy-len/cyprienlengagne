import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { newsManager } from "../../../ArtistKit/modules/news/newsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        newsManager.updateNews(10, fetch),
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiWinnerConcert_ultralowres.jpg"));
    }

    await Promise.all(promises);
};