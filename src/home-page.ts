import { populateSelect, setVersionDisplayFromSource } from "./helpers";
import { fromEvent, map } from "rxjs";

const releases: ReleaseInfo[] = [
  {
    arch: "amd64",
    system: "linux",
    archive: "tgz",
  },
  {
    arch: "arm64",
    system: "linux",
    archive: "tgz",
  },
  {
    arch: "amd64",
    system: "darwin",
    archive: "tgz",
  },
  {
    arch: "arm64",
    system: "darwin",
    archive: "tgz",
  },
  {
    arch: "amd64",
    system: "windows",
    archive: "zip",
  },
];

export function homePageLogic(
  document: Document,
  gitInformation: GitInfo | null,
) {
  const splashDownloads: HTMLElement | null =
    document.getElementById("splash-downloads");
  const sideBySide: HTMLElement | null =
    document.getElementById("side-by-side");

  if (gitInformation == null) {
    if (splashDownloads != null && sideBySide != null) {
      splashDownloads.style.display = "none";
      sideBySide.style.gridTemplateColumns = "1fr";
    }
  } else if (splashDownloads != null && sideBySide != null) {
    splashDownloads.style.display = "flex";
    sideBySide.style.gridTemplateColumns = "1fr 1fr";

    setVersionDisplayFromSource(gitInformation, document);

    const concourseSelect: HTMLSelectElement | null = document.getElementById(
      "concourse-select",
    ) as HTMLSelectElement;
    const flySelect: HTMLSelectElement | null = document.getElementById(
      "fly-select",
    ) as HTMLSelectElement;

    if (concourseSelect != null) {
      populateSelect(gitInformation, concourseSelect, "concourse", releases);
    }
    if (flySelect != null) {
      populateSelect(gitInformation, flySelect, "fly", releases);

      fromEvent(flySelect, "change")
        .pipe(map((event) => (event.target as HTMLSelectElement).value))
        .subscribe((value) => {
          window.location.href = value;
        });
    }
  }
}
