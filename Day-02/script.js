// ---------- For Loop ----------
function findWithFor() {
  let input = document.getElementById("marksInput").value;
  let marks = input.split(",").map(num => parseInt(num.trim()));

  let highest = marks[0];
  for (let i = 1; i < marks.length; i++) {
    if (marks[i] > highest) {
      highest = marks[i];
    }
  }
  document.getElementById("result").textContent =
    "Highest Marks (for loop): " + highest;
}

// ---------- While Loop ----------
function findWithWhile() {
  let input = document.getElementById("marksInput").value;
  let marks = input.split(",").map(num => parseInt(num.trim()));

  let highest = marks[0];
  let i = 1;
  while (i < marks.length) {
    if (marks[i] > highest) {
      highest = marks[i];
    }
    i++;
  }
  document.getElementById("result").textContent =
    "Highest Marks (while loop): " + highest;
}

// ---------- forEach Loop ----------
function findWithForEach() {
  let input = document.getElementById("marksInput").value;
  let marks = input.split(",").map(num => parseInt(num.trim()));

  let highest = marks[0];
  marks.forEach(mark => {
    if (mark > highest) {
      highest = mark;
    }
  });
  document.getElementById("result").textContent =
    "Highest Marks (forEach loop): " + highest;
}
