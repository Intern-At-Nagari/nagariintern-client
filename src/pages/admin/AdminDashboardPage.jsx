import React from "react";
import { Typography } from "@material-tailwind/react";

import Sidebar from "../../layout/Sidebar";
import BreadcrumbsComponent from "../../components/BreadcrumbsComponent";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />

      {/* Sticky Header */}

      {/* Welcome Message */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbsComponent />
          <Typography
            variant="h3"
            className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl"
          >
            Selamat Datang di Nagari Intern Dashboard
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
