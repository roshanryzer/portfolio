import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { PortfolioAll } from '../api/types';
import { Skeleton } from '../components/Skeleton';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function StatCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-navy-light border border-slate-200/80 dark:border-white/5 shadow-card dark:shadow-card-dark">
      <div className="text-sm text-slate-600 dark:text-ink-muted mb-1">{label}</div>
      <div className="text-xl font-semibold text-slate-900 dark:text-ink-light">{value}</div>
      {helper && <div className="text-xs text-slate-500 dark:text-ink-soft mt-1">{helper}</div>}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<PortfolioAll | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.4 });

  useEffect(() => {
    api.portfolio
      .getAll()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  if (error) {
    return (
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-tight text-left">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <p className="text-sm text-slate-500 dark:text-ink-muted mt-2">Ensure the backend is running and CORS is configured.</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-tight max-w-2xl space-y-5 text-left">
          <Skeleton className="h-5 w-36 rounded-full bg-slate-200 dark:bg-navy-light" />
          <Skeleton className="h-16 w-full rounded-lg bg-slate-200 dark:bg-navy-light" />
          <Skeleton className="h-12 w-4/5 rounded-lg bg-slate-200 dark:bg-navy-light" />
          <Skeleton className="h-24 w-full rounded-lg bg-slate-200 dark:bg-navy-light" />
          <div className="pt-2">
            <Skeleton className="h-12 w-48 rounded-full bg-slate-200 dark:bg-navy-light" />
          </div>
        </div>
      </section>
    );
  }

  const profile = data.profile;
  const projects = data.projects.filter((p) => p.featured);
  const name = profile?.name;
  const tagline = profile?.tagline;
  const shortBio = profile?.shortBio;
  const skillsCount = data.skills.length;
  const certificationsCount = data.certifications.length;
  const educationCount = data.education.length;
  const experienceCount = data.experience.length;

  if (!profile) {
    // Profile not configured yet via API
    return (
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="container-tight text-left">
          <p className="text-slate-700 dark:text-ink-light text-lg mb-2">
            Profile data is not configured yet.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Please log in to the Admin dashboard and create a profile so the homepage content can be loaded from the API.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="relative min-h-[100vh] flex items-center pt-8 pb-24 overflow-hidden"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          mouseX.set(e.clientX - rect.left);
          mouseY.set(e.clientY - rect.top);
        }}
      >
        {/* Parallax ambient shapes */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-navy dark:via-navy dark:to-navy-light pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute -top-24 -right-10 w-[420px] h-[420px] rounded-full bg-accent/12 blur-3xl pointer-events-none"
          initial={{ x: 40, y: -20, opacity: 0.6 }}
          animate={{ x: -20, y: 10, opacity: 1 }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 -left-24 w-[320px] h-[320px] rounded-full bg-primary-200/30 dark:bg-accent/10 blur-3xl pointer-events-none"
          initial={{ x: -10, y: 20, opacity: 0.5 }}
          animate={{ x: 30, y: -10, opacity: 0.9 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/40 bg-accent/10 blur-2xl pointer-events-none"
          initial={{ scale: 0.9, rotate: -8, opacity: 0.4 }}
          animate={{ scale: 1.05, rotate: 8, opacity: 0.8 }}
          transition={{ duration: 26, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        {/* Cursor-following glow */}
        <motion.div
          className="pointer-events-none absolute w-56 h-56 rounded-full bg-accent/25 blur-3xl mix-blend-screen"
          style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: [0.0, 0.7, 0.0], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute w-28 h-28 rounded-full bg-primary-200/40 dark:bg-accent/30 blur-2xl mix-blend-screen"
          style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.0, 0.6, 0.0], scale: [1, 1.25, 1] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.4 }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container-tight text-left relative"
        >
          <motion.p
            variants={item}
            className="text-accent font-mono text-sm md:text-base mb-5 tracking-wide"
          >
            Hi, my name is
          </motion.p>
          <motion.h1
            variants={item}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-ink-light mb-4 leading-[1.1] tracking-tight"
          >
            {name}.
          </motion.h1>
          <motion.h2
            variants={item}
            className="text-2xl md:text-4xl lg:text-5xl font-semibold text-slate-600 dark:text-ink-muted mb-8 leading-tight max-w-2xl"
          >
            {tagline}
          </motion.h2>
          <motion.p
            variants={item}
            className="text-slate-600 dark:text-ink-muted max-w-lg text-base md:text-lg leading-relaxed mb-12"
          >
            {shortBio}
          </motion.p>
          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-navy bg-accent hover:bg-accent-soft shadow-card dark:shadow-glow transition-all duration-200 hover:scale-[1.02]"
            >
              View my work
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-slate-700 dark:text-ink-light border border-slate-300 dark:border-white/10 hover:border-accent/50 hover:text-accent transition-colors"
            >
              About me
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {(skillsCount || certificationsCount || educationCount || experienceCount) && (
        <section className="section-padding pt-0">
          <div className="container-tight">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-mono text-accent mb-4"
            >
              Profile at a glance
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {skillsCount > 0 && (
                <StatCard
                  label="Skills"
                  value={`${skillsCount}`}
                  helper="Technologies and tools in my stack"
                />
              )}
              {experienceCount > 0 && (
                <StatCard
                  label="Experience"
                  value={`${experienceCount}`}
                  helper="Companies and roles I’ve worked in"
                />
              )}
              {educationCount > 0 && (
                <StatCard
                  label="Education"
                  value={`${educationCount}`}
                  helper="Degrees and formal studies"
                />
              )}
              {certificationsCount > 0 && (
                <StatCard
                  label="Certifications"
                  value={`${certificationsCount}`}
                  helper="Professional certificates earned"
                />
              )}
            </motion.div>
          </div>
        </section>
      )}

      <section id="projects" className="section-padding bg-slate-50/80 dark:bg-navy-light/50">
        <div className="container-tight">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title flex items-baseline mb-12"
          >
            <span className="section-title-accent">03.</span>
            Featured Projects
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(projects.length ? projects : data.projects).slice(0, 6).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={project.url?.startsWith('/') ? project.url : `/projects#${project.id}`}
                  className="group block p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-navy shadow-card dark:shadow-card-dark hover:shadow-card-dark dark:hover:shadow-glow hover:border-accent/20 transition-all duration-300 h-full"
                >
                  <h3 className="font-semibold text-lg md:text-xl mb-2 text-slate-900 dark:text-ink-light group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 dark:text-ink-muted text-sm md:text-base mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 font-mono text-xs text-slate-500 dark:text-ink-muted">
                      {(project.tech as string[]).slice(0, 5).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          {data.projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                View all projects
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
