// ----- DATA MODEL -----
/*
students = [
  { name: "Jatin", subjects: { English: 78, Math: 90 } },
  ...
]
*/
let students = []
const subjectsSet = new Set() // global pool of subject names for suggestions

// ----- DOM -----
const nameInput = document.getElementById('studentName')
const addStudentBtn = document.getElementById('addStudentBtn')
const studentSelect = document.getElementById('studentSelect')

const subjectInput = document.getElementById('subjectInput')
const subjectSuggestions = document.getElementById('subjectSuggestions')
const marksInput = document.getElementById('subjectMarks')
const addSubjectBtn = document.getElementById('addSubjectBtn')

const studentsDataEl = document.getElementById('studentsData')

// ----- CHART -----
const chartCtx = document.getElementById('marksChart').getContext('2d')
let chart // will be created lazily

function makeChart() {
  if (chart) chart.destroy()
  chart = new Chart(chartCtx, {
    type: 'bar',
    data: { labels: Array.from(subjectsSet), datasets: buildDatasets() },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Marks' },
        },
      },
    },
  })
}

function buildDatasets() {
  // one dataset per student, aligned with subjects (labels)
  const labels = Array.from(subjectsSet)
  return students.map((s, i) => ({
    label: s.name,
    data: labels.map((sub) => s.subjects[sub] ?? 0),
    backgroundColor: `hsl(${(i * 57) % 360} 70% 60%)`,
  }))
}

function updateChart() {
  if (!chart) {
    if (subjectsSet.size === 0) return // nothing to draw yet
    makeChart()
    return
  }
  chart.data.labels = Array.from(subjectsSet)
  chart.data.datasets = buildDatasets()
  chart.update()
}

// ----- UI HELPERS -----
function refreshStudentSelect() {
  const current = studentSelect.value
  studentSelect.innerHTML = `<option value="">Select student</option>`
  students.forEach((s) => {
    const opt = document.createElement('option')
    opt.value = s.name
    opt.textContent = s.name
    studentSelect.appendChild(opt)
  })
  if (students.some((s) => s.name === current)) studentSelect.value = current
}

function renderStudents() {
  studentsDataEl.innerHTML = ''
  students.forEach((s) => {
    const subjectValues = Object.values(s.subjects)
    const total = subjectValues.reduce((a, b) => a + b, 0)
    const avg = subjectValues.length ? total / subjectValues.length : 0
    const status = avg >= 40 ? 'Pass' : 'Fail'

    const card = document.createElement('div')
    card.className = 'student-card'
    card.innerHTML = `
      <h4>${s.name}</h4>
      <div class="badge">Total: <span class="stat">${total}</span> • Avg: <span class="stat">${avg.toFixed(
      2
    )}</span> •
        <span class="${status === 'Pass' ? 'pass' : 'fail'}">${status}</span>
      </div>

      <table class="table">
        <thead><tr><th>Subject</th><th>Marks</th></tr></thead>
        <tbody>
          ${Object.entries(s.subjects)
            .map(
              ([sub, mark]) => `
            <tr><td>${sub}</td><td>${mark}</td></tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    `
    studentsDataEl.appendChild(card)
  })
}

// ----- SUGGESTIONS (NOT INPUT-LOOKING) -----
function showSuggestions() {
  const q = subjectInput.value.trim().toLowerCase()
  const pool = Array.from(subjectsSet).filter((s) =>
    s.toLowerCase().includes(q)
  )

  subjectSuggestions.innerHTML = ''
  if (q && !subjectsSet.has(subjectInput.value.trim())) {
    // add first an action row to add this as a new subject
    const liAdd = document.createElement('li')
    liAdd.className = 'action'
    liAdd.textContent = `➕ Add "${subjectInput.value.trim()}"`
    liAdd.onclick = () => {
      const val = subjectInput.value.trim()
      if (!val) return
      subjectsSet.add(capitalize(val))
      // close list; keep the typed value
      hideSuggestions()
      updateChart()
    }
    subjectSuggestions.appendChild(liAdd)
  }

  pool.forEach((sub) => {
    const li = document.createElement('li')
    li.textContent = sub
    li.onclick = () => {
      subjectInput.value = sub
      hideSuggestions()
    }
    subjectSuggestions.appendChild(li)
  })

  subjectSuggestions.hidden = subjectSuggestions.children.length === 0
}

function hideSuggestions() {
  subjectSuggestions.hidden = true
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!document.querySelector('.subject-wrap').contains(e.target))
    hideSuggestions()
})

// ----- EVENTS -----
addStudentBtn.addEventListener('click', () => {
  const name = nameInput.value.trim()
  if (!name) return alert('Please enter a student name.')
  if (students.some((s) => s.name.toLowerCase() === name.toLowerCase()))
    return alert('Student already exists.')

  students.push({ name: capitalize(name), subjects: {} })
  nameInput.value = ''
  refreshStudentSelect()
  renderStudents()
  updateChart()
})

subjectInput.addEventListener('input', showSuggestions)
subjectInput.addEventListener('focus', showSuggestions)

addSubjectBtn.addEventListener('click', () => {
  const sName = studentSelect.value
  const subject = subjectInput.value.trim()
  const marks = parseInt(marksInput.value, 10)

  if (!sName) return alert('Select a student first.')
  if (!subject) return alert('Enter a subject.')
  if (Number.isNaN(marks) || marks < 0 || marks > 100)
    return alert('Enter valid marks (0–100).')

  const student = students.find((s) => s.name === sName)
  const cleanSubject = capitalize(subject)
  student.subjects[cleanSubject] = marks

  subjectsSet.add(cleanSubject) // feed global suggestions

  // clear inputs
  subjectInput.value = ''
  marksInput.value = ''
  hideSuggestions()

  renderStudents()
  updateChart()
})

// ----- UTIL -----
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
