export function groupBy<T>(list: T[], callback: (item: T) => string): { [key: string]: T[] } {
    const obj: { [key: string]: T[] } = {};

    for (const item of list) {
        const key = callback(item);

        if (obj[key]) {
            obj[key].push(item);
        } else {
            obj[key] = [item];
        }
    }

    return obj;
}