import { getContext, setContext } from "svelte";

export interface OpenGraphProps {
    title: string;
    description?: string;
    imageUrl?: string;
}

class OpenGraphManager {
    #openGraph = $state<OpenGraphProps>({
        title: ""
    });

    constructor(defaultOg: OpenGraphProps) {
        this.setOpenGraphProps(defaultOg);
    }

    setOpenGraphProps(og: OpenGraphProps) {
        this.#openGraph = og;
    }

    get openGraphProps() {
        return this.#openGraph;
    }
}

const contextKey = "openGraphManager";

export function initOpenGraph(defaultOg: OpenGraphProps): OpenGraphManager {
    const manager = new OpenGraphManager(defaultOg);
    setContext(contextKey, manager);

    return manager;
}

export function setOpenGraph(og: OpenGraphProps) {
    const manager = getContext<OpenGraphManager>(contextKey);
    if (!manager) return;

    manager.setOpenGraphProps(og);
}