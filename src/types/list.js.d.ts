/* This is copied and enhanced from @types/list.js */
declare class List {
  listContainer: HTMLElement;
  list: HTMLElement;
  items: List.ListItem[];
  visibleItems: List.ListItem[];
  matchingItems: List.ListItem[];
  searched: boolean;
  filtered: boolean;
  alphabet: string;
  
  constructor(
    element: string | HTMLElement,
    options?: List.ListOptions,
    values?: object[],
  );

  add(values: object[], callback?: List.Callback<List.ListItem, void>): void;
  remove(valueName: string, value: any): number;
  get(valueName: string, value: any): List.ListItem[];
  sort(valueName: string, options: List.SortOptions): void;
  search(searchString: string, columns?: string[]): void;
  clear(): void;
  filter(filterFunction?: List.Callback<List.ListItem, boolean>): void;
  size(): number;
  show(i: number, page: number): void;
  update(): void;
  reIndex(): void;
  fuzzySearch(searchString: string, columns?: string[]): void;
  on(event: List.Event, callback: List.ListEventCallback): List;
}

declare namespace List {
  interface ListItem {
    elm: HTMLElement;

    values(newValues: object): void;
    values(): object;
    show(): void;
    hide(): void;
    matching(): boolean;
    visible(): boolean;
  }

  interface ListOptions {
    valueNames?:
      | Array<string | { data: string[] } | { name: string; attr: string }>
      | undefined;
    item?: string | undefined;
    listClass?: string | undefined;
    searchClass?: string | undefined;
    sortClass?: string | undefined;
    indexAsync?: boolean | undefined;
    page?: number | undefined;
    i?: number | undefined;
    pagination?:
      | {
          paginationClass?: string | undefined;
          innerWindow?: number | undefined;
          outerWindow?: number | undefined;
          left?: number | undefined;
          right?: number | undefined;
          item?: string | undefined;
        }
      | undefined;
    fuzzySearch?: FuzzySearchOptions | undefined;
  }

  interface FuzzySearchOptions {
    searchClass?: string | undefined;
    location?: number | undefined;
    distance?: number | undefined;
    threshold?: number | undefined;
    multiSearch?: boolean | undefined;
  }

  interface SortOptions {
    order?: string | undefined;
    alphabet?: string | undefined;
    insensitive?: boolean | undefined;
    sortFunction?: ((a: object, b: object) => number | undefined) | undefined;
  }

  type Callback<T, R> = (t: T) => R;
  type ListEventCallback = Callback<List, void>;

  const EventTypes = [
    "updated",
    "parseComplete",
    "filterStart",
    "filterComplete",
    "searchStart",
    "searchComplete",
    "sortStart",
    "sortComplete",
  ] as const;
  
  type Event = (typeof EventTypes)[number];
}

export = List;
declare module "list.js";
