import React, { useState } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import {
  Calendar,
  Users,
  Timer,
  File,
  CheckCircle,
  Clock,
  AlertCircle,
  Lock,
} from "lucide-react";
import DiprosesCard from "./card/DiprosesCard";

const TimelineView = ({ applicationStatus }) => {
  const [activeStep, setActiveStep] = useState("waiting_approval");

  const timelineSteps = [
    {
      id: "waiting_approval",
      title: "Diproses",
      status: "completed",
      subtitle: "Tahap 1",
      content: {
        title: "Detail Pengajuan",
        info: [
          { label: "Tanggal Pengajuan", value: "15 Jan 2025", icon: Calendar },
          { label: "Program", value: "Magang Industri", icon: Users },
          { label: "Durasi", value: "3 Bulan", icon: Timer },
        ],
        status: "Sedang ditinjau oleh admin",
      },
    },
    {
      id: "awaiting_statement",
      title: "Menunggu Surat",
      status: "completed",
      subtitle: "Tahap 2",
      content: {
        title: "Upload Surat Pernyataan",
        info: [
          { label: "Batas Upload", value: "22 Jan 2025", icon: Calendar },
          { label: "Format", value: "PDF (Max 2MB)", icon: File },
        ],
        status: "Menunggu dokumen",
      },
    },
    {
      id: "statement_uploaded",
      title: "Verifikasi",
      subtitle: "Tahap 3",
      status: "in-progress",
      content: {
        title: "Status Dokumen",
        info: [
          { label: "Tanggal Upload", value: "18 Jan 2025", icon: Calendar },
          { label: "Nama File", value: "surat_pernyataan.pdf", icon: File },
        ],
        status: "Sedang direview",
      },
    },
    {
      id: "statement_approved",
      title: "Persetujuan",
      subtitle: "Tahap 4",
      status: "pending",
      content: {
        title: "Dokumen Disetujui",
        info: [
          {
            label: "Tanggal Persetujuan",
            value: "19 Jan 2025",
            icon: Calendar,
          },
          { label: "Disetujui Oleh", value: "Admin HR", icon: Users },
        ],
        status: "Terverifikasi",
      },
    },
    {
      id: "letter_sent",
      title: "Selesai",
      status: "pending",
      content: {
        title: "Surat Pengantar",
        info: [
          { label: "Tanggal Pengiriman", value: "20 Jan 2025", icon: Calendar },
          { label: "Tujuan", value: "Kantor Jakarta", icon: Users },
        ],
        status: "Proses selesai",
      },
    },
  ];

  const verificationStepIndex = timelineSteps.findIndex(
    (step) => step.id === "statement_uploaded"
  );

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.id === activeStep
  );

  const isStepAccessible = (stepIndex) => {
    const verificationStep = timelineSteps[verificationStepIndex];
    if (
      stepIndex > verificationStepIndex &&
      verificationStep.status !== "completed"
    ) {
      return false;
    }
    return true;
  };

  const getStepIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      case "pending":
      default:
        return AlertCircle;
    }
  };

  const handleStepClick = (stepId, index) => {
    if (isStepAccessible(index)) {
      setActiveStep(stepId);
    }
  };

  const getProgressLineColor = (index) => {
    const step = timelineSteps[index];

    if (step.status === "completed") {
      const nextStep = timelineSteps[index + 1];
      // If next step is in-progress, create a gradient

      return "bg-blue-500"; // Completed steps get blue
    }

    if (step.status === "in-progress") {
      return "bg-gradient-to-r from-blue-500 to-gray-200"; // Gradient for in-progress
    }

    return "bg-gray-200"; // Default color for pending
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };




  // Menunggu Surat Card Component
  const MenungguSuratCard = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <Typography variant="h5" className="font-bold text-gray-800">
              Upload Surat Pernyataan
            </Typography>
            <Typography className="text-gray-600 mt-1">
              Menunggu dokumen
            </Typography>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            Tahap 2
          </div>
        </div>

        <div className="grid gap-4">
          <InfoItem icon={Calendar} label="Batas Upload" value="22 Jan 2025" />
          <InfoItem icon={File} label="Format" value="PDF (Max 2MB)" />
        </div>
      </div>
    );
  };

  // Verifikasi Card Component
  const VerifikasiCard = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <Typography variant="h5" className="font-bold text-gray-800">
              Status Dokumen
            </Typography>
            <Typography className="text-gray-600 mt-1">
              Sedang direview
            </Typography>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            Tahap 3
          </div>
        </div>

        <div className="grid gap-4">
          <InfoItem
            icon={Calendar}
            label="Tanggal Upload"
            value="18 Jan 2025"
          />
          <InfoItem
            icon={File}
            label="Nama File"
            value="surat_pernyataan.pdf"
          />
        </div>
      </div>
    );
  };

  // Persetujuan Card Component
  const PersetujuanCard = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <Typography variant="h5" className="font-bold text-gray-800">
              Dokumen Disetujui
            </Typography>
            <Typography className="text-gray-600 mt-1">
              Terverifikasi
            </Typography>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            Tahap 4
          </div>
        </div>

        <div className="grid gap-4">
          <InfoItem
            icon={Calendar}
            label="Tanggal Persetujuan"
            value="19 Jan 2025"
          />
          <InfoItem icon={Users} label="Disetujui Oleh" value="Admin HR" />
        </div>
      </div>
    );
  };

  // Selesai Card Component
  const SelesaiCard = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start border-b border-gray-100 pb-4">
          <div>
            <Typography variant="h5" className="font-bold text-gray-800">
              Surat Pengantar
            </Typography>
            <Typography className="text-gray-600 mt-1">
              Proses selesai
            </Typography>
          </div>
          <div className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            Tahap Final
          </div>
        </div>

        <div className="grid gap-4">
          <InfoItem
            icon={Calendar}
            label="Tanggal Pengiriman"
            value="20 Jan 2025"
          />
          <InfoItem icon={Users} label="Tujuan" value="Kantor Jakarta" />
        </div>
      </div>
    );
  };

  // Reusable Info Item Component
  const InfoItem = ({ icon: Icon, label, value }) => {
    return (
      <div className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="ml-4">
          <Typography className="text-gray-600 text-sm">{label}</Typography>
          <Typography className="font-semibold text-gray-800">
            {value}
          </Typography>
        </div>
      </div>
    );
  };

  const getStepContent = (stepId,applicationStatus) => {
    switch (stepId) {
      case "waiting_approval":
        return <DiprosesCard applicationStatus={applicationStatus}/>;
      case "awaiting_statement":
        return <MenungguSuratCard />;
      case "statement_uploaded":
        return <VerifikasiCard />;
      case "statement_approved":
        return <PersetujuanCard />;
      case "letter_sent":
        return <SelesaiCard />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
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
              const StatusIcon = getStepIcon(step.status);
              const isActive = activeStep === step.id;
              const isAccessible = isStepAccessible(index);
              const isLast = index === timelineSteps.length - 1;

              return (
                <div
                  key={step.id}
                  className="relative flex flex-col items-center w-48"
                >
                  {/* Connector Line - Now outside the button's transform scope */}
                  {!isLast && (
                    <div
                      className={`absolute top-7 left-1/2 w-full h-1 ${getProgressLineColor(
                        index
                      )}`}
                    />
                  )}

                  <div className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step.id, index)}
                      className={`
                        flex flex-col items-center space-y-2 
                        transition-all duration-200 group
                        ${!isAccessible ? "cursor-not-allowed opacity-60" : ""}
                      `}
                    >
                      {/* Icon Circle */}
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
                              : step.status === "completed"
                              ? "bg-blue-500 border-blue-500"
                              : step.status === "in-progress"
                              ? "bg-blue-500 border-blue-500"
                              : "bg-white border-gray-300"
                          }
                        `}
                      >
                        {!isAccessible ? (
                          <Lock className="w-6 h-6 text-gray-400" />
                        ) : (
                          <StatusIcon
                            className={`w-6 h-6 ${
                              step.status === "completed" ||
                              step.status === "in-progress"
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>

                      {/* Step Title */}
                      <div
                        className={`
                          text-center transition-all duration-200
                          ${
                            isActive
                              ? "bg-blue-50 p-2 rounded-lg shadow-sm"
                              : ""
                          }
                        `}
                      >
                        <Typography
                          className={`
                            font-semibold mb-0.5
                            ${
                              !isAccessible
                                ? "text-gray-400"
                                : isActive
                                ? "text-blue-600"
                                : step.status === "completed"
                                ? "text-blue-500"
                                : step.status === "in-progress"
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline - Remains largely unchanged */}
        <div className="md:hidden space-y-4">
          {timelineSteps.map((step, index) => {
            const StatusIcon = getStepIcon(step.status);
            const isActive = activeStep === step.id;
            const isAccessible = isStepAccessible(index);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id, index)}
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
                        : step.status === "completed"
                        ? "bg-blue-500"
                        : step.status === "in-progress"
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
                        step.status === "completed" ||
                        step.status === "in-progress"
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
                          : step.status === "completed"
                          ? "text-blue-500"
                          : step.status === "in-progress"
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
      {isStepAccessible(currentStepIndex) ? (
        <Card
          className={`mt-8 shadow-lg ${
            activeStep === currentStepIndex ? "ring-2 ring-blue-200" : ""
          }`}
        >
          <CardBody className="p-6">{getStepContent(activeStep,applicationStatus)}</CardBody>
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
