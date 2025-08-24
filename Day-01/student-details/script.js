function saveStudent() {
  // Step 1: Take input values
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const course = document.getElementById("course").value;

  // Step 2: Create an object
  const student = {
    name: name,
    age: age,
    course: course
  };

  // Step 3: Display details
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `
    <h3>Saved Student:</h3>
    <p><b>Name:</b> ${student.name}</p>
    <p><b>Age:</b> ${student.age}</p>
    <p><b>Course:</b> ${student.course}</p>
  `;
}
