// Todo: Move to own library
export default function insertIntoOrOverExisting ({textReceptacle, value, focusIn = true} = {}) {
  const {length: len} = textReceptacle.value;
  const start = textReceptacle.selectionStart;
  const end = textReceptacle.selectionEnd;

  if (focusIn) textReceptacle.focus();
  const pre = textReceptacle.value.slice(0, Math.max(0, start));
  const post = textReceptacle.value.slice(end, len);
  textReceptacle.value = pre + value + post;

  textReceptacle.selectionStart = pre.length + value.length;
  textReceptacle.selectionEnd = pre.length + value.length;
}
