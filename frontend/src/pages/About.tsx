import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { PortfolioAll, Skill } from '../api/types';
import { Skeleton } from '../components/Skeleton';

export default function About() {
  const [data, setData] = useState<PortfolioAll | null | undefined>(undefined);

  useEffect(() => {
    api.portfolio
      .getAll()
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (data === undefined) {
    return (
      <div className="section-padding">
        <div className="container-tight max-w-3xl space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="section-padding">
        <div className="container-tight max-w-3xl">
          <p className="text-red-500 dark:text-red-400 mb-2">Failed to load portfolio data.</p>
          <p className="text-sm text-slate-500 dark:text-ink-muted">Ensure the backend is running.</p>
        </div>
      </div>
    );
  }

  const { profile, skills, education, experience, certifications } = data;

  const stats = [
    { value: profile?.yearsExperience != null ? `${profile.yearsExperience}+` : '—', label: 'Years Experience' },
    { value: profile?.projectsCount != null ? `${profile.projectsCount}+` : '—', label: 'Projects Delivered' },
    { value: certifications.length > 0 ? `${certifications.length}` : '—', label: 'Certifications' },
  ];

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="section-padding">
      <div className="container-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="section-title flex items-baseline mb-8">
            <span className="section-title-accent">01.</span>About Me
          </h1>
          <p className="text-slate-600 dark:text-ink-muted mb-8 leading-relaxed max-w-2xl">
            {profile?.longBio ??
              'Experienced Software Engineer building scalable web applications, APIs, and automation tools. Full-stack development with a focus on high-quality, maintainable solutions.'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.3 }}
                className="text-center p-5 rounded-2xl bg-slate-100/80 dark:bg-navy-light border border-slate-200/80 dark:border-white/5 shadow-card dark:shadow-card-dark"
              >
                <div className="text-2xl font-bold text-accent">{s.value}</div>
                <div className="text-sm text-slate-600 dark:text-ink-muted">{s.label}</div>
              </motion.div>
            ))}
          </div>
          {(education.length > 0 || experience.length > 0 || skills.length > 0 || certifications.length > 0) && (
            <div className="mt-10 mb-10 space-y-10">
              {experience.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Experience</h2>
                  <div className="space-y-4">
                    {experience.map((ex) => (
                      <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.35 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-light p-4"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-ink-light">
                            {ex.role} <span className="text-slate-500 dark:text-ink-muted">@ {ex.company}</span>
                          </p>
                          <p className="text-xs font-mono text-slate-500 dark:text-ink-soft">
                            {ex.startDate?.slice(0, 7)} – {ex.current ? 'Present' : ex.endDate?.slice(0, 7) ?? '—'}
                          </p>
                        </div>
                        {ex.description && (
                          <p className="text-sm text-slate-600 dark:text-ink-muted leading-relaxed">{ex.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {education.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Education</h2>
                  <div className="space-y-4">
                    {education.map((e) => (
                      <motion.div
                        key={e.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.35 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-light p-4"
                      >
                        <div className="flex items-start gap-3">
                          {e.logoUrl && (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                              <img
                                src={e.logoUrl}
                                alt={e.institution}
                                className="w-8 h-8 object-contain"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-ink-light">
                          {e.degree}
                          {e.field ? ` in ${e.field}` : ''}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-ink-muted">
                          {e.institution} · {e.startYear} – {e.endYear ?? 'Present'}
                        </p>
                        {e.description && (
                          <p className="mt-1 text-sm text-slate-600 dark:text-ink-muted leading-relaxed">
                            {e.description}
                          </p>
                        )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {skills.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Skills</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(skillsByCategory).map(([category, list]) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ duration: 0.35 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-light p-4"
                      >
                        <p className="text-sm font-semibold text-slate-800 dark:text-ink-light mb-2">{category}</p>
                        <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-600 dark:text-ink-muted">
                          {list.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-1 rounded-full bg-slate-100 dark:bg-navy text-slate-700 dark:text-ink-light border border-slate-200 dark:border-slate-700"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {certifications.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Certifications</h2>
                  <div className="space-y-3">
                    {certifications.map((c) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-ink-light">{c.name}</p>
                          <p className="text-xs text-slate-600 dark:text-ink-muted">{c.issuer}</p>
                        </div>
                        {c.issuedAt && (
                          <p className="text-xs font-mono text-slate-500 dark:text-ink-soft">
                            {c.issuedAt.slice(0, 10)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/skills"
              className="px-5 py-2.5 rounded-full border border-accent/60 text-accent font-medium hover:bg-accent-dim transition-colors"
            >
              View Skills
            </Link>
            <Link
              to="/projects"
              className="px-5 py-2.5 rounded border border-slate-300 dark:border-ink-muted hover:bg-slate-100 dark:hover:bg-navy-light transition-colors text-slate-700 dark:text-ink-light"
            >
              View Projects
            </Link>
            {profile?.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded border border-slate-300 dark:border-ink-muted hover:bg-slate-100 dark:hover:bg-navy-light transition-colors text-slate-700 dark:text-ink-light"
              >
                LinkedIn
              </a>
            )}
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded border border-slate-300 dark:border-ink-muted hover:bg-slate-100 dark:hover:bg-navy-light transition-colors text-slate-700 dark:text-ink-light"
              >
                GitHub
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
