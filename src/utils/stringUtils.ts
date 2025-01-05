export function capitalize(str: string): string {
    return `${str.at(0)?.toUpperCase()}${str.slice(1)}`;
}

export function extractYouTubeHandle(url: string): string {
    return url.replace("http://", "").replace("https://", "").replace("youtu.be/", "").replace("m.youtube.com/watch?v=", "").replace("youtube.com/watch?v=", "");
}