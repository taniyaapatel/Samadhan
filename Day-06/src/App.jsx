import React from "react";
import ProfileCard from "./components/ProfileCard";

function App() {
  return (
    <div>
      <ProfileCard
        name="Taniya Patel"
        role="Developer"
        college="LNCT Bhopal"
        interests="IoT, AI/ML, Web Development"
        image="/taniya.jpg.png"  // ✅ from your public folder
      />
    </div>
  );
}

export default App;
