import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import type { Education as EducationType } from '../api/types';
import { Skeleton } from '../components/Skeleton';

function formatYears(start: number, end: number | null) {
  return end != null ? `${start} – ${end}` : `${start} – Present`;
}

export default function Education() {
  const [items, setItems] = useState<EducationType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.portfolio
      .getEducation()
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
            <Skeleton key={i} className="h-28 rounded-xl" />
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
          className="text-3xl font-bold mb-10 text-slate-900 dark:text-ink-light"
        >
          Education
        </motion.h1>
        <div className="space-y-6">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No education entries yet.</p>
          ) : (
            items.map((edu, i) => (
              <motion.article
                key={edu.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex gap-4"
              >
                {edu.logoUrl && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-navy flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                      src={edu.logoUrl}
                      alt={edu.institution}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-ink-light">
                      {edu.institution}
                    </h2>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatYears(edu.startYear, edu.endYear)}
                    </span>
                  </div>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {edu.degree}
                    {edu.field ? ` in ${edu.field}` : ''}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{edu.description}</p>
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
