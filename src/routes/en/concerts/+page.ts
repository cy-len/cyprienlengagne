import { concertsManager } from "../../../ArtistKit/modules/concerts/concertsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([
        concertsManager.updateUpcoming(200, fetch),
        concertsManager.updatePast(10, fetch)
    ]);
};