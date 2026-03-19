export const formatDate = (dateString?: any) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export const formatToYYYYMMDD = (date: any) => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
export const formatAmount = (amount: any) => {
  if (!amount) return "₹0.00";

  return Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculatePolicyProgress = (
  startDate?: string,
  endDate?: string,
) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const today = new Date().getTime();

  if (today <= start) return 0;
  if (today >= end) return 100;

  const totalDuration = end - start;
  const elapsed = today - start;

  const percentage = (elapsed / totalDuration) * 100;

  return Math.min(Math.max(percentage, 0), 100);
};
