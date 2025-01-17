// DocumentApprovedPage.js
import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import DocumentList from "./components/DocumentList";

const DocumentApprovedPage = ({ applicationStatus }) => {
  return (
    <Card>
      <CardBody>
        <Typography variant="h5" className="mb-4">
          Surat Pernyataan Disetujui
        </Typography>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <Typography>
              Surat pernyataan Anda telah disetujui. 
              Tim kami sedang mempersiapkan surat pengantar magang.
            </Typography>
          </div>
          <DocumentList applicationStatus={applicationStatus} />
        </div>
      </CardBody>
    </Card>
  );
};

export default DocumentApprovedPage;