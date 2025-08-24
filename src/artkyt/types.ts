export interface Pagination {
    page: number;
    pageSize: number;
}

export type Paginated<T> = T & {
    pagination: Pagination;
};

export interface ArtkytImage {
    originalQualityUrl: string;
    highQualityUrl?: string;
    thumbnailUrl?: string;
    credits: string;
}

export interface ArtkytRecording {
    platform: string;
    url: string;
}

export interface ArtkytProfileLink {
    id: string;
    kind: string;
    value: string;
}

export interface SingleBioPreview {
    name: string;
    content: string;
    selectedLanguage: string;
}

export interface APINewsItem {
    id: string;
    selectedLanguage: string;
    title: string;
    content: string;
    image?: ArtkytImage;
    publishedAt: string;
}

export interface FormattedPerformance {
    id: string;

    startDate: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;

    venueName: string;
    venueAddress?: string;

    cancelled: boolean;
    full: boolean;
}

export interface APIConcertPreview {
    id: string;

    selectedLanguage: string;
    title: string;
    shortDescription: string;
    url: string;

    startDate: Date;
    endDate?: Date;

    venueName?: string;

    program?: object;

    performances: FormattedPerformance[];
}

export interface APIConcert {
    id: string;

    selectedLanguage: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    url: string;

    startDate: Date;
    endDate?: Date;

    venueName?: string;

    program?: object;

    performances: FormattedPerformance[];
}

export type APITaggedParams<T> = T & {
    tags?: { name: string; value?: string }[];
}

export type PerformancesTreatment = "in-concerts" | "as-separate-concerts";
export type APIConcertPreviewsListParams = APITaggedParams<{
    ids?: string[];
    getPerformances?: PerformancesTreatment;
    includeCancelled?: boolean;
    includeFull?: boolean;
    fromDate?: Date;
    toDate?: Date;
    sort?: "startDateAsc" | "startDateDesc";
}>;

function thisMorning() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

export function upcomingConcertsFilter(): APIConcertPreviewsListParams {
    return {
        fromDate: thisMorning(),
        sort: "startDateAsc"
    }
}

export function pastConcertsFilter(): APIConcertPreviewsListParams {
    return {
        toDate: thisMorning(),
        sort: "startDateDesc"
    }
}

export interface APIGallery {
    id: string;
    selectedLanguage: string;
    title: string;
    description: string;
    images: ArtkytImage[];
}

export interface APIRecording {
    id: string;
    selectedLanguage: string;
    title: string;
    description: string;
    platform: string;
    url: string;
    externalId?: string;
}

export interface APIComposition {
    id: string;
    selectedLanguage: string;

    title: string;
    description: string;

    compositionYear: number;
    duration: string;
    instrumentation: string;
    category: string,
    publisher: string,
    buySheetUrl: string;

    hasBeenPremiered: boolean;
    premiereDate?: string,
    premiereLocation?: string,
    premierePerformers?: string,

    coverImage?: ArtkytImage;

    recordings: ArtkytRecording[];
}

export interface APIPostContactMessageBody {
    fromName?: string;
    fromEmail?: string;
    fromPhone?: string;
    subject?: string;
    content: string;
}

export interface APISubscribeToNewsletterBody {
    subscriberName?: string;
    subscriberEmail?: string;
    subscriberPhone?: string;
    subscriberAddress?: string;
}