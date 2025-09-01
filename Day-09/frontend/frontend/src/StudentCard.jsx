export default function StudentCard({ student }) {
  return (
    <div className="student-card">
      <h2>{student.name}</h2>
      <p>{student.course}</p>
      <span>{student.year} Year</span>
    </div>
  );
}