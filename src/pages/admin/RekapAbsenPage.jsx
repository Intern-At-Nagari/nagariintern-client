import React, { useState, useEffect } from "react";
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
  DialogFooter,
} from "@material-tailwind/react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const RekapAbsenPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [printLoading, setPrintLoading] = useState(false);
  
  // Print modal states
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintData, setSelectedPrintData] = useState(null);
  const [printForm, setPrintForm] = useState({
    tempat: "",
    nama_pimpinan: "",
    jabatan: "",
  });



  const itemsPerPage = 10;

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - 2 + i).toString()
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${API_BASE_URL}/admin/absensi`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const responseData = response.data.data || response.data;
        console.log(responseData);
        setData(Array.isArray(responseData) ? responseData : []);
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

  const filteredData = data.filter((item) => {
    const matchesSearch = [item.tahun || ""]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesYear = !selectedYear || item.tahun == selectedYear;
    return matchesSearch && matchesYear;
  });

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrint = (bulan, tahun) => {
    setSelectedPrintData({ bulan, tahun });
    setIsPrintModalOpen(true);
  };

  const handlePrintClose = () => {
    setIsPrintModalOpen(false);
    setSelectedPrintData(null);
    setPrintForm({
      tempat: "",
      nama_pimpinan: "",
      jabatan: "",
    });
  };

  const handlePrintSubmit = async () => {
    if (!selectedPrintData) return;
    
    setPrintLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { bulan, tahun } = selectedPrintData;
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/absensi/${bulan}/${tahun}/print`,
        printForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rekap_absensi_${bulan}_${tahun}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Berhasil mencetak rekap!");
      handlePrintClose();
    } catch (err) {
      console.error("Error printing document:", err);
      toast.error(err.response?.data?.message || "Gagal mencetak rekap!");
    } finally {
      setPrintLoading(false);
    }
  };

  const handleViewClick = (bulan, tahun) => {
    navigate(`/admin/absensi/${bulan}/${tahun}`);
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
              Rekap Absensi Bulanan
            </Typography>
          </div>

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
              <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                

                <Select
                  label="Tahun"
                  value={selectedYear}
                  onChange={(value) => setSelectedYear(value)}
                >
                  <Option value="">Semua Tahun</Option>
                  {years.map((year) => (
                    <Option key={year} value={year}>
                      {year}
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
                              Bulan/Tahun
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Siswa/Mahasiswa
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Total Kehadiran
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
                          <tr key={index} className="even:bg-gray-100/50">
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.bulan} {item.tahun}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.peserta}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.totalKehadiran}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.status}
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
                                    onClick={() =>
                                      handleViewClick(item.bulan, item.tahun)
                                    }
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip
                                  content="Cetak rekap"
                                  className="bg-green-500"
                                >
                                  <IconButton
                                    variant="text"
                                    color="green"
                                    className="rounded-full"
                                    onClick={() => handlePrint(item.bulan, item.tahun)}
                                  >
                                    <PrinterIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-4 text-center">
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
        <Dialog open={isPrintModalOpen} handler={handlePrintClose} size="sm">
          <DialogHeader>Cetak Rekap Absensi</DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                label="Tempat"
                value={printForm.tempat}
                onChange={(e) =>
                  setPrintForm((prev) => ({ ...prev, tempat: e.target.value }))
                }
              />
              <Input
                type="text"
                label="Nama Pimpinan"
                value={printForm.nama_pimpinan}
                onChange={(e) =>
                  setPrintForm((prev) => ({ ...prev, nama_pimpinan: e.target.value }))
                }
              />
              <Input
                type="text"
                label="Jabatan"
                value={printForm.jabatan}
                onChange={(e) =>
                  setPrintForm((prev) => ({ ...prev, jabatan: e.target.value }))
                }
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handlePrintClose}
              className="mr-1"
            >
              <span>Batal</span>
            </Button>
            <Button
              variant="gradient"
              color="blue"
              onClick={handlePrintSubmit}
              disabled={printLoading}
            >
              {printLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : (
                <span>Cetak</span>
              )}
            </Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
};

export default RekapAbsenPage;
