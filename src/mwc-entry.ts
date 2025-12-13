import "@material/web/all.js";

import { Subject } from "rxjs";
import { getValueFromSessionStoragePartialMatch } from "./helpers";
import { homePageLogic } from "./home-page";

interface Window {
  document$: Subject<Document>;
}

declare const document$: Window["document$"];

if (document$) {
  // Subscribe to run logic on initial load AND every instant navigation
  document$.subscribe((document: Document) => {
    const gitInformation: GitInfo | null =
      getValueFromSessionStoragePartialMatch<GitInfo>("__source");

    homePageLogic(document, gitInformation);
  });
}
