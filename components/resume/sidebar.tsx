"use client"

import { useEffect, useState } from "react"
import { Github, Mail, MapPin, ArrowUpRight } from "lucide-react"
import { resume } from "@/lib/resume"
import { DownloadResume } from "@/components/resume/download-resume"
import { cn } from "@/lib/utils"

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
] as const

const socialIcon: Record<string, typeof Github> = {
  GitHub: Github,
  Email: Mail,
}

export function Sidebar() {
  const [active, setActive] = useState<string>("about")
  const { profile, social } = resume

  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      Boolean,
    ) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const onNavClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[44%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {profile.name}
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground/90">
          {profile.title}
        </h2>
        <p className="mt-4 max-w-xs text-pretty leading-relaxed text-muted-foreground">
          {profile.tagline}
        </p>

        <div className="mt-5 flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="flex size-4 items-center justify-center">
              <MapPin className="size-4 text-primary" aria-hidden="true" />
            </span>
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-4 items-center justify-center">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {profile.availability}
          </span>
        </div>

        <DownloadResume className="mt-6" />

        {/* In-page navigation with scroll-spy */}
        <nav className="mt-16 hidden lg:block" aria-label="In-page navigation">
          <ul className="flex flex-col gap-4">
            {NAV.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onNavClick(item.id)}
                    className="group flex items-center gap-4 py-1"
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span
                      className={cn(
                        "h-px bg-muted-foreground/40 transition-all duration-300 group-hover:w-16 group-hover:bg-foreground",
                        isActive ? "w-16 bg-primary" : "w-8",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-widest transition-colors duration-300 group-hover:text-foreground",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <ul className="mt-8 flex items-center gap-5" aria-label="Social links">
        {social.map((s) => {
          const Icon = socialIcon[s.label] ?? ArrowUpRight
          return (
            <li key={s.href}>
              <a
                href={s.href}
                target={s.label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={s.label}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Icon className="size-5" />
              </a>
            </li>
          )
        })}
      </ul>
    </header>
  )
}
