import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { artkytClient } from "../../../artkyt/artkytClient.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        artkytClient.getNewsList("en", { pageSize: 10 }, { fetchFunction: fetch })
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiWinnerConcert_ultralowres.jpg"));
    }

    const [ news ] = await Promise.all(promises);

    return {
        news
    };
};