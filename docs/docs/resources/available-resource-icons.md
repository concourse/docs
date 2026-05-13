---
title: Available Resource Icons
---

# Available Resource Icons

This is a list[^1] of icons and their names that you can use in your pipelines' `resource`
definitions. Hover over an icon to get the name of the icon or click it to copy the name to 
your clipboard. You can also search using the text field below, with or without the `si/`
prefix.

<div id="icon-list" class="notready" markdown>
<input type="search" class="search" placeholder="Search for an icon" autofocus />
<div class="list grid" markdown>
-8<- "tools/icon-list/all-icons.fragment"
</div>
</div>

[^1]:
    There are more icons available from [Simple Icons](https://simpleicons.org) than listed here;
    this is due to the version of Simple Icons used by [Material for Mkdocs](https://squidfunk.github.io/mkdocs-material).
    Go to their site to find the complete list, and prefix the name there with `si/` to use in Concourse.

<script>
  (function() {
    const itemClickHandler = (event) => {
        const item = event.currentTarget;
        const name = item.getAttribute("data-title");
        if (name) {
            navigator.clipboard
                .writeText(name)
                .then(function () {
                console.log(`copied ${name} to clipboard`);
                item.classList.add("copied");
                setTimeout(() => item.classList.remove("copied"), 2000);
            })
                .catch(function (err) {
                console.error(`failed to copy ${name} to the clipboard: ${err}`);
            });
        }
    };
    const updateListItems = (list) => {
        list.visibleItems.forEach((item) => {
            item.elm.addEventListener("click", itemClickHandler);
        });
    };
   
    var script = document.createElement('script');
    script.src = '/assets/javascripts/list.min.js';
    script.onload = function() {
      console.log("list.min.js loaded");
      document.getElementById("icon-list").classList.remove("notready");
      const list = new List("icon-list", {
          valueNames: [{ data: ["search"] }],
          indexAsync: true,
          page: 25000,
      });
      list.on("parseComplete", (l) => {
        updateListItems(l);
        l.on("updated", updateListItems);
      });   
    };
    document.head.appendChild(script);
  })();
</script>
