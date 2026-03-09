import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { PortfolioAll, Education, Experience, Project, Skill } from '../api/types';

export default function Resume() {
  const [data, setData] = useState<PortfolioAll | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.portfolio
      .getAll()
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load resume'))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-tight max-w-4xl mx-auto text-left">
          <p className="text-slate-500 dark:text-ink-muted text-sm">Loading resume…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding">
        <div className="container-tight max-w-4xl mx-auto text-left">
          <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
          <p className="text-sm text-slate-500 dark:text-ink-muted">
            Ensure the backend is running so we can build the resume from your portfolio data.
          </p>
        </div>
      </section>
    );
  }

  if (!data || !data.profile) {
    return (
      <section className="section-padding">
        <div className="container-tight max-w-4xl mx-auto text-left">
          <p className="text-slate-700 dark:text-ink-light text-lg mb-2">
            Resume data is not configured yet.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please log in to the Admin dashboard and fill in your profile, experience, education and other sections.
          </p>
        </div>
      </section>
    );
  }

  const { profile, experience, education, projects, skills, certifications } = data;

  const skillsByCategory = groupSkills(skills);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="section-padding print:py-4">
      <div className="container-tight max-w-4xl mx-auto">
        <div className="resume-print bg-white dark:bg-slate-950 rounded-2xl shadow-card dark:shadow-card-dark border border-slate-200 dark:border-slate-800 px-6 py-8 md:px-10 md:py-10 print:shadow-none print:border-0 print:rounded-none">
          {/* Header (centered, similar to HTML resume) */}
          <header className="text-center border-b-2 border-slate-800/70 dark:border-ink-soft pb-4 mb-5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-ink-light">
              {profile.name}
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-ink-muted mt-1">
              {profile.headline || 'Software Engineer'}
            </p>
            {profile.location && (
              <p className="text-sm text-slate-500 dark:text-ink-muted mt-1">
                {profile.location}
              </p>
            )}
            <button
              type="button"
              onClick={handleDownload}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-accent/70 px-4 py-2 text-xs font-medium text-accent hover:bg-accent-dim transition-colors print:hidden"
            >
              Download PDF
            </button>
          </header>

          {/* Professional Summary */}
          {profile.longBio || profile.shortBio ? (
            <section className="mb-4">
              <SectionTitle>Professional Summary</SectionTitle>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-ink-soft text-justify">
                {profile.longBio || profile.shortBio}
              </p>
            </section>
          ) : null}

          {/* Contact Information */}
          <section className="mb-4">
            <SectionTitle>Contact Information</SectionTitle>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-ink-muted">
              {profile.location && (
                <span>
                  <strong className="font-semibold text-slate-700 dark:text-ink-soft">Address:</strong>{' '}
                  {profile.location}
                </span>
              )}
              {profile.email && (
                <span>
                  <strong className="font-semibold text-slate-700 dark:text-ink-soft">Email:</strong>{' '}
                  <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
                    {profile.email}
                  </a>
                </span>
              )}
              {profile.websiteUrl && (
                <span>
                  <strong className="font-semibold text-slate-700 dark:text-ink-soft">Website:</strong>{' '}
                  <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {profile.websiteUrl}
                  </a>
                </span>
              )}
              {profile.githubUrl && (
                <span>
                  <strong className="font-semibold text-slate-700 dark:text-ink-soft">GitHub:</strong>{' '}
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {profile.githubUrl}
                  </a>
                </span>
              )}
              {profile.linkedInUrl && (
                <span>
                  <strong className="font-semibold text-slate-700 dark:text-ink-soft">LinkedIn:</strong>{' '}
                  <a href={profile.linkedInUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    {profile.linkedInUrl}
                  </a>
                </span>
              )}
            </div>
          </section>

          {/* Single-column sections, matching original HTML order */}
          <div className="space-y-5">
            {experience.length > 0 && (
              <section>
                <SectionTitle>Work Experience</SectionTitle>
                <div className="mt-3 space-y-4">
                  {experience
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((ex) => (
                      <ExperienceItem key={ex.id} item={ex} />
                    ))}
                </div>
              </section>
            )}

            {featuredProjects.length > 0 && (
              <section>
                <SectionTitle>Notable Projects</SectionTitle>
                <div className="mt-3 space-y-3">
                  {featuredProjects.map((p) => (
                    <ProjectItem key={p.id} item={p} />
                  ))}
                </div>
              </section>
            )}

            {Object.keys(skillsByCategory).length > 0 && (
              <section>
                <SectionTitle>Technical Skills</SectionTitle>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  {Object.entries(skillsByCategory).map(([category, items]) => (
                    <div key={category} className="space-y-1">
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-ink-soft uppercase tracking-wide">
                        {category}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-ink-muted leading-relaxed">
                        {items.map((s) => s.name).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <SectionTitle>Education</SectionTitle>
                <div className="mt-3 space-y-3">
                  {education
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((ed) => (
                      <EducationItem key={ed.id} item={ed} />
                    ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <SectionTitle>Licenses & Certifications</SectionTitle>
                <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-ink-muted">
                  {certifications
                    .slice()
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((c) => (
                      <li key={c.id}>
                        <span className="font-semibold text-slate-700 dark:text-ink-soft">
                          {c.name}
                        </span>
                        {c.issuer ? (
                          <>
                            {' · '}
                            <span>{c.issuer}</span>
                          </>
                        ) : null}
                      </li>
                    ))}
                </ul>
              </section>
            )}

            <section>
              <SectionTitle>References</SectionTitle>
              <p className="mt-2 text-xs text-slate-600 dark:text-ink-muted">
                Available upon request
              </p>
            </section>
          </div>

          <footer className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-ink-muted flex justify-between">
            <span>Generated from live portfolio data</span>
            <span>Last updated {new Date().getFullYear()}</span>
          </footer>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-ink-soft uppercase border-b-2 border-accent pb-1">
      {children}
    </h2>
  );
}

function ExperienceItem({ item }: { item: Experience }) {
  const start = formatResumeDate(item.startDate);
  const end = item.endDate ? formatResumeDate(item.endDate) : null;
  const bullets =
    (item.description || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  return (
    <article className="job space-y-1">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-ink-light">
        {item.role}
      </h3>
      <p className="text-xs font-medium text-slate-700 dark:text-ink-soft">
        {item.company}
      </p>
      <p className="text-[11px] text-slate-500 dark:text-ink-muted">
        {start} – {item.current ? 'Present' : end || 'N/A'}
      </p>
      {bullets.length > 0 && (
        bullets.length === 1 ? (
          <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-ink-soft">
            {bullets[0]}
          </p>
        ) : (
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-slate-700 dark:text-ink-soft">
            {bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )
      )}
    </article>
  );
}

function EducationItem({ item }: { item: Education }) {
  return (
    <article className="education-item space-y-1">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-ink-light">
        {item.degree}
      </h3>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] text-slate-600 dark:text-ink-muted flex-1">
          {item.institution}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-ink-muted whitespace-nowrap">
          {item.startYear} – {item.endYear ?? 'Present'}
        </p>
      </div>
      {item.description && (
        <p className="mt-1 text-[11px] text-slate-600 dark:text-ink-soft">
          {item.description}
        </p>
      )}
    </article>
  );
}

function ProjectItem({ item }: { item: Project }) {
  return (
    <article className="border-l-4 border-accent pl-3">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-ink-light">
        {item.title}
      </h3>
      <p className="text-xs text-slate-600 dark:text-ink-muted">
        {item.description}
      </p>
      {item.tech && item.tech.length > 0 && (
        <p className="mt-1 text-[11px] text-slate-500 dark:text-ink-muted">
          Tech: {item.tech.join(', ')}
        </p>
      )}
    </article>
  );
}

function groupSkills(skills: Skill[]): Record<string, Skill[]> {
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});
}

function formatResumeDate(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  const year = date.getFullYear();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

