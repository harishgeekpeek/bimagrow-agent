import axiosInstance from "./axiosInstance";
export const getMotorRenewals = async (
  search: string,
  offset: number,
  limit: number,
  status: string,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentmotorrenewal?search=${search}&expiry_filter=${status}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};

export const getXMotorRenewals = async (
  search: string,
  renewalType: string,
  offset: number,
  limit: number,
  status: string,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentxmotorrenewal?search=${search}&expiry_filter=${status}&lob=${renewalType}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};
