import axiosInstance from "./axiosInstance";

export const getLedger = async (
  search: string,
  offset: number,
  limit: number,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentadvisorledger?type=subagent&search=${search}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};
//paginated
// export const getLedgerDetails = async (
//   id: any,
//   search: string,
//   offset?: number,
//   limit?: number,
// ) => {
//   const res = await axiosInstance.get(
//     `/api/agentparter/new-ledger-advisor-detail/${id}?search=${search}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
//   );

//   return res.data;
// };

export const getLedgerDetails = async (id: any, search: string) => {
  const res = await axiosInstance.get(
    `/api/agentparter/new-ledger-advisor-detail/${id}?search=${search}`,
  );

  return res.data;
};

export const downloadStatement = async (data: any) => {
  const res = await axiosInstance.post(
    "/api/agentparter/new-ledger-advisor-Download-Pdf",
    data,
  );
  return res.data;
};
