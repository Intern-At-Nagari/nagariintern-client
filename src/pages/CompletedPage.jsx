// CompletedPage.js
import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import DocumentList from "./components/DocumentList";

const CompletedPage = ({ applicationStatus }) => {
  return (
    <Card>
      <CardBody>
        <Typography variant="h5" className="mb-4">
          Surat Pengantar Dikirim
        </Typography>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <Typography>
              Proses pengajuan magang telah selesai. 
              Surat pengantar telah dikirim ke email Anda.
            </Typography>
          </div>
          <DocumentList applicationStatus={applicationStatus} />
        </div>
      </CardBody>
    </Card>
  );
};

export default CompletedPage;