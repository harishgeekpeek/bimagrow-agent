import axiosInstance from "./axiosInstance";
import {
  AdvisorRatingResponse,
  SubmitRatingRequest,
  SubmitRatingResponse,
} from "./types";

export const getAdvisorRating = async (): Promise<AdvisorRatingResponse> => {
  const res = await axiosInstance.get(`/api/agentparter/business-ratings`);
  return res.data;
};

export const submitAdvisorRating = async (
  data: SubmitRatingRequest,
): Promise<SubmitRatingResponse> => {
  const res = await axiosInstance.post(`/api/agentparter/advisor-rating`, data);
  return res.data;
};
