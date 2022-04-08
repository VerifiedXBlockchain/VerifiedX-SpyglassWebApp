export function numberWithCommas(n: number) {
  return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export function formatBytes(bytes: number, decimals: number = 2) {
  let units = ["B", "KB", "MB", "GB", "TB", "PB"];

  let i = 0;

  for (i; bytes > 1024; i++) {
    bytes /= 1024;
  }

  return parseFloat(bytes.toFixed(decimals)) + " " + units[i];
}
