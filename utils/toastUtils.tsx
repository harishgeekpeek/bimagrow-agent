import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { Ionicons } from "@expo/vector-icons";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";

type ToastType = "success" | "error" | "info" | "warning";

export const showAppToast = (
    toast: any,
    type: ToastType,
    title: string,
    description: string
) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <Ionicons name="checkmark-circle" size={22} color="#16a34a" />;
            case "error":
                return <Ionicons name="close-circle" size={22} color="#dc2626" />;
            case "info":
                return <Ionicons name="information-circle" size={22} color="#2563eb" />;
            case "warning":
                return <Ionicons name="alert-circle" size={22} color="#d97706" />;
            default:
                return null;
        }
    };

    const bgColor =
        type === "success"
            ? "bg-green-50 border-green-400"
            : type === "error"
                ? "bg-red-50 border-red-400"
                : type === "warning"
                    ? "bg-yellow-50 border-yellow-400"
                    : "bg-blue-50 border-blue-400";

    toast.show({
        placement: "top",
        duration: 5000,
        render: ({ id }: { id: string }) => (
            <Toast
                nativeID={id}
                className={`flex-row items-center justify-center border-l-4 ${bgColor} border px-6 py-4 rounded-2xl shadow-md w-[92%] max-w-[380px] mx-auto mt-3`}
            >
                {/* <Ionicons name="checkmark-circle" size={22} color="#16a34a" /> */}
                {getIcon()}
                <Divider
                    orientation="vertical"
                    className=" bg-outline-200"
                />
                <ToastTitle className="text-base font-normal text-gray-900 mb-1 flex-wrap">{description}</ToastTitle>
            </Toast>
        ),
    });
};
