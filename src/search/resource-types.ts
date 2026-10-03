import { initFilterableList } from "./filterable-list";

export function resourceTypesLogic(document: Document): void {
    initFilterableList<HTMLTableRowElement>(document, {
        containerId: "resource-types-table",
        itemSelector: "tbody tr",
        // Only the visible text of these columns: no link URLs, no pipeline examples.
        getFields: (row) =>
            [".name", ".description"].map(
                (selector) => row.querySelector(selector)?.textContent ?? "",
            ),
    });
}