import React from "react";
import TimelineView from "../components/TimeLineView";
import EmptyState from "./EmptyStatePage";

const ApplicationStatus = () => {
  const [applicationStatus, setApplicationStatus] = React.useState(null);

  React.useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/my-intern", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setApplicationStatus(data);
        }
      } catch (error) {
        console.error("Error fetching application status:", error);
      }
    };

    fetchApplicationStatus();
  }, []);

  return applicationStatus ? (
    <TimelineView applicationStatus={applicationStatus} />
  ) : (
    <EmptyState />
  );
};

export default ApplicationStatus;