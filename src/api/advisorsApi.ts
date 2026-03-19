import axiosInstance from "./axiosInstance";


export const getAdvisors = async (search: string, offset: number, limit: number) => {
  const res = await axiosInstance.get(
    `/api/clientparter/clientadvisor?search=${search}&offset=${offset}&limit=${limit}&is_pagination_required=true`
  );

  return res.data;
};
