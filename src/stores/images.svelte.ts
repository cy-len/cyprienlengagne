import { loadImageAsync } from "../utils/imgUtils";

class ImagesManager {
    #imageMap = new Map<string, boolean>();

    isLoaded(url: string): boolean {
        return !!this.#imageMap.get(url);
    }

    async loadImage(url: string): Promise<boolean> {
        if (this.isLoaded(url)) {
            return false;
        }

        await loadImageAsync(url);
        this.#imageMap.set(url, true);

        return true;
    }
}

export const imageManager = new ImagesManager();