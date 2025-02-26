import { compositionsManager } from "../../../ArtistKit/modules/compositions/compositionsManager.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([compositionsManager.updateCompositions(500, fetch)]);
};