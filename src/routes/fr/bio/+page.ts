
import { browser } from "$app/environment";
import { PUBLIC_ARTKYT_BIO_ID } from "$env/static/public";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { artkytClient } from "../../../artkyt/artkytClient.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        artkytClient.getBio(PUBLIC_ARTKYT_BIO_ID, "fr", {
            fetchFunction: fetch
        })
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/Valere_Back_ultralowres.jpg"));
    }

    const [bio] = await Promise.all(promises);

    return {
        bio
    };
};