"use client"

import { useState } from "react"
import { ArrowUpRight, Star } from "lucide-react"
import { resume } from "@/lib/resume"
import { cn } from "@/lib/utils"

export function ProjectsSection() {
  const { projects } = resume
  const [showAll, setShowAll] = useState(false)

  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const visible = showAll ? projects : featured

  return (
    <section id="projects" aria-label="Open-source projects" className="scroll-mt-24">
      <h2 className="sticky top-0 z-20 -mx-6 mb-4 bg-background/80 px-6 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur lg:hidden">
        Projects
      </h2>

      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        A focused toolchain of open-source Go libraries published under{" "}
        <a
          href="https://github.com/ella-to"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          ella.to
        </a>
        {" "}— small, composable building blocks for high-quality systems.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {visible.map((project) => (
          <li key={project.name}>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="group/card flex h-full flex-col rounded-xl border border-border bg-card/50 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-semibold text-foreground">
                    {project.name}
                  </span>
                  {project.featured && (
                    <Star
                      className="size-3.5 fill-primary text-primary"
                      aria-label="Featured"
                    />
                  )}
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5 group-hover/card:text-primary" />
              </div>

              <p className="mt-1 text-sm font-medium text-foreground/90">
                {project.tagline}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span className="size-2 rounded-full bg-primary" />
                  {project.language}
                </span>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>

      {rest.length > 0 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className={cn(
            "group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary",
          )}
        >
          {showAll ? "Show fewer projects" : `View all ${projects.length} projects`}
          <ArrowUpRight
            className={cn(
              "size-4 transition-transform",
              showAll ? "rotate-180" : "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
            )}
          />
        </button>
      )}
    </section>
  )
}
