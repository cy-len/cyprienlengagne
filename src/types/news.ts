export interface NewsContent {
    title: string;
    content: string;
}

export interface News {
    imageUrl: string;
    thumbnailUrl?: string;
    imageCopyright: string;
    text: {
        [key: string]: NewsContent;
    }
    date: Date;
}