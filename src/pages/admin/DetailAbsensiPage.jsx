import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";
import { toast } from "react-toastify";
import UploadModal from "../../components/UploadModal";

import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailAbsensiPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [rekapInfo, setRekapInfo] = useState(null);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { bulan, tahun } = useParams();
  const navigate = useNavigate();
  const [printLoading, setPrintLoading] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintData, setSelectedPrintData] = useState(null);
  const [printForm, setPrintForm] = useState({
    tempat: "",
    nama_pimpinan: "",
    jabatan: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `${API_BASE_URL}/admin/absensi/${bulan}/${tahun}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Response data:", response.data);

        const responseData = response.data.data || [];
        setTotal(response.data.total || 0);
        setData(responseData);
        setRekapInfo(response.data.rekapKehadiran || null);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bulan, tahun]);

  const handleViewPdf = () => {
    if (rekapInfo?.url) {
      window.open(`${API_BASE_URL}/public/${rekapInfo.url}`, "_blank");
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate total allowance
  const totalAllowance = filteredData.reduce((sum, item) => {
    return sum + (item.kehadiran || 0) * 19000;
  }, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [newAttendance, setNewAttendance] = useState("");

  const handleEditAttendance = (id) => {
    console.log("Edit attendance:", id);
    const attendance = data.find((item) => item.id === id);
    setSelectedAttendance(attendance);
    setNewAttendance(attendance.kehadiran?.toString() || "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttendance(null);
    setNewAttendance("");
  };

  const handleSaveAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/admin/absensi/${selectedAttendance.id}`,
        { kehadiran: parseInt(newAttendance) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local data
      setData(
        data.map((item) =>
          item.id === selectedAttendance.id
            ? { ...item, kehadiran: parseInt(newAttendance) }
            : item
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setError("Failed to update attendance");
    }
  };

  const handleUpload = async (file) => {
    setUploadLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("fileRekap", file);

      const response = await axios.post(
        `${API_BASE_URL}/admin/absensi/${bulan}/${tahun}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        toast.success("Surat balasan berhasil dikirim!");
        setUploadOpen(false);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal mengirim surat balasan!"
      );
      console.error("Error sending letter:", err);
    } finally {
      setUploadLoading(false);
      //refresh
      window.location.reload();
    }
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
              Detail Absensi {bulan} {tahun}
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
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex w-full max-w-[24rem]">
                    <button
                      onClick={() => navigate(-1)}
                      className="mr-8 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <ArrowLeftIcon className="h-5 w-5" />
                      <Typography variant="button">Kembali</Typography>
                    </button>

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
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Typography className="font-semibold text-blue-900">
                      Total Uang Saku: Rp {totalAllowance.toLocaleString()}
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    color="blue"
                    className="flex items-center gap-2"
                    onClick={() => handlePrint(bulan, tahun)}
                  >
                    <PrinterIcon className="h-4 w-4" /> Cetak Rekapitulasi
                  </Button>
                  <Button
                    color="green"
                    className="flex items-center gap-2"
                    onClick={() => setUploadOpen(true)}
                  >
                    <ArrowUpTrayIcon className="h-4 w-4" /> Upload Rekapitulasi
                  </Button>
                </div>
              </div>

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
                              Kehadiran
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Tarif uang saku
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              Jumlah
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              No.rekening
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
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
                                {item.nama}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.institusi}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.kehadiran === null
                                  ? "belum di input"
                                  : item.kehadiran}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {Number(19000).toLocaleString()}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {(item.kehadiran * 19000).toLocaleString()}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.rekening}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleEditAttendance(item.id)}
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                                <Typography variant="small">Edit</Typography>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredData.length === 0 && (
                          <tr>
                            <td colSpan="9" className="p-4 text-center">
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
              <div className="mt-6 bg-white rounded-lg p-4 shadow">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Status Upload Rekapitulasi
                </Typography>
                {rekapInfo ? (
                  <div className="space-y-4">
                    <div>
                      <Typography color="blue-gray">
                        Diupload oleh: {rekapInfo.karyawan?.nama || "Unknown"}
                      </Typography>
                      <Typography color="blue-gray">
                        Tanggal upload:{" "}
                        {new Date(rekapInfo.updatedAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </div>
                    <div className="w-full aspect-[16/9] border border-gray-200 rounded-lg overflow-hidden">
                      <iframe
                        src={`${API_BASE_URL}/uploads/${rekapInfo.url}`}
                        className="w-full h-full"
                        title="Rekap PDF"
                      />
                    </div>
                  </div>
                ) : (
                  <Typography color="gray">
                    Rekapitulasi belum diupload
                  </Typography>
                )}
              </div>
              <Dialog
                open={isPrintModalOpen}
                handler={handlePrintClose}
                size="sm"
              >
                <DialogHeader>Cetak Rekap Absensi</DialogHeader>
                <DialogBody>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="text"
                      label="Tempat"
                      value={printForm.tempat}
                      onChange={(e) =>
                        setPrintForm((prev) => ({
                          ...prev,
                          tempat: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="text"
                      label="Nama Pimpinan"
                      value={printForm.nama_pimpinan}
                      onChange={(e) =>
                        setPrintForm((prev) => ({
                          ...prev,
                          nama_pimpinan: e.target.value,
                        }))
                      }
                    />
                    <Input
                      type="text"
                      label="Jabatan"
                      value={printForm.jabatan}
                      onChange={(e) =>
                        setPrintForm((prev) => ({
                          ...prev,
                          jabatan: e.target.value,
                        }))
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
              <Dialog open={isModalOpen} handler={handleCloseModal} size="xs">
                <DialogHeader>Input Absensi</DialogHeader>
                <DialogBody>
                  <Input
                    type="number"
                    label="Jumlah Hari Hadir"
                    min="0"
                    max="31"
                    value={newAttendance}
                    onChange={(e) => setNewAttendance(e.target.value)}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button
                    variant="text"
                    color="red"
                    onClick={handleCloseModal}
                    className="mr-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleSaveAttendance}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </Dialog>
              <UploadModal
                open={uploadOpen}
                onClose={() => setUploadOpen(false)}
                onSubmit={handleUpload}
                isLoading={uploadLoading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailAbsensiPage;
