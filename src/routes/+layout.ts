import { artkytClient } from "../artkyt/artkytClient.svelte";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url }) => {
    const promises = [
        artkytClient.getProfileLinks(undefined, { pageSize: 100 }, { fetchFunction: fetch })
    ];

    const [ links ] = await Promise.all(promises);

    return {
        links: links.success ? links.value.links : []
    };
};
