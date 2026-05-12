import List from "list.js";

const itemClickHandler: EventListener = (event: Event) => {
  const item = event.currentTarget as HTMLElement;
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

const updateListItems = (list: List) => {
  list.visibleItems.forEach((item: List.ListItem) => {
    item.elm.addEventListener("click", itemClickHandler);
  });
};

export const iconLogic = () => {
  const listContainer = document.getElementById("icon-list");
  if (listContainer) {
    const list = new List(listContainer, {
      valueNames: [{ data: ["search"] }],
      indexAsync: true,
      page: 25000,
    });

    list.on("parseComplete", (l: List) => {
      updateListItems(l);

      l.on("updated", updateListItems);
    });
  }
};
