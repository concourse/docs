import { fileURLToPath } from "url";
import { resolve } from "path";
import { createWriteStream } from "fs";
import process from "node:process";

import mdi from "@mdi/svg/meta.json" with { type: "json" };
import si from "simple-icons/icons.json" with { type: "json" };

// Convert import.meta.url (URL) to a file path
const modulePath = fileURLToPath(import.meta.url);

// Get the entry point path (process.argv[1] is the script run with `node`)
const entryPointPath = process.argv[1];

// Normalize paths to handle symlinks/relative paths and compare
const isMainModule = resolve(modulePath) === resolve(entryPointPath);

// type availableIcon = {
//   shortcode: string;
//   title: string;
//   searchKey: string;
//   sortKey: string;
// };

const nameToSearchKey = (name) => name.replace(/\W/g, "").toLowerCase();

const collectIcons = () =>
  mdi
    .map((mdIcon) => ({
      shortcode: `material-${mdIcon.name}`,
      title: mdIcon.name,
      searchKey: nameToSearchKey(mdIcon.name),
      sortKey: mdIcon.name,
    }))
    .concat(
      si.map((simpleIcon) => ({
        shortcode: `simple-${simpleIcon.slug}`,
        title: `si/${simpleIcon.slug}`,
        searchKey: `si${nameToSearchKey(simpleIcon.slug)}`,
        sortKey: simpleIcon.slug,
      })),
    );

const toMD = (icon) =>
  [
    `:${icon.shortcode}:{.lg .middle}`,
    "`" + icon.title + "`",
    `{ .card data-search="${icon.searchKey}" data-title="${icon.title}" }`,
    "",
    "", // these two empty elements will result in a blank line between each block
  ].join("\n");

const main = () => {
  const allIcons = collectIcons().sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey, undefined, { sensitivity: "base" }),
  );

  const writeStream = createWriteStream(`./tools/icon-list/all-icons.fragment`);
  allIcons.forEach((icon) => writeStream.write(toMD(icon)));
  writeStream.end();
};

if (isMainModule) {
  main();
}
