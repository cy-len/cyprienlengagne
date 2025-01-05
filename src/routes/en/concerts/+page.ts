import { updatePastConcerts, updateUpcomingConcerts } from "../../../stores/concerts";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    await Promise.all([updateUpcomingConcerts(200, fetch), updatePastConcerts(10, fetch)]);
};