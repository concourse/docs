// 1. Import and register all Material Web Components
import '@material/web/all.js';

import {MdMenu} from "@material/web/all";


// 2. Custom MkDocs Initialization Logic
const document$ = window.document$;

if (document$) {
    // Subscribe to run logic on initial load AND every instant navigation
    document$.subscribe(() => {
        // downloadMacOs();
        // setupPrimaryTabPanels();
    });

    // const cached = __md_get<SourceFacts>("__source", sessionStorage)
    const gitInformation: string | null = getValueFromSessionStoragePartialMatch("__source");

    console.log(gitInformation)
}

function getValueFromSessionStoragePartialMatch(partialMatch: string): string | null {
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        // Ensure the key exists and perform the partial match check
        if (key && key.includes(partialMatch)) {
            // Retrieve the value for the matching key
            return sessionStorage.getItem(key);
        }
    }
    // Return null if no key matches the partial string
    return null;
}