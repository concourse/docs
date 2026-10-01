import List from "list.js";

const RESOURCE_TYPES_TABLE_ID = "resource-types-table";

export function resourceTypesLogic(document: Document): void {
    const container = document.getElementById(RESOURCE_TYPES_TABLE_ID);
    if (!container) {
        return;
    }

    const resourceList = new List(RESOURCE_TYPES_TABLE_ID, {
        valueNames: [ 'name', 'description' ]
    });
}