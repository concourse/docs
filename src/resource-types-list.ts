import List from "list.js";

export const loadResourceTypeSearch = () => {
  const table = document.getElementById("resource-types-table");
  if (table) {
    var options = {
      valueNames: ["hidden-search-field"],
    };

    var resourceList = new List(table, options);
    // Randomly sort the list so we're never playing favourites
    resourceList.sort("name", {
      sortFunction: function () {
        return Math.random() - 0.5;
      },
    });
  }
};
