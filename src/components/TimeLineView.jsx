import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  Calendar,
  Users,
  Timer,
  File,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Lock,
  MapPin,
  User,
  Briefcase,
  School,
} from "lucide-react";
import DiprosesCard from "./card/DiprosesCard";
import DiterimaCard from "./card/DiterimaCard";
import PernyataanCard from "./card/PernyataanCard";
import PersetujuanCard from "./card/PersetujuanCard";
import MenolakCard from "./card/MenolakCard";
import DitolakCard from "./card/tahap-2/DitolakCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TimelineView = ({ applicationStatus }) => {
  console.log(applicationStatus);
  const [activeStep, setActiveStep] = useState("1");

  const timelineSteps = [
    {
      id: "1",
      title: "Diproses",
      subtitle: "Tahap 1",
      statusCode: 1,
    },
    {
      id: "2",
      title:
        applicationStatus.data.status.id === 2 &&
        applicationStatus.data.statusState === "rejected"
          ? "Ditolak"
          : applicationStatus.data.status.id === 2 &&
            applicationStatus.data.statusState === "reject"
          ? "Menolak"
          : "Diterima",
      subtitle: "Tahap 2",
      statusCode: 2,
      content: {
        title: "Upload Surat Pernyataan",
        status: "Menunggu dokumen",
      },
    },
    {
      id: "3",
      title: "Verifikasi",
      subtitle: "Tahap 3",
      statusCode: 3,
      content: {
        title: "Status Dokumen",
        status: "Sedang direview",
      },
    },
    {
      id: "4",
      title: "Mulai Magang",
      subtitle: "Tahap 4",
      statusCode: 4,
      content: {
        title: "Dokumen Disetujui",
        status: "Terverifikasi",
      },
    },
  ];

  const ApplicantProfileSummary = ({ data }) => {
    return (
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">Nama</Typography>
                <Typography className="font-semibold">
                  {data.biodata.nama}
                </Typography>
              </div>
            </div>
            <div className="flex items-center">
              <School className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">
                  Institusi
                </Typography>
                <Typography className="font-semibold">
                  {data.institusi}
                </Typography>
              </div>
            </div>
            <div className="flex items-center">
              <Briefcase className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">
                  Jurusan
                </Typography>
                <Typography className="font-semibold">
                  {data.jurusan}
                </Typography>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">
                  Penempatan
                </Typography>
                <Typography className="font-semibold">
                  {data.penempatan || data.unitKerja}
                </Typography>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">
                  Periode Magang
                </Typography>
                <Typography className="font-semibold">
                  {new Date(data.tanggalMulai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(data.tanggalSelesai).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </div>
            </div>
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <Typography className="text-gray-600 text-sm">
                  Status
                </Typography>
                <Typography
                  className={`font-semibold ${
                    data.status.name === "Diterima"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {data.status.name}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Set initial active step based on application status
    const currentStatusStep = applicationStatus.data.status.id.toString();
    setActiveStep(currentStatusStep);
  }, [applicationStatus]);

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.id === activeStep
  );

  const isStepAccessible = (stepId) => {
    const currentStatusId = applicationStatus.data.status.id;
    return parseInt(stepId) <= currentStatusId;
  };

  const getStepIcon = (stepStatusCode) => {
    const currentStatusId = applicationStatus.data.status.id;

    if (stepStatusCode < currentStatusId) {
      return CheckCircle;
    }

    if (stepStatusCode == currentStatusId) {
      if (
        stepStatusCode == 2 &&
        (applicationStatus.data.statusState == "reject" ||
          applicationStatus.data.statusState == "rejected")
      ) {
        return XCircle;
      }
      return Clock;
    }
    return AlertCircle; // Future steps
  };

  const handleStepClick = (stepId) => {
    if (isStepAccessible(stepId)) {
      setActiveStep(stepId);
    }
  };

  const getProgressLineColor = (index) => {
    const currentStatusId = applicationStatus.data.status.id;
    const step = timelineSteps[index];

    // If current step's status code is less than the current status, it's completed (blue)
    if (step.statusCode < currentStatusId) {
      if (
        step.statusCode == 1 && applicationStatus.data.status.id==2 &&
        (applicationStatus.data.statusState == "reject" ||
          applicationStatus.data.statusState == "rejected")
      ) {
        return "bg-gradient-to-r from-blue-500 to-red-400";
      }
      return "bg-blue-500";
    }

    // If current step's status code matches current status, it's in-progress (gradient)
    if (step.statusCode === currentStatusId) {
      if (
        step.statusCode == 2 &&
        (applicationStatus.data.statusState == "reject" ||
          applicationStatus.data.statusState == "rejected")
      ) {
        return "bg-gray-200";
      }
      return "bg-gradient-to-r from-blue-500 to-gray-200";
    }

    // Future steps are gray
    return "bg-gray-200";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStepContent = (stepId, applicationStatus) => {
    switch (stepId) {
      case "1":
        return <DiprosesCard applicationStatus={applicationStatus} />;
      case "2":
        return applicationStatus.data.statusState === "reject" ? (
          <MenolakCard applicationStatus={applicationStatus} />
        ) : applicationStatus.data.statusState === "rejected" ? (
          <DitolakCard applicationStatus={applicationStatus} />
        ) : (
          <DiterimaCard applicationStatus={applicationStatus} />
        );
      case "3":
        return <PernyataanCard applicationStatus={applicationStatus} />;
      case "4":
        return <PersetujuanCard applicationStatus={applicationStatus} />;
      // Hapus case untuk tahap 5
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <ApplicantProfileSummary data={applicationStatus.data} />
      <div className="text-center mb-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Status Pengajuan Magang
        </Typography>
        <Typography className="text-gray-600">
          Pantau progress pengajuan magang Anda
        </Typography>
      </div>
      {/* Timeline Container */}
      <div className="relative overflow-x-auto pb-8">
        {/* Desktop Timeline */}
        <div className="hidden md:block min-w-max pt-2">
          <div className="flex items-center justify-between px-4">
            {timelineSteps.map((step, index) => {
              const StatusIcon = getStepIcon(step.statusCode);
              const isActive = activeStep === step.id;
              const isAccessible = isStepAccessible(step.id);
              const isLast = index === timelineSteps.length - 1;

              return (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center w-full"
                >
                  {!isLast && (
                    <div
                      className={`absolute top-7 left-1/2 w-full h-1 ${getProgressLineColor(
                        index
                      )}`}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className={`
                flex flex-col items-center space-y-2 
                transition-all duration-200 group
                ${!isAccessible ? "cursor-not-allowed opacity-60" : ""}
              `}
                      disabled={!isAccessible}
                    >
                      <div
                        className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  transition-all duration-200 border-2
                  ${
                    isActive
                      ? "ring-4 ring-blue-100 shadow-lg transform scale-110"
                      : ""
                  }
                  ${
                    !isAccessible
                      ? "bg-gray-100 border-gray-200"
                      : step.statusCode < applicationStatus.data.status.id
                      ? "bg-blue-500 border-blue-500"
                      : step.statusCode === 2 &&
                        (applicationStatus.data.statusState == "reject" ||applicationStatus.data.statusState == "rejected")
                      ? "bg-white border-red-500 ring-2 ring-red-100"
                      : step.statusCode === applicationStatus.data.status.id
                      ? "bg-white border-blue-500 ring-2 ring-blue-100"
                      : "bg-gray-100 border-gray-200"
                  }
                `}
                      >
                        {!isAccessible ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : (
                          <StatusIcon
                            className={`w-6 h-6 ${
                              step.statusCode < applicationStatus.data.status.id
                                ? "text-white"
                                : step.statusCode === 2 &&
                                (applicationStatus.data.statusState == "reject" ||applicationStatus.data.statusState == "rejected")
                                ? "text-red-500"
                                : step.statusCode ===
                                  applicationStatus.data.status.id
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                      <div
                        className={`
                  text-center transition-all duration-200
                  ${
                    !isActive
                      ? "p-2"
                      : step.statusCode === 2 &&
                        (applicationStatus.data.statusState == "reject" ||applicationStatus.data.statusState == "rejected")
                      ? "bg-red-50 p-2 rounded-lg shadow-sm"
                      : "bg-blue-50 p-2 rounded-lg shadow-sm"
                  }
                `}
                      >
                        <Typography
                          className={`
                    font-semibold mb-0.5
                    ${
                      !isAccessible
                        ? "text-gray-400"
                        : step.statusCode < applicationStatus.data.status.id
                        ? "text-blue-500"
                        : step.statusCode === 2 &&
                          (applicationStatus.data.statusState == "reject" ||applicationStatus.data.statusState == "rejected")
                        ? "text-red-500"
                        : step.statusCode === applicationStatus.data.status.id
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  `}
                        >
                          {step.title}
                        </Typography>
                        <Typography
                          className={`text-sm ${
                            step.statusCode < applicationStatus.data.status.id
                              ? "text-blue-500"
                              : step.statusCode === 2 &&
                              (applicationStatus.data.statusState == "reject" ||applicationStatus.data.statusState == "rejected")
                              ? "text-red-500"
                              : step.statusCode ===
                                applicationStatus.data.status.id
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {step.subtitle}
                        </Typography>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline - Remains largely unchanged */}
        <div className="md:hidden space-y-4">
          {timelineSteps.map((step, index) => {
            const StatusIcon = getStepIcon(step.statusCode);
            const isActive = activeStep === step.id;
            const isAccessible = isStepAccessible(step.id);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={!isAccessible}
                className={`
          w-full flex items-center p-4 rounded-xl
          transition-all duration-200
          ${!isAccessible ? "opacity-60 cursor-not-allowed" : ""}
          ${
            isActive
              ? "bg-blue-50 border-2 border-blue-200 shadow-md"
              : "hover:bg-gray-50 border border-gray-100"
          }
        `}
              >
                <div
                  className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${
              !isAccessible
                ? "bg-gray-100"
                : step.statusCode < applicationStatus.data.status.id
                ? "bg-blue-500"
                : step.statusCode === applicationStatus.data.status.id
                ? "bg-blue-500"
                : "bg-gray-100"
            }
          `}
                >
                  {!isAccessible ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <StatusIcon
                      className={`w-6 h-6 ${
                        step.statusCode < applicationStatus.data.status.id ||
                        step.statusCode === applicationStatus.data.status.id
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <div className="ml-4 text-left">
                  <Typography
                    className={`
              font-semibold
              ${
                !isAccessible
                  ? "text-gray-400"
                  : isActive
                  ? "text-blue-600"
                  : step.statusCode < applicationStatus.data.status.id
                  ? "text-blue-500"
                  : step.statusCode === applicationStatus.data.status.id
                  ? "text-blue-500"
                  : "text-gray-600"
              }
            `}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    className={`text-sm ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.subtitle}
                  </Typography>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Content Card */}
      {isStepAccessible(activeStep) ? (
        <Card
          className={`mt-8 shadow-lg ${
            activeStep === currentStepIndex ? "ring-2 ring-blue-200" : ""
          }`}
        >
          <CardBody className="p-6">
            {getStepContent(activeStep, applicationStatus)}
          </CardBody>
        </Card>
      ) : (
        <Card className="mt-8 shadow-lg">
          <CardBody className="p-6 text-center">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              Tahap Terkunci
            </Typography>
            <Typography className="text-gray-600">
              Anda perlu menyelesaikan tahap verifikasi sebelum dapat melihat
              informasi tahap ini
            </Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default TimelineView;
