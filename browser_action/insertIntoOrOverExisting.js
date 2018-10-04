// Todo: Move to own library
export default function insertIntoOrOverExisting ({textReceptable, value, focus = true} = {}) {
    const {length} = textReceptable.value;
    const start = textReceptable.selectionStart;
    const end = textReceptable.selectionEnd;

    if (focus) textReceptable.focus();
    const pre = textReceptable.value.substring(0, start);
    const post = textReceptable.value.substring(end, length);
    textReceptable.value = pre + value + post;

    textReceptable.selectionStart = pre.length + value.length;
    textReceptable.selectionEnd = pre.length + value.length;
}
