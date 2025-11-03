import {MdTabs} from "@material/web/tabs/tabs.js";

export function downloadMacOs(): void {

}

export function downloadWindows(): void {

}

export function downloadLinux(): void {

}

import {ref} from 'lit/directives/ref.js';
import {MdPrimaryTab} from "@material/web/all";

export function setupPrimaryTabPanels() {
    const tabsElement = document.getElementById('osPrimaryTags');

    // Get all the panel elements in order
    const panels = [
        document.getElementById('panel-macos'),
        document.getElementById('panel-windows'),
        document.getElementById('panel-linux')
    ];

    if (tabsElement) {

        const tabs = tabsElement as MdTabs;

        tabs.addEventListener('change', (event) => {
            // 1. Get the index of the newly selected tab
            const newIndex = (event.target as MdTabs).activeTabIndex;

            // 2. Loop through all panels
            panels.forEach((panel: HTMLElement | null, index) => {
                if (panel) {
                    // 3. Set 'hidden' to true for all panels except the one matching the index
                    if (index === newIndex) {
                        panel.removeAttribute('hidden'); // Show the active panel
                    } else {
                        panel.setAttribute('hidden', ''); // Hide all other panels
                    }
                }


            });
        });
    }


}

