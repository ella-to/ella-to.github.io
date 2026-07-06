import { ArrowUpRight } from "lucide-react"
import { resume, ResumeData } from "@/lib/resume"
import { cn } from "@/lib/utils"

export function ExperienceSection({ resumeData = resume }: { resumeData?: ResumeData }) {
  const { experience } = resumeData

  return (
    <section
      id="experience"
      aria-label="Work experience"
      className="scroll-mt-24"
    >
      <h2 className="sticky top-0 z-20 -mx-6 mb-4 bg-background/80 px-6 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur lg:hidden">
        Experience
      </h2>

      <ol className="group/list flex flex-col gap-3">
        {experience.map((job) => {
          const Wrapper = job.url ? "a" : "div"
          return (
            <li key={`${job.company}-${job.period}`}>
              <Wrapper
                {...(job.url
                  ? { href: job.url, target: "_blank", rel: "noreferrer" }
                  : {})}
                className={cn(
                  "group/item relative grid gap-2 rounded-xl p-4 transition-all sm:grid-cols-[140px_1fr] sm:gap-6",
                  "hover:bg-card/70 hover:shadow-sm lg:group-hover/list:opacity-50 lg:hover:!opacity-100",
                  job.url && "cursor-pointer",
                )}
              >
                <div className="flex items-center justify-between sm:block">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {job.period}
                  </span>
                  {job.current && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary sm:mt-2">
                      <span className="size-1.5 rounded-full bg-primary" />
                      Current
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold leading-snug text-foreground">
                    <span className="inline-flex items-center gap-1">
                      {job.role}
                      <span className="text-muted-foreground">·</span>
                      <span className="text-primary">{job.company}</span>
                      {job.url && (
                        <ArrowUpRight
                          className="size-4 text-primary transition-transform group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {job.location}
                  </p>

                  <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                    {job.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span
                          className="mt-2 size-1 shrink-0 rounded-full bg-primary/60"
                          aria-hidden="true"
                        />
                        <span className="text-pretty">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {job.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground/80"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Wrapper>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
