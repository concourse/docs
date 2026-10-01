const RESOURCE_TYPES_TABLE_ID = "resource-types-table";
const initializedTables = new WeakSet<HTMLElement>();

export function resourceTypesLogic(document: Document): void {
    const container = document.getElementById(RESOURCE_TYPES_TABLE_ID);
    if (!container || initializedTables.has(container)) {
        return;
    }

    const input = container.querySelector<HTMLInputElement>("input.search");
    if (!input) {
        return;
    }

    // Cache visible text once, excluding links' URLs and the pipeline examples.
    const rows = Array.from(
        container.querySelectorAll<HTMLTableRowElement>("tbody tr"),
        (row) => ({
            row,
            fields: [".name", ".description"].map((selector) =>
                (row.querySelector(selector)?.textContent ?? "")
                    .toLowerCase()
                    .replace(/\s+/g, " ")
                    .trim(),
            ),
        }),
    );

    const filter = (): void => {
        // Match every word or quoted phrase in either searchable column.
        const terms = Array.from(
            input.value.toLowerCase().matchAll(/"([^"]+)"|(\S+)/g),
            (match) => (match[1] ?? match[2]).replace(/\s+/g, " "),
        );

        for (const { row, fields } of rows) {
            const hidden = !terms.every((term) =>
                fields.some((field) => field.includes(term)),
            );
            if (row.hidden !== hidden) {
                row.hidden = hidden;
            }
        }
    };

    initializedTables.add(container);
    input.addEventListener("input", filter);
    filter();
}
