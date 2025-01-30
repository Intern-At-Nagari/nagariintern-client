import React, { useState, useEffect } from "react";
import TimelineView from "../components/TimeLineView";
import EmptyState from "./EmptyStatePage";

const ApplicationStatus = () => {
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/my-intern", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setApplicationStatus(data);
      } catch (error) {
        console.error("Error fetching application status:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationStatus();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>; // Bisa diganti dengan error component
  }

  return applicationStatus ? (
    <TimelineView applicationStatus={applicationStatus} />
  ) : (
    <EmptyState />
  );
};

export default ApplicationStatus;
