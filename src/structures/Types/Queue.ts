import type { Track, UnresolvedTrack } from "./Track";
import type { Awaitable } from "./Utils";

export interface StoredQueue {
    current: Track | null;
    previous: Track[];
    tracks: (Track | UnresolvedTrack)[];
}

export interface QueueStoreManager {
    /** @async get a Value (MUST RETURN UNPARSED!) */
    get: (guildId: string) => Awaitable<StoredQueue | string | undefined>;
    /** @async Set a value inside a guildId (MUST BE UNPARSED) */
    set: (guildId: string, value: StoredQueue | string) => Awaitable<void | boolean>;
    /** @async Delete a Database Value based of it's guildId */
    delete: (guildId: string) => Awaitable<void | boolean>;
    /** @async Transform the value(s) inside of the QueueStoreManager (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
    stringify: (value: StoredQueue | string) => Awaitable<StoredQueue | string>;
    /** @async Parse the saved value back to the Queue (IF YOU DON'T NEED PARSING/STRINGIFY, then just return the value) */
    parse: (value: StoredQueue | string) => Awaitable<Partial<StoredQueue>>;
}

export interface ManagerQueueOptions {
    /** Maximum Amount of tracks for the queue.previous array. Set to 0 to not save previous songs. Defaults to 25 Tracks */
    maxPreviousTracks?: number;
    /** Custom Queue Store option */
    queueStore?: QueueStoreManager;
    /** Custom Queue Watcher class */
    queueChangesWatcher?: QueueChangesWatcher;
}

export interface QueueChangesWatcher {
    /** get a Value (MUST RETURN UNPARSED!) */
    tracksAdd: (guildId: string, tracks: (Track | UnresolvedTrack)[], position: number, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => void;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    tracksRemoved: (guildId: string, tracks: (Track | UnresolvedTrack)[], position: number | number[], oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => void;
    /** Set a value inside a guildId (MUST BE UNPARSED) */
    shuffled: (guildId: string, oldStoredQueue: StoredQueue, newStoredQueue: StoredQueue) => void;
}

/**
 * Sort keys for queue tracks
 */
export type SortKey = "duration" | "title" | "author";

/**
 * Sort order for sorting operations
 */
export type SortOrder = "asc" | "desc";

/**
 * Filter options for searching tracks in the queue
 */
export interface FilterOptions {
    /** Filter by track title (exact match) */
    title?: string;
    /** Filter by track author (exact match) */
    author?: string;
    /** Filter by whether the track is a stream */
    isStream?: boolean;
    /** Filter by track duration range */
    duration?: {
        /** Minimum duration in milliseconds */
        min?: number;
        /** Maximum duration in milliseconds */
        max?: number;
    };
    /** Custom filter function for advanced filtering */
    custom?: (track: Track | UnresolvedTrack) => boolean;
}
