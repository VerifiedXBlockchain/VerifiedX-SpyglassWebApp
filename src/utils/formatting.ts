export function numberWithCommas(n: number) {

  const parts = n.toString().split('.');
  if(parts.length < 2) {
    return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const sig = parts[0].replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const fract = parts[1];

  return `${sig}.${fract}`;

}

export function formatBytes(bytes: number, decimals: number = 2) {
  let units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return parseFloat(bytes.toFixed(decimals)) + " " + units[i];
}

export function chunkString(str: string, len: number) {
  const size = Math.ceil(str.length / len);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len);
    offset += len;
  }

  return r;
}
