import { PUBLIC_ARTKYT_SHORT_BIO_ID } from "$env/static/public";
import { artkytClient } from "../../artkyt/artkytClient.svelte";
import { upcomingConcertsFilter } from "../../artkyt/types";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url }) => {
    const promises = [
        artkytClient.getBio(PUBLIC_ARTKYT_SHORT_BIO_ID, "fr", { fetchFunction: fetch }),
        artkytClient.getNewsList("fr", { pageSize: 3 }, { fetchFunction: fetch }),
        artkytClient.getConcertsList("fr", upcomingConcertsFilter(), { pageSize: 5 }, { fetchFunction: fetch }),
    ];

    const [ shortBio, topNews, topConcerts ] = await Promise.all(promises);

    return {
        shortBio,
        topNews,
        topConcerts
    }
};
