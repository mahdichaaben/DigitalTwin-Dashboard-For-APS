"use client"

import { useEffect, useRef, useState } from "react"
import { Factory, Cpu, Activity, Zap } from "lucide-react"

export default function DigitalTwin() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation variables
    let animationFrame: number
    let time = 0

    // Module positions (representing factory layout)
    const modules = [
      { x: 0.15, y: 0.3, label: "Incoming Goods", color: "#3b82f6", active: true },
      { x: 0.35, y: 0.3, label: "Warehouse", color: "#8b5cf6", active: true },
      { x: 0.55, y: 0.3, label: "Drill Station", color: "#f59e0b", active: true },
      { x: 0.75, y: 0.3, label: "Mill Station", color: "#10b981", active: false },
      { x: 0.15, y: 0.7, label: "QA with AI", color: "#ef4444", active: true },
      { x: 0.35, y: 0.7, label: "AGV Fleet", color: "#6366f1", active: true },
      { x: 0.55, y: 0.7, label: "Charging", color: "#14b8a6", active: false },
      { x: 0.75, y: 0.7, label: "Outgoing Goods", color: "#3b82f6", active: true },
    ]

    const drawModule = (x: number, y: number, label: string, color: string, active: boolean, pulse: number) => {
      const centerX = x * canvas.width
      const centerY = y * canvas.height
      const size = 60

      // Draw connection lines
      ctx.strokeStyle = active ? `${color}40` : "#e5e7eb"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      // Draw module box
      ctx.fillStyle = active ? `${color}20` : "#f9fafb"
      ctx.strokeStyle = active ? color : "#d1d5db"
      ctx.lineWidth = 3
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.roundRect(centerX - size / 2, centerY - size / 2, size, size, 8)
      ctx.fill()
      ctx.stroke()

      // Draw pulse effect for active modules
      if (active) {
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.3 + Math.sin(pulse) * 0.3
        ctx.beginPath()
        ctx.arc(centerX, centerY, size / 2 + 5 + Math.sin(pulse) * 5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Draw status indicator
      ctx.fillStyle = active ? "#10b981" : "#6b7280"
      ctx.beginPath()
      ctx.arc(centerX + size / 2 - 8, centerY - size / 2 + 8, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px system-ui, -apple-system, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, centerX, centerY + size / 2 + 20)
    }

    const drawConnections = () => {
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])

      // Draw horizontal connections
      for (let i = 0; i < 4; i++) {
        const y = 0.3 * canvas.height
        ctx.beginPath()
        ctx.moveTo((0.15 + i * 0.2) * canvas.width + 30, y)
        ctx.lineTo((0.35 + i * 0.2) * canvas.width - 30, y)
        ctx.stroke()
      }

      for (let i = 0; i < 4; i++) {
        const y = 0.7 * canvas.height
        ctx.beginPath()
        ctx.moveTo((0.15 + i * 0.2) * canvas.width + 30, y)
        ctx.lineTo((0.35 + i * 0.2) * canvas.width - 30, y)
        ctx.stroke()
      }

      // Draw vertical connections
      for (let i = 0; i < 4; i++) {
        const x = (0.15 + i * 0.2) * canvas.width
        ctx.beginPath()
        ctx.moveTo(x, 0.3 * canvas.height + 30)
        ctx.lineTo(x, 0.7 * canvas.height - 30)
        ctx.stroke()
      }

      ctx.setLineDash([])
    }

    const animate = () => {
      if (!isAnimating) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background grid
      ctx.strokeStyle = "#f3f4f6"
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(canvas.width, i)
        ctx.stroke()
      }

      // Draw connections
      drawConnections()

      // Draw modules
      modules.forEach((module) => {
        drawModule(module.x, module.y, module.label, module.color, module.active, time)
      })

      // Draw AGV (moving dot)
      const agvX = 0.15 + (Math.sin(time * 0.5) * 0.5 + 0.5) * 0.6
      const agvY = 0.3 + (Math.cos(time * 0.3) * 0.5 + 0.5) * 0.4
      ctx.fillStyle = "#6366f1"
      ctx.beginPath()
      ctx.arc(agvX * canvas.width, agvY * canvas.height, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      time += 0.02
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [isAnimating])

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-green-50 via-blue-50 to-slate-100">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-4 shadow-xl border border-green-100">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Factory Status</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Active Module</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            <span className="text-gray-700">Idle Module</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-gray-700">AGV in Transit</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-3">
        {[
          { icon: Factory, label: "Modules", value: "8/8", color: "blue" },
          { icon: Activity, label: "Active", value: "6", color: "green" },
          { icon: Zap, label: "Throughput", value: "94%", color: "amber" },
          { icon: Cpu, label: "Efficiency", value: "87%", color: "purple" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xl border border-green-100 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
              <span className="text-xs font-medium text-gray-700">{stat.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
