import React from "react";
import ComplaintStatusTable from "../../../components/status/StatusesTable";
import { fetchAllComplaintStatuses } from "../../../apis/auth-apis";

const Page = async () => {
  return (
    <div className="sm:px-20 px-4 sm:my-20">
      <ComplaintStatusTable />
    </div>
  );
};

export default Page;
