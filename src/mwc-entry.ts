import "@material/web/all.js";

import { BehaviorSubject, Observable, Subject, switchMap } from "rxjs";
import { getValueFromSessionStoragePartialMatch } from "./helpers";
import { homePageLogic } from "./home-page";
import { resourceTypesLogic } from "./search/resource-types";
import { availableResourceIconsLogic } from "./search/available-resource-icons";
import { Component } from "./types/component";

interface Window {
    document$: Subject<Document>;
    component$: Observable<Component>;
}

declare const document$: Window["document$"];
declare const component$: Window["component$"];

const refresh: BehaviorSubject<string> = new BehaviorSubject<string>("");

if (document$) {
    document$.subscribe(resourceTypesLogic);
    document$.subscribe(availableResourceIconsLogic);

    refresh.pipe(switchMap(() => document$)).subscribe((value: Document) => {
        const gitInformation: GitInfo | null =
            getValueFromSessionStoragePartialMatch<GitInfo>("__source");

        homePageLogic(value, gitInformation);
    });
}

if (component$) {
    component$.subscribe(() => {
        refresh.next("");
    });
}