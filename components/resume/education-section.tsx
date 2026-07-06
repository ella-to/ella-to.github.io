import { ArrowUpRight, GraduationCap, FileText } from "lucide-react"
import { resume, ResumeData } from "@/lib/resume"

export function EducationSection({ resumeData = resume }: { resumeData?: ResumeData }) {
  const { education, publications } = resumeData

  return (
    <section id="education" aria-label="Education and publications" className="scroll-mt-24">
      <h2 className="sticky top-0 z-20 -mx-6 mb-4 bg-background/80 px-6 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur lg:hidden">
        Education
      </h2>

      <div className="flex flex-col gap-3">
        {education.map((edu) => {
          const Wrapper = edu.url ? "a" : "div"
          return (
            <Wrapper
              key={edu.degree}
              {...(edu.url
                ? { href: edu.url, target: "_blank", rel: "noreferrer" }
                : {})}
              className="group flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-card/70"
            >
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="flex items-center gap-1 font-semibold text-foreground">
                  {edu.degree}
                  {edu.url && (
                    <ArrowUpRight className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{edu.school}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground/80">
                  {edu.period}
                </p>
              </div>
            </Wrapper>
          )
        })}
      </div>

      <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-foreground/80">
        Publications
      </h3>
      <ul className="flex flex-col gap-2">
        {publications.map((pub) => (
          <li key={pub.title}>
            <a
              href={pub.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-3 rounded-lg p-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-card/70 hover:text-foreground"
            >
              <FileText
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className="text-pretty">{pub.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
