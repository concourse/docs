import {
  populateSelect,
  setLatestDisplayFromSource,
  setVersionDisplayFromSource,
} from "./helpers";
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
  const downloadBtn: HTMLElement | null = document.getElementById(
    "release-btn-ref-no-cookie",
  );
  const sideBySide: HTMLElement | null =
    document.getElementById("side-by-side");

  const mediaQueryList: MediaQueryList = window.matchMedia(
    "(max-width: 1219px)",
  );

  if (gitInformation == null) {
    if (splashDownloads != null && sideBySide != null && downloadBtn != null) {
      splashDownloads.style.display = "none";
      downloadBtn.style.display = "block";
      sideBySide.style.gridTemplateColumns = "1fr";

      setLatestDisplayFromSource(document);
    }
  } else if (
    splashDownloads != null &&
    sideBySide != null &&
    downloadBtn != null
  ) {
    splashDownloads.style.display = "flex";
    downloadBtn.style.display = "none";
    sideBySide.style.gridTemplateColumns = "1fr 1fr";

    setVersionDisplayFromSource(gitInformation, document);

    populateHomeSelects(document, gitInformation);

    if (mediaQueryList.matches) {
      sideBySide.style.gridTemplateColumns = "1fr";
    } else {
      sideBySide.style.gridTemplateColumns = "1fr 1fr";
    }
  }
}

function populateHomeSelects(document: Document, gitInformation: GitInfo) {
  const concourseSelect: HTMLSelectElement | null = document.getElementById(
    "concourse-select",
  ) as HTMLSelectElement;
  const flySelect: HTMLSelectElement | null = document.getElementById(
    "fly-select",
  ) as HTMLSelectElement;

  if (concourseSelect != null) {
    populateSelect(gitInformation, concourseSelect, "concourse", releases);

    fromEvent(concourseSelect, "change")
      .pipe(map((event) => (event.target as HTMLSelectElement).value))
      .subscribe((value) => {
        window.location.href = value;
      });
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
