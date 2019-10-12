// Todo: Move to own library
export default function insertIntoOrOverExisting ({textReceptacle, value, focus = true} = {}) {
  const {length} = textReceptacle.value;
  const start = textReceptacle.selectionStart;
  const end = textReceptacle.selectionEnd;

  if (focus) textReceptacle.focus();
  const pre = textReceptacle.value.substring(0, start);
  const post = textReceptacle.value.substring(end, length);
  textReceptacle.value = pre + value + post;

  textReceptacle.selectionStart = pre.length + value.length;
  textReceptacle.selectionEnd = pre.length + value.length;
}
