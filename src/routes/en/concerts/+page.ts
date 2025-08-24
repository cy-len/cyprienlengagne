import { browser } from "$app/environment";
import { imageManager } from "../../../ArtistKit/core/components/images/imagesManager.svelte";
import { artkytClient } from "../../../artkyt/artkytClient.svelte";
import { pastConcertsFilter, upcomingConcertsFilter } from "../../../artkyt/types";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const promises: Promise<any>[] = [
        artkytClient.getConcertsList(
            "en",
            upcomingConcertsFilter(),
            {
                pageSize: 30
            },
            {
                fetchFunction: fetch
            }
        ),
        artkytClient.getConcertsList(
            "en",
            pastConcertsFilter(),
            {
                pageSize: 10
            },
            {
                fetchFunction: fetch
            }
        ),
    ];

    if (browser) {
        promises.push(imageManager.loadImage("/imgs/PendereckiSecondRound_ultralowres.webp"));
    }

    const [upcoming, past] = await Promise.all(promises);

    return {
        upcoming,
        past
    }
};