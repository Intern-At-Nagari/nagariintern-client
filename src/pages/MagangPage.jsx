import React from "react";
import TimelineView from "../components/TimeLineView";
import EmptyState from "./EmptyStatePage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ApplicationStatus = () => {
  const [applicationStatus, setApplicationStatus] = React.useState(null);

  React.useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/my-intern`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setApplicationStatus(data);
        }
      } catch (error) {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }
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