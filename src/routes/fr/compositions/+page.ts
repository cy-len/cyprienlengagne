import { updateCompositions } from "../../../stores/compositions";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([updateCompositions(100, fetch)]);
};