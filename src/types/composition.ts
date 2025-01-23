export interface Composition {
    name: string;
    compositionDate: Date;
    duration: string;
    category: string;
    instrumentation: string;
    premiered: boolean;
    premiereDate: Date;
    premiereLocation: string;
    premierePerformers: string;
    description: string;
    lingualDescriptions: { [key: string]: string };
    recordingVideo: string;
}