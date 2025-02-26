
import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    const promises: Promise<any>[] = [];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/Valere_Back_ultralowres.jpg"));
    }

    await Promise.all(promises);
};