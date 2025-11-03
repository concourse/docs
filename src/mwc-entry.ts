// 1. Import and register all Material Web Components
import '@material/web/all.js';

import {faWindows} from "@fortawesome/free-brands-svg-icons"

import {MdMenu} from "@material/web/all";
import {setupPrimaryTabPanels} from "./homepage";



// 2. Custom MkDocs Initialization Logic
const document$ = window.document$;

if (document$) {
    // Subscribe to run logic on initial load AND every instant navigation
    document$.subscribe(() => {
        downloadMacOs();
        setupPrimaryTabPanels();
    });
}

function downloadMacOs() {
    // This example uses anchor as an ID reference
    const anchorEl: HTMLElement | null = document.body.querySelector('#usage-anchor');
    const menuEl: MdMenu | null = document.body.querySelector('#usage-menu');

    if (anchorEl && menuEl) {
        anchorEl.addEventListener('click', () => {
            menuEl.open = !menuEl.open;
        });
    }
}