// TimelineCard.jsx
import React from "react";

const TimelineCard = ({ events }) => {
  return (
    <div className="card fadeInUp">
      <div className="card-header">🔍 Anomaly Timeline</div>
      <div className="card-body">
        <ul className="timeline">
          {events.map((event, idx) => (
            <li key={idx}>
              <span className={`badge ${event.type === "anomaly" ? "danger" : "success"}`}>
                {event.type === "anomaly" ? "Anomaly" : "Normal"}
              </span>
              <strong>{event.file}</strong> — {event.message}
              <div className="text-sm opacity-70">{event.timestamp}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimelineCard;
