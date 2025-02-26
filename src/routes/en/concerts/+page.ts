import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { concertsManager } from "../../../ArtistKit/modules/concerts/concertsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        concertsManager.updateUpcoming(200, fetch),
        concertsManager.updatePast(10, fetch)
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiSecondRound_ultralowres.webp"));
    }

    await Promise.all(promises);
};