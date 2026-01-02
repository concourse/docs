export type Component<
  T extends {} = {},
  U extends HTMLElement = HTMLElement,
> = T & {
  ref: U; /* Component reference */
};
