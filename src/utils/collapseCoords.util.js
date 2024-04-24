// I want to improve the performance on this
// (Current: O(n) where n{0, 365*2} or two years of data points max)
// @params coords [[x,y]...[x_n,y_n]]
export function collapseCoords(coords, collI, collJ, collBounds) {
  collBounds = coords.length;
  if (collI <= collBounds - 2) {
    let similarCoords = coords.filter((set) => {
      return set[0] === coords[collI][0];
    });
    for (let k = 1; k < similarCoords.length; k++) {
      coords[collI][collJ + 1] += similarCoords[k][collJ + 1];
      coords.splice(coords.indexOf(similarCoords[k]), 1);
    }
    collI++;
    collapseCoords(coords);
  }
  return coords;
}
