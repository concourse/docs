import { MdSelectOption } from "@material/web/all";

export function getValueFromSessionStoragePartialMatch<T>(
  partialMatch: string,
): T | null {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    // Ensure the key exists and perform the partial match check
    if (key && key.includes(partialMatch)) {
      // Retrieve the value for the matching key
      return JSON.parse(<string>sessionStorage.getItem(key));
    }
  }
  // Return null if no key matches the partial string
  return null;
}

export function setVersionDisplayFromSource(
  gitInformation: GitInfo,
  document: Document,
) {
  const releaseURL: string =
    "https://github.com/concourse/concourse/releases/tag/" +
    gitInformation.version;

  const releaseBtnRef: HTMLElement | null =
    document.getElementById("release-btn-ref");
  const releaseBtnSpan: HTMLElement | null =
    document.getElementById("release-btn-span");

  if (releaseBtnRef != null) {
    releaseBtnRef.setAttribute("href", releaseURL);
  }
  if (releaseBtnSpan != null) {
    releaseBtnSpan.innerText = gitInformation.version;
  }
}

export function setLatestDisplayFromSource(document: Document) {
  const releaseURL: string =
    "https://github.com/concourse/concourse/releases/latest";

  const releaseBtnRef: HTMLElement | null = document.getElementById(
    "release-btn-ref-no-cookie",
  );
  const releaseBtnSpan: HTMLElement | null = document.getElementById(
    "release-btn-span-no-cookie",
  );

  if (releaseBtnRef != null) {
    releaseBtnRef.setAttribute("href", releaseURL);
  }
  if (releaseBtnSpan != null) {
    releaseBtnSpan.innerText = "Latest release";
  }
}

export function populateSelect(
  gitInformation: GitInfo,
  element: HTMLSelectElement,
  type: string,
  releases: ReleaseInfo[],
) {
  const releaseRoot: string =
    "https://github.com/concourse/concourse/releases/download/" +
    gitInformation.version;

  if (element.childElementCount == releases.length + 1) {
    return;
  }

  let version: string = gitInformation.version;

  if (version.charAt(0) === "v") {
    version = version.slice(1);
  }

  releases.forEach((release: ReleaseInfo) => {
    let releaseLink = `${releaseRoot}/${type}-${version}-${release.system}-${release.arch}.${release.archive}`;

    const option: MdSelectOption = document.createElement("md-select-option");
    option.value = releaseLink;
    option.innerHTML = `<div slot="headline">${computeDisplayName(release)}</div>`;

    element.appendChild(option);
  });
}

function computeDisplayName(releaseInfo: ReleaseInfo): string {
  let arch: string = "";
  let os: string = "";

  switch (releaseInfo.system) {
    case "linux":
      os = "Linux";
      break;
    case "darwin":
      os = "macOS";
      break;
    case "windows":
      os = "Windows";
      break;
  }

  switch (releaseInfo.arch) {
    case "amd64":
      arch = "x86_64";
      break;
    case "arm64":
      arch = "arm64";
      break;
  }

  return `${os} (${arch})`;
}
