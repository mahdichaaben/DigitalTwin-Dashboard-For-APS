"use client";
import { useEffect, useState, type ComponentType } from "react";
// import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import api from "@/lib/axiosConfig";

interface Order {
	id: string;
	status: string; // PENDING | IN_PROGRESS | FINISHED | FAILED
	orderType: string;
	createdAt?: string;
}

export default function OrderInfo() {
	const [loading, setLoading] = useState(true);
	const [orders, setOrders] = useState<Order[]>([]);

	const fetchAll = async () => {
		setLoading(true);
		try {
			const res = await api.get<Order[]>("/api/Order");
			setOrders(res.data || []);
		} catch (e) {
			console.error("Failed to load order KPIs", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAll();
	}, []);

	// Order metrics
	const ordersFinished = orders.filter((o) => o.status === "FINISHED").length;
	const ordersInProgress = orders.filter((o) => o.status === "IN_PROGRESS").length;
	const ordersPending = orders.filter((o) => o.status === "PENDING").length;
	const ordersFailed = orders.filter((o) => o.status === "FAILED").length;
	const ordersActive = ordersInProgress + ordersPending;

	return (
		<div className="w-full h-full ">
			<div className="flex h-full flex-col gap-1 sm:gap-2">
				<div className="flex flex-wrap sm:flex-nowrap h-full items-stretch gap-1 sm:gap-2 overflow-x-auto sm:overflow-visible">
					<KpiItem label="Finished" value={ordersFinished} color="text-green-600" bgColor="bg-green-50" />
					<KpiItem label="Active" value={ordersActive} color="text-blue-600" bgColor="bg-blue-50" />
					<KpiItem label="Pending" value={ordersPending} color="text-orange-600" bgColor="bg-orange-50" />
					<KpiItem label="Failed" value={ordersFailed} color="text-red-600" bgColor="bg-red-50" />
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