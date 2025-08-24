import { artkytClient } from "../../../../artkyt/artkytClient.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const news = await artkytClient.getNews(params.id, "en", { fetchFunction: fetch });

    return {
        news
    };
};