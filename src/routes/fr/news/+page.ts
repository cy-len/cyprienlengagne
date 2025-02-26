import { newsManager } from "../../../ArtistKit/modules/news/newsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await newsManager.updateNews(10, fetch);
};