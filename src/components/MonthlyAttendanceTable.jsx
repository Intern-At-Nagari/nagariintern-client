import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MonthlyAttendanceTable = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [attendanceData, setAttendanceData] = useState(data || []);

  const handleOpen = (record) => {
    setSelectedMonth(record);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMonth) return;

    const { bulan, tahun, permintaanId } = selectedMonth;
    const totalKehadiran = selectedMonth.totalKehadiran;

    try {
      await axios.post(
        `${API_BASE_URL}/admin/absensi`,
        {
          permintaanId,
          bulan,
          tahun,
          totalKehadiran,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update the local state with new value
      setAttendanceData(
        attendanceData.map((record) =>
          record.id === selectedMonth.id ? selectedMonth : record
        )
      );

      setOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const formatMonth = (record) => {
    return `${record.bulan} ${record.tahun}`;
  };

  return (
    <>
      <Card className="mt-6">
        <CardBody>
          <Typography
            variant="h6"
            color="blue-gray"
            className="mb-6 pb-2 border-b"
          >
            Data Absensi
          </Typography>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium leading-none"
                    >
                      Bulan
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium leading-none"
                    >
                      Jumlah Hari Hadir
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium leading-none"
                    >
                      Action
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((record, index) => (
                  <tr key={record.id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {formatMonth(record)}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {record.totalKehadiran || "-"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outlined"
                        className="flex items-center gap-2"
                        onClick={() => handleOpen(record)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                        Isi Absensi
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Dialog open={open} handler={() => setOpen(false)} size="xs">
        <DialogHeader>
          Input Absensi {selectedMonth && formatMonth(selectedMonth)}
        </DialogHeader>
        <DialogBody>
          <Input
            type="number"
            label="Jumlah Hari Hadir"
            min="0"
            max="31"
            value={selectedMonth ? selectedMonth.totalKehadiran || "" : ""}
            onChange={(e) => {
              if (selectedMonth) {
                setSelectedMonth({
                  ...selectedMonth,
                  totalKehadiran: e.target.value,
                });
              }
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button variant="gradient" color="blue" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default MonthlyAttendanceTable;