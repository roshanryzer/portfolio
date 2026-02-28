import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import type { Experience as ExperienceType } from '../api/types';
import { Skeleton } from '../components/Skeleton';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function Experience() {
  const [items, setItems] = useState<ExperienceType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.portfolio
      .getExperience()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, []);

  if (error) {
    return (
      <div className="section-padding container-tight">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="section-padding">
        <div className="container-tight space-y-6">
          <Skeleton className="h-9 w-40" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-tight">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title flex items-baseline mb-10"
        >
          <span className="section-title-accent">02.</span>
          Experience
        </motion.h1>
        <div className="space-y-6">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No experience entries yet.</p>
          ) : (
            items.map((exp, i) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex gap-4"
              >
                {exp.logoUrl && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-navy flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={exp.logoUrl}
                      alt={exp.company}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-ink-light">
                      {exp.role}
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(exp.startDate)}
                      {exp.endDate ? ` – ${formatDate(exp.endDate)}` : ' – Present'}
                      {exp.current && (
                        <span className="ml-1.5 px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium">
                          Current
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-ink-light font-medium">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
