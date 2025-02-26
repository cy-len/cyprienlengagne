export function capitalize(str: string): string {
    return `${str.at(0)?.toUpperCase()}${str.slice(1)}`;
}

export function removeUrlParamAtEnd(url: string) {
    const questionMarkPosition = url.indexOf("?");
    if (questionMarkPosition >= 0) {
        return url.slice(0, questionMarkPosition);
    }

    return url;
}

export function extractSpotifyHandle(url: string): string {
    const trackPosition = url.indexOf("track");
    if (trackPosition >= 0) {
        const track = url.slice(trackPosition);
        return removeUrlParamAtEnd(track);
    }
    
    const albumPosition = url.indexOf("album");
    if (albumPosition >= 0) {
        const album = url.slice(albumPosition);
        return removeUrlParamAtEnd(album);
    }
    
    const playlistPosition = url.indexOf("playlist");
    if (playlistPosition >= 0) {
        const playlist = url.slice(playlistPosition);
        return removeUrlParamAtEnd(playlist);
    }

    return url;
}

export function extractYouTubeHandle(url: string): string {
    return url.replace("http://", "").replace("https://", "").replace("youtu.be/", "").replace("m.youtube.com/watch?v=", "").replace("www.youtube.com/watch?v=", "").replace("youtube.com/watch?v=", "");
}

export function limit(str: string, maxChars = 20) {
    return str.length > maxChars ? `${str.slice(0, maxChars)}...` : str;
}

export function urlHost(path: string): string {
    const url = new URL(path);
    return url.hostname;
}