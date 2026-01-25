import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    children?: ReactNode;
    onClose?: () => void;
    coords?: { top?: number | string; left?: number | string; right?: number | string; bottom?: number | string };
    className?: string;
    zIndex?: number;
}

export function Modal({
                          children,
                          onClose,
                          coords,
                          className = "max-w-[800px] max-h-[90vh]",
                          zIndex = 50
                      }: ModalProps) {

    const hasCustomCoords = !!coords;

    return createPortal(
        <div
            className={`fixed left-0 top-0 h-full w-full bg-[#091e428a] animate-fade-in 
                ${hasCustomCoords ? "block" : "flex items-center justify-center"}
            `}
            style={{ zIndex: zIndex }}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-md px-[40px] py-[25px] w-full shadow-xl overflow-y-auto ${className}`}

                style={hasCustomCoords ? { position: "absolute", ...coords } : {}}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}