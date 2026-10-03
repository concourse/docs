import { initFilterableList } from "./filterable-list";

const COPIED_CLASS = "copied";
const COPIED_DURATION_MS = 2000;

const copiedTimers = new WeakMap<HTMLElement, number>();

const toSearchKey = (value: string): string =>
    value.replace(/\W/g, "").toLowerCase();

const copyName = (name: string, card: HTMLElement): void => {
    if (!navigator.clipboard) {
        // Only available in secure contexts (HTTPS / localhost).
        console.error(`failed to copy ${name}: clipboard API unavailable`);
        return;
    }

    navigator.clipboard
        .writeText(name)
        .then(() => {
            window.clearTimeout(copiedTimers.get(card));
            card.classList.add(COPIED_CLASS);
            copiedTimers.set(
                card,
                window.setTimeout(
                    () => card.classList.remove(COPIED_CLASS),
                    COPIED_DURATION_MS,
                ),
            );
        })
        .catch((err: unknown) => {
            console.error(`failed to copy ${name} to the clipboard: ${err}`);
        });
};

export function availableResourceIconsLogic(document: Document): void {
    const list = initFilterableList(document, {
        containerId: "icon-list",
        itemSelector: ".card[data-search]",
        getFields: (card) => [card.dataset.search ?? ""],
        normalize: toSearchKey,
    });
    if (!list) {
        return;
    }

    const { container } = list;

    // One delegated listener instead of one per card.
    container.addEventListener("click", (event) => {
        const card = (event.target as Element | null)?.closest<HTMLElement>(
            ".card[data-title]",
        );
        const name = card?.dataset.title;
        if (card && name && container.contains(card)) {
            copyName(name, card);
        }
    });

    container.classList.remove("notready");
}