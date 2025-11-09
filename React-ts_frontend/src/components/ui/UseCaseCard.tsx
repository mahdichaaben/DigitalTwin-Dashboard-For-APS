import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  to: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  accent?: "blue" | "green" | "amber" | "purple" | "slate";
};

const accentClasses: Record<NonNullable<Props["accent"]>, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  green: "bg-green-50 text-green-700 border-green-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
  slate: "bg-slate-50 text-slate-700 border-slate-100",
};

export default function UseCaseCard({ to, title, description, Icon, accent = "slate" }: Props) {
  return (
    <Link to={to} className="group focus:outline-none">
      <div className="h-full rounded-lg border border-surface-border bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-300">
        <div className="flex items-center gap-3 mb-2">
          <div className={`inline-flex items-center justify-center w-8 h-8 rounded ${accentClasses[accent]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-xs text-gray-600 leading-snug line-clamp-2">{description}</p>
        <div className="mt-3 text-xs font-medium text-blue-700 group-hover:underline">Open</div>
      </div>
    </Link>
  );
}
