export function createMapUrl(latitude, longitude) {
  if (latitude && longitude) {
    return `http://maps.google.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=340x280&scale=2&maptype=terrain&key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`
  } else {
    return ''
  }
}
