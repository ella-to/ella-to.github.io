import newData from "@/data/resume.json"
import oldData from "@/data/resume-old.json"

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

export const getResume = (version: 'new' | 'old' = 'old'): ResumeData => {
  return (version === 'new' ? newData : oldData) as ResumeData
}

export const resume = oldData as ResumeData
