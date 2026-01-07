import { ReactNode } from "react";

interface ModalProps {
    children?: ReactNode;
    onClose?: () => void;
    coords?: { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };
    className?: string;
}

export function Modal({
                          children,
                          onClose,
                          coords,
                          className = "max-w-[800px] max-h-[90vh]"
                      }: ModalProps) {

    const hasCustomCoords = !!coords;

    return (
        <div
            className={`fixed left-0 top-0 h-full w-full bg-[#091e428a] z-50 animate-fade-in 
                ${hasCustomCoords ? "block" : "flex items-center justify-center"}
            `}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-md px-[40px] py-[25px] w-full shadow-xl overflow-y-auto ${className}`}

                style={hasCustomCoords ? { position: "absolute", ...coords } : {}}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}