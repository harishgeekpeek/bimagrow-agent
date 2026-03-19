import axiosInstance from "./axiosInstance";

export const getMotorPolicies = async (
  search: string,
  offset: number,
  limit: number,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentmotorpolicy?search=${search}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};

export const getXMotorPolicies = async (
  search: string,
  policyType: string,
  offset: number,
  limit: number,
) => {
  const res = await axiosInstance.get(
    `/api/agentparter/agentxmotorpolicy?search=${search}&lob=${policyType}&offset=${offset}&limit=${limit}&is_pagination_required=true`,
  );

  return res.data;
};

export const generatePolicyCopyUrl = async (path: any) => {
  const res = await axiosInstance.post(
    "/api/agentparter/business-docs-preview-agent",
    {
      path,
    },
  );
  return res.data;
};
