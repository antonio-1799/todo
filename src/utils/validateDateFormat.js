export default async (date) => {
    const regexExp = /(19|20)[0-9][0-9]-(0[0-9]|1[0-2])-(0[1-9]|([12][0-9]|3[01]))\s([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]/gi
    return regexExp.test(date)
}