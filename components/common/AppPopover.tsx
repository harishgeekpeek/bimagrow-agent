import { useState, ReactNode } from "react";
import {
    Popover,
    PopoverArrow,
    PopoverBackdrop,
    PopoverBody,
    PopoverContent,
} from "../ui/popover";

interface AppPopoverProps {
    trigger: (triggerProps: any) => ReactNode;
    children: ReactNode;
    placement?: "top" | "bottom" | "left" | "right";
    size?: "xs" | "sm" | "md" | "lg";
}

export default function AppPopover({
    trigger,
    children,
    placement = "bottom",
    size = "xs",
}: AppPopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            placement={placement}
            size={size}
            trigger={trigger}
        >
            <PopoverBackdrop />
            <PopoverContent className="bg-[#1C1C1C] text-white border-[0px]">
                <PopoverBody>{children}</PopoverBody>
            </PopoverContent>
        </Popover>
    );
}
