// Pretty solid quicksort
export function quicksort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  let pivot = arr[0];
  let leftArr = [];
  let rightArr = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i][0] < pivot[0]) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }
  return [...quicksort(leftArr), pivot, ...quicksort(rightArr)];
}
