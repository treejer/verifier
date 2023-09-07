export function ellipsisString(string, sliceLength) {
  if (string && string.length > sliceLength) {
    return `${string.slice(0, sliceLength)}...${string.slice(-sliceLength)}`
  } else {
    return string
  }
}
