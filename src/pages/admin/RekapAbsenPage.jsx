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
} from "@material-tailwind/react";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../../layout/Sidebar";
import Pagination from "../../components/Pagination";
import axios from "axios";

const RekapAbsenPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedType, setSelectedType] = useState("");

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
    { value: "12", label: "Desember" }
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

        const response = await axios.get("http://localhost:3000/admin/attendance/monthly", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const responseData = response.data.data || response.data;
        setData(Array.isArray(responseData) ? responseData : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = [
      item.nama || "",
      item.type || "",
      item.status || "",
      item.bulan || "",
      item.tahun || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || item.type === selectedType;
    const matchesMonth = !selectedMonth || item.bulan === selectedMonth;
    const matchesYear = !selectedYear || item.tahun === selectedYear;

    return matchesSearch && matchesType && matchesMonth && matchesYear;
  });

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePrint = (id) => {
    // Implement print functionality
    console.log("Printing attendance for ID:", id);
  };

  return (
    <div className="lg:ml-80 min-h-screen bg-blue-gray-50">
      <Sidebar />
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="pt-4 flex justify-between items-center mb-4">
            <Typography variant="h3" className="mb-8 font-bold text-gray-800 text-2xl md:text-3xl">
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
                    icon={<MagnifyingGlassIcon className="h-5 w-5 text-blue-gray-500" />}
                  />
                </div>

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

                <Select
                  label="Bulan"
                  value={selectedMonth}
                  onChange={(value) => setSelectedMonth(value)}
                >
                  <Option value="">Semua Bulan</Option>
                  {months.map((month) => (
                    <Option key={month.value} value={month.value}>
                      {month.label}
                    </Option>
                  ))}
                </Select>

                <Select
                  label="Tipe"
                  value={selectedType}
                  onChange={(value) => setSelectedType(value)}
                >
                  <Option value="">Semua Tipe</Option>
                  <Option value="siswa">Siswa</Option>
                  <Option value="mahasiswa">Mahasiswa</Option>
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
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              No
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              Bulan
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              Tahun
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              Siswa/Mahasiswa
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              Status
                            </Typography>
                          </th>
                          <th className="border-b border-blue-gray-100 bg-gray-100 p-4 text-center">
                            <Typography variant="small" color="blue-gray" className="font-semibold">
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
                                {months.find(m => m.value === item.bulan)?.label || "-"}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.tahun}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.nama}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <Typography variant="small" color="blue-gray">
                                {item.status}
                              </Typography>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 justify-center">
                                <Tooltip content="Lihat detail" className="bg-blue-500">
                                  <IconButton
                                    variant="text"
                                    color="blue"
                                    className="rounded-full"
                                    onClick={() => handleViewClick(item.id)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip content="Cetak rekap" className="bg-green-500">
                                  <IconButton
                                    variant="text"
                                    color="green"
                                    className="rounded-full"
                                    onClick={() => handlePrint(item.id)}
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
      </div>
    </div>
  );
};

export default RekapAbsenPage;