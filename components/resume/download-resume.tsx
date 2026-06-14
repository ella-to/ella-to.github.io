"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { resume } from "@/lib/resume"
import { cn } from "@/lib/utils"

export function DownloadResume({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    if (loading) return
    setLoading(true)
    try {
      // Lazy-load the renderer + document so the heavy PDF code only ships
      // to the browser when the user actually clicks download.
      const [{ pdf }, { ResumePdf }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/resume/resume-pdf"),
      ])

      const blob = await pdf(<ResumePdf data={resume} />).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${resume.profile.name.replace(/\s+/g, "-")}-Resume.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.log("[v0] PDF generation failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      aria-label="Download resume as PDF"
      className={cn(
        "group inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="size-4" aria-hidden="true" />
      )}
      {loading ? "Generating…" : "Download PDF"}
    </button>
  )
}
