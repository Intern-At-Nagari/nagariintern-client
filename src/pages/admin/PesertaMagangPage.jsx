import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Typography,
  IconButton,
  Input,
  Tooltip,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import {
  EyeIcon,
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  UserIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  PrinterIcon,
  IdentificationIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";
import ModalIframe from "../../components/ModalIframe";
import MonthlyAttendanceTable from "../../components/MonthlyAttendanceTable";
import axios from "axios";

const PesertaMagangPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({
    url: "",
    title: "",
  });

  const handlePrintOpen = useCallback(() => {
    setPrintOpen((prev) => !prev);
  }, []);

  const itemsPerPage = 5;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get("http://localhost:3000/admin/intern", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = response.data.data || response.data;
        const dataArray = Array.isArray(responseData) ? responseData : [];
        setData(dataArray);

        const uniqueInstitutions = [
          ...new Set(dataArray.map((item) => item.institusi).filter(Boolean)),
        ];
        const uniqueTypes = [
          ...new Set(dataArray.map((item) => item.type).filter(Boolean)),
        ];

        setInstitutions(uniqueInstitutions);
        setTypes(uniqueTypes);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:3000/intern/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedIntern(response.data);
      setIsDetailOpen(true);
    } catch (err) {
      console.error("Error fetching intern details:", err);
    }
  };

  const handleDocumentModal = (url = "", title = "") => {
    setSelectedDocument({ url, title });
    setIsDocumentModalOpen(!isDocumentModalOpen);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Rest of the filtering logic remains the same
  const filteredData = data.filter((item) => {
    if (!item || item.status.name !== "Mulai Magang") return false;

    const matchesSearch = [
      item.biodata?.nama || "",
      item.institusi || "",
      item.type || "",
      item.status.name || "",
      item.jurusan || "",
      item.unitKerja || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || item.type === selectedType;
    const matchesInstitution =
      !selectedInstitution || item.institusi === selectedInstitution;

    return matchesSearch && matchesType && matchesInstitution;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-4 flex justify-between items-center mb-4">
            <Typography
              variant="h3"
              className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl"
            >
              Peserta Magang
            </Typography>

            <div className="flex gap-2">
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={handlePrintOpen}
              >
                <PrinterIcon className="h-4 w-4" /> Cetak Surat Pengantar
              </Button>
              <Button
                color="green"
                className="flex items-center gap-2"
                onClick={() => setUploadOpen(true)}
              >
                <ArrowUpTrayIcon className="h-4 w-4" /> Upload Surat
              </Button>
            </div>
          </div>

          {/* Main content */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative flex w-full">
                  <Input
                    type="search"
                    label="Cari data..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-20"
                    containerProps={{
                      className: "min-w-0",
                    }}
                    icon={
                      <MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />
                    }
                  />
                </div>

                <Select
                  label="Filter Institusi"
                  value={selectedInstitution}
                  onChange={(value) => setSelectedInstitution(value)}
                  searchable
                >
                  <Option value="">Semua Institusi</Option>
                  {institutions.map((institution) => (
                    <Option key={institution} value={institution}>
                      {institution}
                    </Option>
                  ))}
                </Select>

                <Select
                  label="Filter Tipe"
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                  searchable
                >
                  <Option value="">Semua Tipe</Option>
                  {types.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Table */}
              <Card className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              No
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Nama
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Institusi
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Periode
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Aksi
                            </Typography>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCurrentPageData().map((item, index) => (
                          <tr key={item.id} className="even:bg-gray-100/50">
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.biodata?.nama || "-"}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.institusi || "-"}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {new Date(item.tanggalMulai).toLocaleDateString(
                                  "id-ID"
                                )}{" "}
                                -
                                {new Date(
                                  item.tanggalSelesai
                                ).toLocaleDateString("id-ID")}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-center">
                                <Tooltip
                                  content="Lihat detail"
                                  className="bg-blue-500"
                                >
                                  <IconButton
                                    variant="text"
                                    color="blue"
                                    className="rounded-full"
                                    onClick={() => handleViewClick(item.id)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan="5" className="p-4 text-center">
                              <Typography variant="small" color="blue-gray">
                                No data found
                              </Typography>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <Pagination
                  active={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </Card>
            </>
          )}

          {/* Detail Modal */}
          <Dialog
            size="xl"
            open={isDetailOpen}
            handler={() => setIsDetailOpen(false)}
          >
            <DialogHeader>Detail Peserta Magang</DialogHeader>
            <DialogBody divider className="max-h-[80vh] overflow-y-auto">
              {selectedIntern && (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <UserIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            Nama
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {selectedIntern.User?.Mahasiswas[0]?.name ||
                              selectedIntern.User?.Siswas[0]?.name}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {selectedIntern.type === "siswa"
                              ? "SMK & Jurusan"
                              : "Institusi & Program Studi"}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {selectedIntern.type === "siswa"
                              ? `${selectedIntern.Smk?.name} - ${selectedIntern.Jurusan?.name}`
                              : `${selectedIntern.PerguruanTinggi?.name} - ${selectedIntern.Prodi?.name}`}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <IdentificationIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {selectedIntern.type === "siswa" ? "NISN" : "NIM"}
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {selectedIntern.type === "siswa"
                              ? selectedIntern.User?.Siswas[0]?.nisn
                              : selectedIntern.User?.Mahasiswas[0]?.nim || "-"}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <PhoneIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            No. Telepon
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {(selectedIntern.type === "siswa"
                              ? selectedIntern.User?.Siswas[0]?.no_hp
                              : selectedIntern.User?.Mahasiswas[0]?.no_hp) ||
                              "-"}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CalendarIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            Periode Magang
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {formatDate(selectedIntern.tanggalMulai)} -{" "}
                            {formatDate(selectedIntern.tanggalSelesai)}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            Unit Kerja
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {selectedIntern.UnitKerjaPengajuan?.name}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <ClockIcon className="h-5 w-5 text-blue-gray-500 mt-1" />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            Status
                          </Typography>
                          <Typography
                            variant="small"
                            className="text-blue-gray-500"
                          >
                            {selectedIntern.Status?.name}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="mb-4 pb-2 border-b"
                    >
                      Dokumen Pendukung
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedIntern.Dokumens &&
                        [
                          { label: "Curriculum Vitae", index: 0 },
                          { label: "Kartu Tanda Penduduk", index: 2 },
                          { label: "Surat Pengantar", index: 3 },
                          { label: "Transkrip Nilai", index: 1 },
                        ].map((doc) => (
                          <div key={doc.label} className="flex gap-2">
                            <Button
                              variant="outlined"
                              className="flex items-center gap-2 normal-case flex-1"
                              onClick={() => {
                                handleDocumentModal(
                                  `http://localhost:3000/uploads/${
                                    selectedIntern.Dokumens[doc.index].url
                                  }`,
                                  doc.label
                                );
                              }}
                            >
                              <ArrowDownTrayIcon className="w-4 h-4" />
                              {doc.label}
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Attendance Section */}
                  <div className="space-y-4">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="mb-4 pb-2 border-b"
                    >
                      Data Kehadiran
                    </Typography>
                    <MonthlyAttendanceTable data={selectedIntern.Kehadirans} />
                  </div>
                </div>
              )}
            </DialogBody>
          </Dialog>

          {/* Document Preview Modal */}
          <ModalIframe
            isOpen={isDocumentModalOpen}
            handleOpen={handleDocumentModal}
            pdfUrl={selectedDocument.url}
            title={selectedDocument.title}
          />
        </div>
      </div>
    </div>
  );
};

export default PesertaMagangPage;
