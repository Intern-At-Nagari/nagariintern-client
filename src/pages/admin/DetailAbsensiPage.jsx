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
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";

import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DetailAbsensiPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const { bulan, tahun } = useParams();
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");

        const response = await axios.get(
          `http://localhost:3000/admin/absensi/${bulan}/${tahun}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const responseData = response.data.data || [];
        setTotal(response.data.total || 0);
        setData(responseData);
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

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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
        `http://localhost:3000/admin/absensi/${selectedAttendance.id}`,
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
              <div className="mb-4 flex justify-between items-center">
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
                              kode cabang
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
                                {item.kehadiran || "Belum Absen"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailAbsensiPage;
