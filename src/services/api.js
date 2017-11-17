export const LoadMarkers = async () => {
  try {
    const response = await fetch('/mock/marbetes.json')
    const data = await response.json()
    return data
  } catch (err) {
    throw err
  }
}
