import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ name, role, college, interests, image }) => {
  return (
    <div className="card-container">
      <div className="card">
        {/* Cover background */}
        <div className="card-header"></div>

        {/* Profile Image */}
        <div className="profile-pic">
          <img src={image} alt="Profile" />
        </div>

        {/* User Info */}
        <div className="card-body">
          <h2>{name}</h2>
          <p className="role">{role}</p>
          <p className="college">{college}</p>
          <p className="interests">{interests}</p>
        </div>

        {/* Footer Stats */}
        <div className="card-footer">
          <div>
            <h3>👩</h3>
            <p>Name</p>
          </div>
          <div>
            <h3>💻</h3>
            <p>Role</p>
          </div>
          <div>
            <h3>🎓</h3>
            <p>College</p>
          </div>
          <div>
            <h3>📚</h3>
            <p>Interests</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
