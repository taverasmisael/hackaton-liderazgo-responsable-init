export const LoadMarkers = async () => {
  try {
    const response = await fetch('/mocsk/marbetes.json')
    const data = await response.json()
    return data
  } catch (err) {
    throw err
  }
}
