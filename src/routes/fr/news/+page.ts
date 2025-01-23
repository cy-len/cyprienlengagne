import { newsManager } from "../../../stores/news.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await newsManager.updateNews(10, fetch);
};