import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axiosConfig";
import { AlertTriangle, Bell, Box, Cpu, RefreshCw, X } from "lucide-react";

type AlertStatus = "firing" | "resolved" | string;

interface AlertItem {
	alertId: string;
	digitalModuleId: string;
	alertType: string;
	sensorId: string;
	description?: string;
	startedAt: string;
	endedAt: string | null;
	status: AlertStatus;
	summary: string;

}

function parseDateSafe(value: string | null | undefined): Date | null {
	if (!value) return null;
	if (value === "-infinity") return null;
	const normalized = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
	const d = new Date(normalized);
	return isNaN(d.getTime()) ? null : d;
}

function timeAgo(date: Date | null): string {
	if (!date) return "—";
	const diff = Math.max(0, Date.now() - date.getTime());
	const s = Math.floor(diff / 1000);
	if (s < 60) return `${s}s ago`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}

export default function AlertTable() {
	const [alerts, setAlerts] = useState<AlertItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selected, setSelected] = useState<AlertItem | null>(null);

	// filters
	const [sensorId, setSensorId] = useState<string>("");
	const [digitalModuleId, setDigitalModuleId] = useState<string>("");
	const [status, setStatus] = useState<string>("");

	// pagination
	const [page, setPage] = useState(1);
	const pageSize = 12;

		const fetchAlerts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const { data } = await api.get<AlertItem[]>("/api/Alert/filter", {
				params: {
					sensorId: sensorId || undefined,
					digitalModuleId: digitalModuleId || undefined,
					status: status || undefined,
				},
			});
			const sorted = [...data].sort((a, b) => {
				const da = parseDateSafe(a.startedAt)?.getTime() ?? 0;
				const db = parseDateSafe(b.startedAt)?.getTime() ?? 0;
				return db - da;
			});
			setAlerts(sorted);
			setPage(1); // reset to first page on new fetch
		} catch (e: any) {
			setError(e?.message || "Failed to load alerts");
		} finally {
			setLoading(false);
		}
		}, [sensorId, digitalModuleId, status]);

		useEffect(() => {
			fetchAlerts();
			const id = setInterval(fetchAlerts, 30000);
			return () => clearInterval(id);
		}, [fetchAlerts]);

	// derived
	const totalPages = Math.max(1, Math.ceil(alerts.length / pageSize));
	const start = (page - 1) * pageSize;
	const pageItems = alerts.slice(start, start + pageSize);

	return (
		<div className="p-4">
			{/* Enhanced Filters Section */}
				<div className="bg-gray-50 rounded-lg p-2 mb-4 border border-gray-200">

					<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
						<div>
							<label className="block text-[11px] font-medium text-gray-500 mb-0.5">Sensor</label>
							<input
								className="w-full h-8 border border-gray-200 rounded-md px-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-colors"
								placeholder="Sensor ID"
								value={sensorId}
								onChange={(e) => setSensorId(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-[11px] font-medium text-gray-500 mb-0.5">Module</label>
							<input
								className="w-full h-8 border border-gray-200 rounded-md px-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent transition-colors"
								placeholder="Module ID"
								value={digitalModuleId}
								onChange={(e) => setDigitalModuleId(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-[11px] font-medium text-gray-500 mb-0.5">Status</label>
							<select
								className="w-full h-8 border border-gray-200 rounded-md px-2 text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent bg-white transition-colors"
								value={status}
								onChange={(e) => setStatus(e.target.value)}
							>
								<option value="">All</option>
								<option value="firing">🔴 Firing</option>
								<option value="resolved">🟢 Resolved</option>
							</select>
						</div>
						<div className="flex items-end justify-end">
							<button
								onClick={fetchAlerts}
								disabled={loading}
								className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-100 focus:outline-none transition-colors"
								title="Refresh alerts"
							>
								<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-400" : "text-blue-600"}`} />
							</button>
						</div>
						</div>
			
				{/* Active Filters Display */}
				{(sensorId || digitalModuleId || status) && (
					<div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
						<span className="text-xs font-medium text-gray-600">Active filters:</span>
						{sensorId && (
							<span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
								Sensor: {sensorId}
								<button onClick={() => setSensorId("")} className="ml-1 hover:text-blue-600">
									<X className="w-3 h-3" />
								</button>
							</span>
						)}
						{digitalModuleId && (
							<span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
								Module: {digitalModuleId}
								<button onClick={() => setDigitalModuleId("")} className="ml-1 hover:text-purple-600">
									<X className="w-3 h-3" />
								</button>
							</span>
						)}
						{status && (
							<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
								Status: {status}
								<button onClick={() => setStatus("")} className="ml-1 hover:text-green-600">
									<X className="w-3 h-3" />
								</button>
							</span>
						)}
						<button
							onClick={() => {
								setSensorId("");
								setDigitalModuleId("");
								setStatus("");
							}}
							className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
						>
							Clear all
						</button>
					</div>
				)}
			</div>

			{/* Results Summary */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					<p className="text-sm text-gray-700">
						<span className="font-semibold">{alerts.length}</span> alerts found
					</p>
					{alerts.length > 0 && (
						<div className="flex items-center gap-2 text-xs">
							<span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
								<AlertTriangle className="w-3 h-3" />
								{alerts.filter(a => a.status?.toLowerCase() === 'firing').length} firing
							</span>
							<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
								<X className="w-3 h-3" />
								{alerts.filter(a => a.status?.toLowerCase() === 'resolved').length} resolved
							</span>
						</div>
					)}
				</div>
				<div className="text-xs text-gray-500">
					Showing {Math.min((page - 1) * pageSize + 1, alerts.length)} - {Math.min(page * pageSize, alerts.length)} of {alerts.length}
				</div>
			</div>

			{/* Enhanced Table */}
			<div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 bg-white">
				<table className="min-w-full text-sm">
					<thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Module</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sensor</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Started</th>
							{/* Duration column removed */}
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Summary</th>
							<th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{loading ? (
							<tr>
								<td colSpan={7} className="px-4 py-12 text-center">
									<div className="flex flex-col items-center gap-3">
										<div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
										<span className="text-gray-500">Loading alerts...</span>
									</div>
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan={7} className="px-4 py-8 text-center">
									<div className="flex flex-col items-center gap-3">
										<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
											<AlertTriangle className="w-6 h-6 text-red-600" />
										</div>
										<div className="text-red-600 font-medium">Error loading alerts</div>
										<div className="text-sm text-gray-500">{error}</div>
										<button
											onClick={fetchAlerts}
											className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
										>
											Try Again
										</button>
									</div>
								</td>
							</tr>
						) : pageItems.length === 0 ? (
							<tr>
								<td colSpan={7} className="px-4 py-12 text-center">
									<div className="flex flex-col items-center gap-3">
										<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
											<Bell className="w-6 h-6 text-gray-400" />
										</div>
										<div className="text-gray-500 font-medium">No alerts found</div>
										<div className="text-sm text-gray-400">Try adjusting your filters or check back later</div>
									</div>
								</td>
							</tr>
						) : (
							pageItems.map((a, index) => {
								const started = parseDateSafe(a.startedAt);
								const ended = parseDateSafe(a.endedAt || undefined);
								const isFiring = a.status?.toLowerCase() === "firing";
								
								return (
									<tr key={a.alertId} className={`hover:bg-gray-50 transition-colors ${isFiring ? 'bg-red-50/30' : ''}`}>
										<td className="px-4 py-3">
											<span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full ${
												isFiring 
													? "bg-red-100 text-red-800 border border-red-200" 
													: "bg-green-100 text-green-800 border border-green-200"
											}`}>
												{isFiring ? (
													<>
														<div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
														Firing
													</>
												) : (
													<>
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														Resolved
													</>
												)}
											</span>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Box className="w-4 h-4 text-gray-400" />
												<span className="font-mono text-xs text-gray-800">{a.digitalModuleId}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<Cpu className="w-4 h-4 text-gray-400" />
												<span className="font-mono text-xs text-gray-800">{a.sensorId}</span>
											</div>
										</td>
										<td className="px-4 py-3">
											<span className="text-xs text-gray-600">{a.alertType}</span>
										</td>
										<td className="px-4 py-3">
											<div className="text-xs text-gray-600">
												<div>{started ? started.toLocaleDateString() : '—'}</div>
												<div className="text-gray-500">{started ? started.toLocaleTimeString() : a.startedAt}</div>
											</div>
										</td>
										{/* Duration cell removed, table cell count matches header */}
										<td className="px-4 py-3">
											<div className="max-w-xs truncate text-sm text-gray-900" title={a.summary}>
												{a.summary}
											</div>
										</td>
										<td className="px-4 py-3">
											<button 
												className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
												onClick={() => setSelected(a)}
											>
												<Bell className="w-3 h-3" />
												View
											</button>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Enhanced Pagination */}
			{alerts.length > 0 && (
				<div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 border-t border-gray-200">
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-700">
							Showing <span className="font-medium">{Math.min((page - 1) * pageSize + 1, alerts.length)}</span> to{' '}
							<span className="font-medium">{Math.min(page * pageSize, alerts.length)}</span> of{' '}
							<span className="font-medium">{alerts.length}</span> results
						</span>
					</div>
					<div className="flex items-center gap-2">
						<button
							className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={page === 1}
							onClick={() => setPage((p) => p - 1)}
						>
							Previous
						</button>
						<div className="flex items-center gap-1">
							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
								return (
									<button
										key={pageNum}
										onClick={() => setPage(pageNum)}
										className={`px-3 py-2 text-sm font-medium rounded-md ${
											page === pageNum
												? 'bg-blue-600 text-white'
												: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
										}`}
									>
										{pageNum}
									</button>
								);
							})}
						</div>
						<button
							className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={page === totalPages}
							onClick={() => setPage((p) => p + 1)}
						>
							Next
						</button>
					</div>
				</div>
			)}

			{/* Details Modal */}
			{selected && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
					<div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200">
						<div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
							<div className="flex items-center gap-2">
								<Bell className="w-4 h-4 text-green-500" />
								<h4 className="text-sm font-semibold text-slate-900">Alert</h4>
							</div>
							<button className="p-1 rounded hover:bg-green-50 hover:text-green-600" aria-label="Close" onClick={() => setSelected(null)}>
								<X className="w-4 h-4" />
							</button>
						</div>
						<div className="p-4 space-y-3">
							<p className="text-sm font-medium text-slate-900">{selected.summary}</p>
							{selected.description && <p className="text-sm text-slate-700 leading-relaxed">{selected.description}</p>}
							<div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50"><Box className="w-3 h-3" /> {selected.digitalModuleId}</span>
								<span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50"><Cpu className="w-3 h-3" /> {selected.sensorId}</span>
								<span className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50">{selected.alertType}</span>
							</div>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs text-slate-600">
								<div>
									<span className="text-slate-500">Status:</span> <span className="font-medium">{selected.status}</span>
								</div>
								<div>
									<span className="text-slate-500">Started:</span> <span>{parseDateSafe(selected.startedAt)?.toLocaleString() || selected.startedAt}</span>
								</div>
								<div>
									<span className="text-slate-500">Ended:</span> <span>{parseDateSafe(selected.endedAt || undefined)?.toLocaleString() || (selected.endedAt ?? "—")}</span>
								</div>
								<div className="col-span-full">
									<span className="text-slate-500">Alert ID:</span> <span className="font-mono break-all">{selected.alertId}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

