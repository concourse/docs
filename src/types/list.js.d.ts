declare module "list.js" {
    export interface ListItem {
        values(): Record<string, string>;
    }

    export interface ListSortOptions {
        order?: "asc" | "desc";
        sortFunction?: (a: ListItem, b: ListItem) => number;
    }

    export interface ListOptions {
        valueNames: string[];
    }

    export default class List {
        constructor(idOrElement: string | HTMLElement, options: ListOptions);
        sort(valueName: string, options?: ListSortOptions): void;
        items: ListItem[];
    }
}