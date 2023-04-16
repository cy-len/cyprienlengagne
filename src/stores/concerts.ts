import type { Concert } from "../types/concert";
import { Status } from "../types/status";
import { writable } from "svelte/store";

export interface ConcertFetchResult {
    upcoming: Concert[];
    past: Concert[];
    status: Status;
}

export const concerts = writable<ConcertFetchResult>({
    upcoming: [],
    past: [],
    status: Status.PENDING
});

interface RawConcert {
    name: string;
    fields: {
        date: {
            timestampValue: string;
        },
        endDate?: {
            timestampValue: string;
        },
        location: {
            stringValue: string;
        },
        description: {
            stringValue: string;
        },
        url?: {
            stringValue: string;
        }
    }
}

export async function updateConcerts() {
    try {
        const res = await fetch("https://firestore.googleapis.com/v1/projects/cyprienlengagne-73f1d/databases/(default)/documents/concerts?pageSize=100");
        const json = await res.json();

        const upcoming: Concert[] = [];
        const past: Concert[] = [];
        
        json.documents.forEach((rawConcert: RawConcert) => {
            const concert: Concert = {
                location: rawConcert.fields.location.stringValue,
                description: rawConcert.fields.description.stringValue,
                date: new Date(rawConcert.fields.date.timestampValue),
                url: rawConcert.fields.url?.stringValue ?? ""
            };

            if (concert.date.getTime() < Date.now()) {
                past.push(concert);
            } else {
                upcoming.push(concert);
            }
        });

        upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
        past.sort((a, b) => b.date.getTime() - a.date.getTime());
    
        concerts.set({
            upcoming,
            past,
            status: Status.OK
        });
    } catch (error) {
        concerts.set({
            upcoming: [],
            past: [],
            status: Status.FAILED
        });
    }
}