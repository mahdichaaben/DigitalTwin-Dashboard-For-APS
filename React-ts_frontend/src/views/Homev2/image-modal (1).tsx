import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageModalProps {
  isOpen: boolean
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  eventName?: string
}

export default function ImageModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  eventName = "Gallery",
}: ImageModalProps) {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrevious()
          break
        case "ArrowRight":
          onNext()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose, onPrevious, onNext])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in-0 duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative max-w-6xl w-full mx-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-slate-900/70 via-slate-800/50 to-transparent backdrop-blur-sm">
          <div className="text-white">
            <h2 id="modal-title" className="font-semibold">
              {eventName}
            </h2>
            <p className="text-sm text-white/70">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-blue-500/20 rounded-full border border-white/10 backdrop-blur-sm"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Image */}
        <img
          src={images[currentIndex] || "/placeholder.svg"}
          alt={`${eventName} image ${currentIndex + 1}`}
          className="w-full max-h-[85vh] object-contain rounded-lg"
          loading="lazy"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-blue-500/20 rounded-full border border-white/10 backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-blue-500/20 rounded-full border border-white/10 backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm p-2 rounded-lg max-w-full overflow-x-auto border border-white/10">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  const event = new CustomEvent("changeImage", { detail: index })
                  document.dispatchEvent(event)
                }}
                className={`flex-shrink-0 w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-green-400 scale-110 shadow-lg shadow-green-400/25" : "border-transparent hover:border-blue-400/70"
                }`}
                aria-label={`Go to image ${index + 1}`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
