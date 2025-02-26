import { getContext, setContext } from "svelte";

export interface OpenGraphProps {
    title: string;
    description?: string;
    imageUrl?: string;
}

export function getOpenGraph(): OpenGraphProps {
    return getContext("openGraphProps");
}

export function setOpenGraph(og: OpenGraphProps) {
    setContext("openGraphProps", og);
}