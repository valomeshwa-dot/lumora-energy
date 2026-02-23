import React, { type ReactNode } from "react";
import { X, Trash2, Edit, Check, XCircle } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/5 bg-gray-800/50">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

interface TableProps {
    headers: string[];
    children: ReactNode;
}

export const AdminTable = ({ headers, children }: TableProps) => (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-gray-800/50 shadow-xl">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-900/50 border-b border-white/5">
                    {headers.map((header, i) => (
                        <th key={i} className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {header}
                        </th>
                    ))}
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
);

export const ActionButton = ({
    icon: Icon,
    onClick,
    variant = 'default',
    label
}: {
    icon: any,
    onClick: () => void,
    variant?: 'default' | 'danger' | 'success',
    label?: string
}) => {
    const variants = {
        default: "text-gray-400 hover:text-white hover:bg-white/5",
        danger: "text-red-400 hover:text-red-300 hover:bg-red-400/10",
        success: "text-green-400 hover:text-green-300 hover:bg-green-400/10",
    };

    return (
        <button
            onClick={onClick}
            title={label}
            className={`p-2 rounded-lg transition-all duration-200 ${variants[variant]}`}
        >
            <Icon size={18} />
        </button>
    );
};
