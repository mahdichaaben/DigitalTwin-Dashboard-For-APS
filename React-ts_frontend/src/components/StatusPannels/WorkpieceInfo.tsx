"use client";
import { useEffect, useState, type ComponentType } from "react";
import api from "@/lib/axiosConfig";

interface Workpiece {
    id: string;
    typeName: string;
    state: string;
    createdAt?: string;
}

interface WorkpieceType { id: string; name: string }

export default function WorkpieceInfo() {
    const [loading, setLoading] = useState(true);
    const [workpieces, setWorkpieces] = useState<Workpiece[]>([]);
    const [types, setTypes] = useState<WorkpieceType[]>([]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [wpRes, typesRes] = await Promise.all([
                api.get<Workpiece[]>("/api/Workpiece/all"),
                api.get<WorkpieceType[]>("/api/Workpiece/types"),
            ]);
            setWorkpieces(wpRes.data || []);
            setTypes(typesRes.data || []);
        } catch (e) {
            console.error("Failed to load workpieces KPIs", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Workpieces metrics
    const wpTotal = workpieces.length;
    const wpFree = workpieces.filter((w) => w.state?.includes("FREE")).length;
    const wpStored = workpieces.filter((w) => w.state?.includes("STORED")).length;
    const wpProcessing = workpieces.filter((w) => w.state?.includes("RUNNING")).length;
    const wpTypes = types.length;

    return (
        <div className="w-full h-full ">
            <div className="flex h-full flex-col gap-1 sm:gap-2">
                <div className="flex flex-wrap sm:flex-nowrap h-full items-stretch gap-1 sm:gap-2 overflow-x-auto sm:overflow-visible">
                    <KpiItem label="Free" value={wpFree} color="text-green-600" bgColor="bg-green-50" />
                    <KpiItem label="Stored" value={wpStored} color="text-purple-600" bgColor="bg-purple-50" />
                    <KpiItem label="Processing" value={wpProcessing} color="text-blue-600" bgColor="bg-blue-50" />
                    <KpiItem label="Types" value={wpTypes} color="text-purple-600" bgColor="bg-purple-50" />
                </div>
            </div>
        </div>
    );
}

function KpiItem({
    label,
    value,
    color,
    bgColor,
}: {
    label: string;
    value: number | string;
    color: string;
    bgColor: string;
}) {
    return (
        <div className={`${bgColor} border h-full rounded-md p-3 sm:p-4 transition-all hover:shadow-sm flex-1 flex items-center`}>
            <span className={`text-sm sm:text-base font-semibold ${color} mr-2`}>{value}</span>
            <span className="text-xs sm:text-sm text-gray-600">{label}</span>
        </div>
    );
}