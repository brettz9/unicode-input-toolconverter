export default function (entity, currentStartCharCode) {
    const entityInParentheses = '(' + entity + ') ';
    // Todo: Should this not be padded to 6??
    const currentStartCharCodeUpperCaseHexPadded = currentStartCharCode.toString(16).toUpperCase().padStart(4, '0');
    // Todo:

}
