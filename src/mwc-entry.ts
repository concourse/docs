import "@material/web/all.js";

import { BehaviorSubject, Observable, Subject, switchMap } from "rxjs";
import { getValueFromSessionStoragePartialMatch } from "./helpers";
import { homePageLogic } from "./home-page";
import { Component } from "./types/component";
import { iconLogic } from "./icon-search";
import { loadResourceTypeSearch } from "./resource-types-list";

interface Window {
  document$: Subject<Document>;
  component$: Observable<Component>;
}

declare const document$: Window["document$"];
declare const component$: Window["component$"];

const refresh: BehaviorSubject<string> = new BehaviorSubject<string>("");

if (document$) {
  refresh.pipe(switchMap(() => document$)).subscribe((value: Document) => {
    const gitInformation: GitInfo | null =
      getValueFromSessionStoragePartialMatch<GitInfo>("__source");

    homePageLogic(value, gitInformation);
  });
  iconLogic(); // ⬅️ NEW: This is to ensure the disconnected search box works
  loadResourceTypeSearch(); // ⬅️ NEW: Pull the resource type search code out of the page and into the main bundle
}

if (component$) {
  // On Component change (e.g. Cookie Selection), push a new version triggering
  // the document to update the DOM
  component$.subscribe(() => {
    refresh.next("");
  });
}
