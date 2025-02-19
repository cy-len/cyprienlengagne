export interface NewsContent {
    title: string;
    content: string;
}

export interface News {
    imageUrl: string;
    fullresXOffset: number;
    fullresYOffset: number;
    thumbnailUrl?: string;
    thumbnailXOffset: number;
    thumbnailYOffset: number;
    imageCopyright: string;
    text: {
        [key: string]: NewsContent;
    }
    date: Date;
}