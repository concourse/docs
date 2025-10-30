function getOS() {
    const userAgent = window.navigator.userAgent;
    let os = "Unknown OS";

    if (userAgent.includes("Windows NT")) {
        os = "Windows";
    } else if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS X")) {
        os = "macOS";
    } else if (userAgent.includes("Linux")) {
        os = "Linux";
    } else if (userAgent.includes("Android")) {
        os = "Android";
    } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        os = "iOS";
    }
    return os;
}

document.addEventListener("DOMContentLoaded", () => {
    const userOS = getOS();
    const windowsContent = document.getElementById("windows-specific-content");
    const macContent = document.getElementById("mac-specific-content");

    if (windowsContent) {
        windowsContent.style.display = (userOS === "Windows") ? "block" : "none";
    }
    if (macContent) {
        macContent.style.display = (userOS === "macOS") ? "block" : "none";
    }
    // Add more conditions for other OSs as needed
});

