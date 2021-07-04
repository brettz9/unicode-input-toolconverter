/**
* @param {PlainObject} cfg
* @param {Integer} cfg.receivedLength
* @param {Integer[]} cfg.chunks
* @returns {Uint8Array}
*/
function joinChunks ({
  chunks,
  receivedLength
}) {
  // Combine into single `Uint8Array`
  const compressed = new Uint8Array(receivedLength);
  let pos = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, pos);
    pos += chunk.length;
  }
  return compressed;
}

export {joinChunks};
