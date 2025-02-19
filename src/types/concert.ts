export interface Concert {
    location: string;
    locationPrecise: string;
    description: string;
    lingualDescriptions: { [key: string]: string };
    timeEnabled: boolean;
    date: Date;
    endDate?: Date;
    url?: string;
    image?: {
        url: string;
        xOffset: number;
        yOffset: number;
    };
    thumbnail?: {
        url: string;
        xOffset: number;
        yOffset: number;
    }
    tags: { [key: string]: string };
}