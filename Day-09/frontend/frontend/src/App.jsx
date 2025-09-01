import { useEffect, useState } from "react";
import StudentCard from "./StudentCard";
import "./index.css";
import gsap from "gsap";

export default function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // GSAP animation effect
  useEffect(() => {
    if (students.length > 0) {
      gsap.from(".student-card", {
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }, [students]);

  return (
    <div className="app-container">
      <h1 className="title">Student Directory</h1>
      <div className="student-grid">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}