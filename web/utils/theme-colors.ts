export function getThemeColors() {
    if (!globalThis) return {
        primaryColor: "#ff0073"
    }
    const documentStyles = getComputedStyle(globalThis.document.documentElement)

    return {
        primaryColor: documentStyles.getPropertyValue("--tgai-primary")
    }
}