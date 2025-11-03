/**
 * Declaration for the document$ global exposed by MkDocs Material.
 * It's an Observable (or similar pattern) that emits on every page change/load.
 * We define it on the global Window object.
 */
interface Window {
    document$?: {
        subscribe: (callback: () => void) => void;
    };
}

// If you access document$ directly as a global (without window.),
// you can also declare it like this:
declare const document$: Window['document$'];