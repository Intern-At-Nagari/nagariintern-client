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
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const navigate = useNavigate();


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

        const response = await axios.get(`${API_BASE_URL}/admin/intern`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);

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
      ///admin/peserta-magang/
      navigate(`/admin/peserta-magang/${id}`);

    } catch (err) {
      console.error("Error fetching intern details:", err);
    }
  };

 

  // Rest of the filtering logic remains the same
  const filteredData = data.filter((item) => {
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
          <div className="pt-4   flex justify-between items-center mb-4">
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
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Status
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
                              <Typography variant="small" color="blue-gray">
                                {item.status.name || "-"}
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
        </div>
      </div>
    </div>
  );
};

export default PesertaMagangPage;
