import cronstrue from 'cronstrue/i18n';

export const describeCronToCN = (exp: string) => {
    try {
        const result = cronstrue.toString(exp, { locale: "zh_CN" })
        return result
    } catch (_err) {
        return null
    }
}