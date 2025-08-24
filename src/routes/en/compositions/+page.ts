import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { artkytClient } from "../../../artkyt/artkytClient.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        artkytClient.getCompositionsList(
            "en",
            {
                pageSize: 1000
            },
            {
                fetchFunction: fetch
            }
        )
    ];
    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiResults_ultralowres.jpg"));
    }

    const [ compositions ] = await Promise.all(promises);


    return {
        compositions
    };
};