import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api/client';
import type { Certification } from '../api/types';
import { Skeleton } from '../components/Skeleton';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export default function Certifications() {
  const [items, setItems] = useState<Certification[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.portfolio
      .getCertifications()
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
          <Skeleton className="h-9 w-48" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
          Certifications
        </motion.h1>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No certifications yet.</p>
          ) : (
            items.map((cert, i) => (
              <motion.article
                key={cert.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {cert.logoUrl && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={cert.logoUrl}
                        alt={cert.issuer}
                        className="w-8 h-8 object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light">
                      {cert.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(cert.issuedAt)}
                  </span>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                    >
                      Verify
                    </a>
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
