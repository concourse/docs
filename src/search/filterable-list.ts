export interface FilterableListOptions<T extends HTMLElement> {
    /** ID of the element wrapping the `input.search` and the items. */
    containerId: string;
    /** Selector, relative to the container, for the elements to show/hide. */
    itemSelector: string;
    /** Searchable strings of one item; a term matches if any field has it. */
    getFields: (item: T) => string[];
    /**
     * Applied to every field and every query term before comparing. Terms that
     * normalize to "" are ignored.
     */
    normalize?: (value: string) => string;
}

export interface FilterableList {
    container: HTMLElement;
    input: HTMLInputElement;
}

const initializedContainers = new WeakSet<HTMLElement>();

export const collapseWhitespace = (value: string): string =>
    value.toLowerCase().replace(/\s+/g, " ").trim();

/**
 * Wires a search box to a list of items and hides the ones that don't match
 * every term of the query (a term is a word or a "quoted phrase").
 *
 * Returns the container and input on first initialization, or null when the
 * markup is missing or the container was already initialized. This makes it
 * safe to call on every `document$` emission.
 */
export function initFilterableList<T extends HTMLElement = HTMLElement>(
    document: Document,
    {
        containerId,
        itemSelector,
        getFields,
        normalize = collapseWhitespace,
    }: FilterableListOptions<T>,
): FilterableList | null {
    const container = document.getElementById(containerId);
    if (!container || initializedContainers.has(container)) {
        return null;
    }

    const input = container.querySelector<HTMLInputElement>("input.search");
    if (!input) {
        return null;
    }

    // Normalize the searchable text once instead of on every keystroke.
    const items = Array.from(
        container.querySelectorAll<T>(itemSelector),
        (item) => ({ item, fields: getFields(item).map(normalize) }),
    );

    const filter = (): void => {
        const terms = Array.from(
            input.value.matchAll(/"([^"]+)"|(\S+)/g),
            (match) => normalize(match[1] ?? match[2]),
        ).filter((term) => term.length > 0);

        for (const { item, fields } of items) {
            const hidden = !terms.every((term) =>
                fields.some((field) => field.includes(term)),
            );
            if (item.hidden !== hidden) {
                item.hidden = hidden;
            }
        }
    };

    initializedContainers.add(container);
    input.addEventListener("input", filter);
    filter();

    return { container, input };
}