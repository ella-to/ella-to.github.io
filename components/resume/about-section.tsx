import { resume } from "@/lib/resume"

export function AboutSection() {
  const { profile, stats, interests } = resume

  return (
    <section id="about" aria-label="About" className="scroll-mt-24">
      <h2 className="sticky top-0 z-20 -mx-6 mb-4 bg-background/80 px-6 py-4 text-sm font-bold uppercase tracking-widest text-foreground backdrop-blur lg:hidden">
        About
      </h2>

      <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
        {profile.summary.map((p, i) => (
          <p key={i} className="text-pretty">
            {i === 0 ? (
              <>
                {p.split("distributed systems")[0]}
                <span className="font-medium text-foreground">
                  distributed systems
                </span>
                {p.split("distributed systems")[1]}
              </>
            ) : (
              p
            )}
          </p>
        ))}
      </div>

      <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
        {stats.map((s) => (
          <div key={s.label} className="bg-card px-4 py-5 text-center sm:px-6">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                {s.value}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {s.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {interests.map((group) => (
          <div
            key={group.category}
            className="rounded-xl border border-border bg-card/50 p-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/80">
              {group.category}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
