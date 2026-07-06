import { Sidebar } from "@/components/resume/sidebar"
import { AboutSection } from "@/components/resume/about-section"
import { ExperienceSection } from "@/components/resume/experience-section"
import { ProjectsSection } from "@/components/resume/projects-section"
import { EducationSection } from "@/components/resume/education-section"
import { Spotlight } from "@/components/resume/spotlight"
import { ThemeToggle } from "@/components/resume/theme-toggle"
import { getResume } from "@/lib/resume"

export default function Page() {
  const resumeData = getResume('new')
  const { profile } = resumeData

  return (
    <div className="relative min-h-screen bg-background">
      <Spotlight />

      <ThemeToggle className="fixed right-5 top-5 z-50 md:right-8 md:top-8" />

      <main className="relative z-20 mx-auto max-w-6xl px-6 py-12 md:px-12 lg:flex lg:gap-12 lg:px-16 lg:py-0">
        <Sidebar resumeData={resumeData} />

        <div className="relative z-20 pt-16 lg:w-[56%] lg:py-24">
          <div className="flex flex-col gap-20 lg:gap-24">
            <AboutSection resumeData={resumeData} />
            <ExperienceSection resumeData={resumeData} />
            <ProjectsSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>
        </div>
      </main>
    </div>
  )
}
