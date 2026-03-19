import axiosInstance from "./axiosInstance";
export const getMotorRenewals = async (
  search: string,
  offset: number,
  limit: number,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentmotorrenewal?search=${search}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};

export const getXMotorRenewals = async (
  search: string,
  renewalType: string,
  offset: number,
  limit: number,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentxmotorrenewal?search=${search}&lob=${renewalType}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};
