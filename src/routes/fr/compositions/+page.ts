import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { compositionsManager } from "../../../ArtistKit/modules/compositions/compositionsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        compositionsManager.updateCompositions(500, fetch)
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiResults_ultralowres.jpg"));
    }

    await Promise.all(promises);
};