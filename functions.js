function stripos(a, b, c) {
  const d = (a + "").toLowerCase();
  const e = (b + "").toLowerCase();
  let index = 0;
  if ((index = d.indexOf(e, c)) !== -1) {
    return index;
  }
  return false;
}

function removePrefix(str, prefix) {
  if (0 === stripos(str, prefix)) {
    str = str.substr(prefix.length);
  }
  return str;
}

module.exports = { removePrefix };
