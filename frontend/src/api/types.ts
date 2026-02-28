/** Portfolio types matching backend API */

export interface Profile {
  id: string;
  name: string;
  headline: string;
  tagline: string;
  shortBio: string;
  longBio: string;
  avatarUrl: string | null;
  email: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  yearsExperience: number | null;
  projectsCount: number | null;
}

export interface Skill {
  id: string;
  category: string;
  name: string;
  sortOrder: number;
  iconUrl: string | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedAt: string;
  url: string | null;
  credentialId: string | null;
  sortOrder: number;
   logoUrl: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  sortOrder: number;
  logoUrl: string | null;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  sortOrder: number;
  logoUrl: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  url: string | null;
  repoUrl: string | null;
  tech: string[] | null;
  featured: boolean;
  sortOrder: number;
}

export interface PortfolioAll {
  profile: Profile | null;
  skills: Skill[];
  certifications: Certification[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}
