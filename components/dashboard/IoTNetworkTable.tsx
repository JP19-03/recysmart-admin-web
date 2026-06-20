import { IoTNetworkDevice } from "../../src/schemas";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";

interface IoTNetworkTableProps {
  devices: IoTNetworkDevice[];
  isLoading?: boolean;
  onAddBin?: () => void;
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-slate-100 rounded w-48"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4 w-64">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 bg-slate-200 rounded w-8"></div>
          <div className="h-3 bg-slate-200 rounded w-12"></div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-slate-200 rounded w-4"></div>
      </td>
    </tr>
  );
}

export function IoTNetworkTable({
  devices,
  isLoading = false,
  onAddBin,
}: IoTNetworkTableProps) {
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} mins ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hrs ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} days ago`;
    } catch (e) {
      return dateString;
    }
  };

  const getCapacityStyling = (percentage: number, status: string) => {
    if (status === "NEEDS_PICKUP" || percentage >= 90) {
      return {
        barColor: "bg-red-500",
        textColor: "text-red-600 font-bold",
        label: "Needs Pickup",
      };
    }
    if (status === "WARNING" || percentage >= 75) {
      return {
        barColor: "bg-amber-500",
        textColor: "text-amber-600 font-bold",
        label: "Warning",
      };
    }
    return {
      barColor: "bg-blue-500",
      textColor: "text-slate-500",
      label: "Normal",
    };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            IoT Edge Network Status
          </h3>
          <p className="text-sm text-slate-500">
            Real-time monitoring of all deployed ESP32 units.
          </p>
        </div>
        <Button
          onClick={onAddBin}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-1 shrink-0" /> Add New Bin
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-100">
              <th className="px-6 py-4 font-bold">Bin ID / Location</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Capacity Level</th>
              <th className="px-6 py-4 font-bold">Last AI Scan</th>
              <th className="px-6 py-4 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {isLoading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : devices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No smart bins found matching your search.
                </td>
              </tr>
            ) : (
              devices.map((device) => {
                const isOnline = device.status === "ONLINE";
                const capacityStyle = getCapacityStyling(
                  device.capacityPercentage,
                  device.capacityStatus,
                );
                return (
                  <tr
                    key={device.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{device.id}</p>
                      <p className="text-xs text-slate-500">
                        {device.location}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isOnline
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isOnline
                              ? "bg-green-500 animate-pulse"
                              : "bg-slate-400"
                          }`}
                        ></span>
                        {isOnline ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-64">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={capacityStyle.textColor}>
                          {device.capacityPercentage}%
                        </span>
                        <span className={capacityStyle.textColor}>
                          {capacityStyle.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`${capacityStyle.barColor} h-2 rounded-full`}
                          style={{ width: `${device.capacityPercentage}%` }}
                        ></div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 ${isOnline ? "text-slate-500" : "text-red-400 font-medium"}`}
                    >
                      {formatRelativeTime(device.lastAiScanAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
