import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UseCaseCardProps {
  to: string
  title: string
  description: string
  Icon: LucideIcon
  accent: "blue" | "green" | "slate" | "amber" | "purple" | "red" | "indigo" | "emerald"
}

const accentColors = {
  blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-50 border-blue-200",
  green: "bg-gradient-to-br from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-50 border-green-200",
  slate: "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 hover:from-slate-100 hover:to-slate-50 border-slate-200",
  amber: "bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 hover:from-amber-100 hover:to-amber-50 border-amber-200",
  purple: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-50 border-purple-200",
  red: "bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-50 border-red-200",
  indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 hover:from-indigo-100 hover:to-indigo-50 border-indigo-200",
  emerald: "bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 hover:from-emerald-100 hover:to-emerald-50 border-emerald-200",
}

export default function UseCaseCard({ to, title, description, Icon, accent }: UseCaseCardProps) {
  const colorClasses = accentColors[accent]

  return (
    <Link to={to} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 bg-white/80 backdrop-blur-sm hover:bg-white/90">
        <CardHeader>
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-colors ${colorClasses.split(" ")[0]} ${colorClasses.split(" ")[1]}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl group-hover:text-green-600 transition-colors font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
