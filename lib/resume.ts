import data from "@/data/resume.json"

export type Social = { label: string; href: string; handle: string }
export type Stat = { value: string; label: string }
export type InterestGroup = { category: string; items: string[] }

export type Experience = {
  company: string
  role: string
  period: string
  location: string
  url?: string
  current?: boolean
  highlights: string[]
  stack: string[]
}

export type Project = {
  name: string
  tagline: string
  description: string
  url: string
  language: string
  tags: string[]
  featured?: boolean
}

export type Education = {
  school: string
  degree: string
  period: string
  url?: string
}

export type Publication = { title: string; url: string }

export type Profile = {
  name: string
  title: string
  tagline: string
  location: string
  email: string
  phone: string
  availability: string
  summary: string[]
}

export type ResumeData = {
  profile: Profile
  social: Social[]
  stats: Stat[]
  interests: InterestGroup[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  publications: Publication[]
}

export const resume = data as ResumeData
