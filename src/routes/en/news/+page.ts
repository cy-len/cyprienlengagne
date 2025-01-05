import { updateNews } from "../../../stores/news";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await updateNews(10, fetch);
};