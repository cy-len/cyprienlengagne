export interface Concert {
    location: string;
    locationPrecise: string;
    description: string;
    lingualDescriptions: { [key: string]: string };
    timeEnabled: boolean;
    date: Date;
    endDate?: Date;
    url?: string;
}