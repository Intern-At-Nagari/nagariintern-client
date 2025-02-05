import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input
} from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

const MonthlyAttendanceTable = ({ startDate, endDate }) => {
  const [open, setOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [attendanceDays, setAttendanceDays] = useState({});
  
  const getMonthsBetweenDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];
    
    const currentDate = new Date(start);
    currentDate.setDate(1); // Set to first day of month
    
    while (currentDate <= end) {
      months.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return months;
  };
  
  const months = getMonthsBetweenDates(startDate, endDate);
  
  const handleOpen = (month) => {
    setSelectedMonth(month);
    setOpen(true);
  };
  
  const handleSave = () => {
    setOpen(false);
  };
  
  const formatMonth = (date) => {
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };
  
  return (
    <>
      <Card className="mt-6">
        <CardBody>
          <Typography variant="h6" color="blue-gray" className="mb-6 pb-2 border-b">
            Data Absensi
          </Typography>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                      Bulan
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                      Jumlah Hari Hadir
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-medium leading-none">
                      Action
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {formatMonth(month)}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {attendanceDays[month.toISOString()] || '-'}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        variant="outlined"
                        className="flex items-center gap-2"
                        onClick={() => handleOpen(month)}
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
        <DialogHeader>Input Absensi {selectedMonth && formatMonth(selectedMonth)}</DialogHeader>
        <DialogBody>
          <Input
            type="number"
            label="Jumlah Hari Hadir"
            min="0"
            max="31"
            value={selectedMonth ? (attendanceDays[selectedMonth.toISOString()] || '') : ''}
            onChange={(e) => {
              if (selectedMonth) {
                setAttendanceDays({
                  ...attendanceDays,
                  [selectedMonth.toISOString()]: e.target.value
                });
              }
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpen(false)} className="mr-1">
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