interface ReleaseInfo {
  system: "linux" | "darwin" | "windows";
  arch: "amd64" | "arm64";
  archive: "tgz" | "zip";
}
