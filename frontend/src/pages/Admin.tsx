import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import type { Profile, Skill, Certification, Education, Experience, Project } from '../api/types';
import ConfirmModal from '../components/ConfirmModal';

type Tab = 'profile' | 'skills' | 'certifications' | 'education' | 'experience' | 'projects';

export default function Admin() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'skills', label: 'Skills' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
  ];

  return (
    <div className="section-padding">
      <div className="container-tight">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-ink-light">Manage Portfolio</h1>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View site</Link>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === t.id ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-800/50">
          {tab === 'profile' && <ProfileSection saving={saving} setSaving={setSaving} />}
          {tab === 'skills' && <SkillsSection saving={saving} setSaving={setSaving} />}
          {tab === 'certifications' && <CertificationsSection saving={saving} setSaving={setSaving} />}
          {tab === 'education' && <EducationSection saving={saving} setSaving={setSaving} />}
          {tab === 'experience' && <ExperienceSection saving={saving} setSaving={setSaving} />}
          {tab === 'projects' && <ProjectsSection saving={saving} setSaving={setSaving} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [form, setForm] = useState<Record<string, string | number>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.portfolio.getProfile().then((p) => {
      setProfile(p);
      if (p) setForm({
        name: p.name, headline: p.headline, tagline: p.tagline, shortBio: p.shortBio, longBio: p.longBio,
        avatarUrl: p.avatarUrl ?? '', email: p.email ?? '', linkedInUrl: p.linkedInUrl ?? '', githubUrl: p.githubUrl ?? '',
        websiteUrl: p.websiteUrl ?? '', location: p.location ?? '', yearsExperience: p.yearsExperience ?? '', projectsCount: p.projectsCount ?? '',
      });
      else setForm({
        name: '', headline: '', tagline: '', shortBio: '', longBio: '', avatarUrl: '', email: '', linkedInUrl: '', githubUrl: '',
        websiteUrl: '', location: '', yearsExperience: '', projectsCount: '',
      });
    }).catch(() => setProfile(null));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const body: Record<string, unknown> = { ...form };
      if (body.yearsExperience === '') body.yearsExperience = undefined; else body.yearsExperience = Number(body.yearsExperience);
      if (body.projectsCount === '') body.projectsCount = undefined; else body.projectsCount = Number(body.projectsCount);
      if (profile) await api.portfolio.updateProfile(body);
      else await api.portfolio.createProfile(body as any);
      setMessage('Saved.');
      const p = await api.portfolio.getProfile();
      setProfile(p);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  if (profile === undefined) return <p className="text-slate-500">Loading...</p>;
  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light">Profile</h2>
      {['name', 'headline', 'tagline'].map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{key}</label>
          <input
            value={form[key] ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
            required={key !== 'tagline'}
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium mb-1">shortBio</label>
        <textarea value={form.shortBio ?? ''} onChange={(e) => setForm((f) => ({ ...f, shortBio: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={2} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">longBio</label>
        <textarea value={form.longBio ?? ''} onChange={(e) => setForm((f) => ({ ...f, longBio: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={4} required />
      </div>
      {['avatarUrl', 'email', 'linkedInUrl', 'githubUrl', 'websiteUrl', 'location'].map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium mb-1">{key}</label>
          <input
            type={key === 'email' ? 'email' : 'text'}
            value={form[key] ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
          />
        </div>
      ))}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">yearsExperience</label>
          <input type="number" min={0} value={form.yearsExperience ?? ''} onChange={(e) => setForm((f) => ({ ...f, yearsExperience: e.target.value }))} className="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">projectsCount</label>
          <input type="number" min={0} value={form.projectsCount ?? ''} onChange={(e) => setForm((f) => ({ ...f, projectsCount: e.target.value }))} className="w-24 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        </div>
      </div>
      {message && <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>}
      <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50">Save profile</button>
    </form>
  );
}

function SkillsSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [list, setList] = useState<Skill[]>([]);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null);

  const load = () => api.portfolio.getSkills().then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (editingId) {
        await api.portfolio.updateSkill(editingId, { category, name, iconUrl: iconUrl || undefined });
        setMessage('Updated.');
      } else {
        await api.portfolio.createSkill({ category, name, iconUrl: iconUrl || undefined });
        setMessage('Added.');
      }
      setCategory('');
      setName('');
      setIconUrl('');
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      await api.portfolio.deleteSkill(pendingDelete.id);
      load();
    } finally {
      setSaving(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Skills</h2>
      <form onSubmit={submit} className="flex flex-wrap gap-2 mb-6">
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 w-32" required />
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 w-40" required />
        <input
          placeholder="Icon URL (optional)"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 w-52"
        />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm">
          {editingId ? 'Save changes' : 'Add'}
        </button>
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <ul className="space-y-2">
        {list.map((s) => (
          <li key={s.id} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-2">
              <strong>{s.category}</strong> – {s.name}
              {s.iconUrl && (
                <img
                  src={s.iconUrl}
                  alt={s.name}
                  className="w-4 h-4 object-contain"
                  loading="lazy"
                />
              )}
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCategory(s.category);
                  setName(s.name);
                  setIconUrl(s.iconUrl ?? '');
                  setEditingId(s.id);
                  setMessage(`Editing ${s.name}`);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(s)}
                className="text-red-600 dark:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete skill?"
        description={
          pendingDelete && (
            <>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{pendingDelete.name}</span> from your skills?
            </>
          )
        }
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => !saving && setPendingDelete(null)}
        disabled={saving}
      />
    </div>
  );
}

function CertificationsSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [list, setList] = useState<Certification[]>([]);
  const [form, setForm] = useState({ name: '', issuer: '', issuedAt: '', url: '', logoUrl: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Certification | null>(null);

  const load = () => api.portfolio.getCertifications().then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        name: form.name,
        issuer: form.issuer,
        issuedAt: form.issuedAt || new Date().toISOString().slice(0, 10),
        url: form.url || undefined,
        logoUrl: form.logoUrl || undefined,
      };
      if (editingId) {
        await api.portfolio.updateCertification(editingId, payload);
        setMessage('Updated.');
      } else {
        await api.portfolio.createCertification(payload);
        setMessage('Added.');
      }
      setForm({ name: '', issuer: '', issuedAt: '', url: '', logoUrl: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      await api.portfolio.deleteCertification(pendingDelete.id);
      load();
    } finally {
      setSaving(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Certifications</h2>
      <form onSubmit={submit} className="space-y-2 mb-6">
        <input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <input placeholder="Issuer" value={form.issuer} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <input type="date" placeholder="Issued date" value={form.issuedAt} onChange={(e) => setForm((f) => ({ ...f, issuedAt: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        <input placeholder="URL" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        <input
          placeholder="Logo URL (optional)"
          value={form.logoUrl}
          onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm">
          {editingId ? 'Save changes' : 'Add'}
        </button>
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <ul className="space-y-2">
        {list.map((c) => (
          <li key={c.id} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-2">
              {c.logoUrl && (
                <img
                  src={c.logoUrl}
                  alt={c.name}
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              )}
              <span>{c.name} – {c.issuer}</span>
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    name: c.name,
                    issuer: c.issuer,
                    issuedAt: c.issuedAt?.slice(0, 10) ?? '',
                    url: c.url ?? '',
                    logoUrl: c.logoUrl ?? '',
                  });
                  setEditingId(c.id);
                  setMessage(`Editing ${c.name}`);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(c)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete certification?"
        description={
          pendingDelete && (
            <>
              This will remove{' '}
              <span className="font-semibold">{pendingDelete.name}</span> from your certifications.
            </>
          )
        }
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => !saving && setPendingDelete(null)}
        disabled={saving}
      />
    </div>
  );
}

function EducationSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [list, setList] = useState<Education[]>([]);
  const [form, setForm] = useState({
    institution: '',
    degree: '',
    field: '',
    startYear: '',
    endYear: '',
    description: '',
    logoUrl: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Education | null>(null);

  const load = () => api.portfolio.getEducation().then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        institution: form.institution,
        degree: form.degree,
        field: form.field || undefined,
        startYear: Number(form.startYear),
        endYear: form.endYear ? Number(form.endYear) : undefined,
        description: form.description || undefined,
        logoUrl: form.logoUrl || undefined,
      };
      if (editingId) {
        await api.portfolio.updateEducation(editingId, payload);
        setMessage('Updated.');
      } else {
        await api.portfolio.createEducation(payload);
        setMessage('Added.');
      }
      setForm({ institution: '', degree: '', field: '', startYear: '', endYear: '', description: '', logoUrl: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      await api.portfolio.deleteEducation(pendingDelete.id);
      load();
    } finally {
      setSaving(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Education</h2>
      <form onSubmit={submit} className="space-y-2 mb-6">
        <input placeholder="Institution" value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <input
          placeholder="Institution logo/image URL (optional)"
          value={form.logoUrl}
          onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
        />
        <div className="flex gap-2">
          <input placeholder="Degree" value={form.degree} onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
          <input placeholder="Field" value={form.field} onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        </div>
        <div className="flex gap-2">
          <input type="number" placeholder="Start year" value={form.startYear} onChange={(e) => setForm((f) => ({ ...f, startYear: e.target.value }))} className="w-28 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
          <input type="number" placeholder="End year" value={form.endYear} onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value }))} className="w-28 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={2} />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm">
          {editingId ? 'Save changes' : 'Add'}
        </button>
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <ul className="space-y-2">
        {list.map((e) => (
          <li key={e.id} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-2">
              {e.logoUrl && (
                <img
                  src={e.logoUrl}
                  alt={e.institution}
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              )}
              <span>{e.institution} – {e.degree}{e.field ? ` in ${e.field}` : ''} ({e.startYear}-{e.endYear ?? 'present'})</span>
            </span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    institution: e.institution,
                    logoUrl: e.logoUrl ?? '',
                    degree: e.degree,
                    field: e.field ?? '',
                    startYear: String(e.startYear),
                    endYear: e.endYear ? String(e.endYear) : '',
                    description: e.description ?? '',
                  });
                  setEditingId(e.id);
                  setMessage(`Editing ${e.institution}`);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(e)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete education entry?"
        description={
          pendingDelete && (
            <>
              This will remove{' '}
              <span className="font-semibold">{pendingDelete.institution}</span> from your education.
            </>
          )
        }
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => !saving && setPendingDelete(null)}
        disabled={saving}
      />
    </div>
  );
}

function ExperienceSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [list, setList] = useState<Experience[]>([]);
  const [form, setForm] = useState({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  const load = () => api.portfolio.getExperience().then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        company: form.company,
        role: form.role,
        startDate: form.startDate || new Date().toISOString().slice(0, 10),
        endDate: form.endDate || undefined,
        current: form.current,
        description: form.description || undefined,
      };
      if (editingId) {
        await api.portfolio.updateExperience(editingId, payload);
        setMessage('Updated.');
      } else {
        await api.portfolio.createExperience(payload);
        setMessage('Added.');
      }
      setForm({ company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      await api.portfolio.deleteExperience(pendingDelete.id);
      load();
    } finally {
      setSaving(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Experience</h2>
      <form onSubmit={submit} className="space-y-2 mb-6">
        <input placeholder="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <input placeholder="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <div className="flex gap-2 items-center">
          <input type="date" placeholder="Start" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
          <input type="date" placeholder="End" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked }))} />
            <span className="text-sm">Current</span>
          </label>
        </div>
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={2} />
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm">
          {editingId ? 'Save changes' : 'Add'}
        </button>
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <ul className="space-y-2">
        {list.map((ex) => (
          <li key={ex.id} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span>{ex.role} at {ex.company}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    company: ex.company,
                    role: ex.role,
                    startDate: ex.startDate?.slice(0, 10) ?? '',
                    endDate: ex.endDate?.slice(0, 10) ?? '',
                    current: ex.current,
                    description: ex.description ?? '',
                  });
                  setEditingId(ex.id);
                  setMessage(`Editing ${ex.role} at ${ex.company}`);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(ex)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete experience?"
        description={
          pendingDelete && (
            <>
              This will remove your role{' '}
              <span className="font-semibold">{pendingDelete.role}</span> at{' '}
              <span className="font-semibold">{pendingDelete.company}</span>.
            </>
          )
        }
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => !saving && setPendingDelete(null)}
        disabled={saving}
      />
    </div>
  );
}

function ProjectsSection({ saving, setSaving }: { saving: boolean; setSaving: (v: boolean) => void }) {
  const [list, setList] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: '', description: '', url: '', repoUrl: '', tech: '', featured: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const load = () => api.portfolio.getProjects().then(setList);
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        url: form.url || undefined,
        repoUrl: form.repoUrl || undefined,
        tech: form.tech ? form.tech.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
        featured: form.featured,
      };
      if (editingId) {
        await api.portfolio.updateProject(editingId, payload);
        setMessage('Updated.');
      } else {
        await api.portfolio.createProject(payload);
        setMessage('Added.');
      }
      setForm({ title: '', description: '', url: '', repoUrl: '', tech: '', featured: false });
      setEditingId(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setSaving(true);
    try {
      await api.portfolio.deleteProject(pendingDelete.id);
      load();
    } finally {
      setSaving(false);
      setPendingDelete(null);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-4">Projects</h2>
      <form onSubmit={submit} className="space-y-2 mb-6">
        <input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" rows={2} required />
        <input placeholder="URL" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        <input placeholder="Repo URL" value={form.repoUrl} onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        <input placeholder="Tech (comma-separated)" value={form.tech} onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
          <span className="text-sm">Featured</span>
        </label>
        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm">
          {editingId ? 'Save changes' : 'Add'}
        </button>
      </form>
      {message && <p className="text-sm mb-2">{message}</p>}
      <ul className="space-y-2">
        {list.map((p) => (
          <li key={p.id} className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span>{p.title}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({
                    title: p.title,
                    description: p.description,
                    url: p.url ?? '',
                    repoUrl: p.repoUrl ?? '',
                    tech: p.tech ? p.tech.join(', ') : '',
                    featured: p.featured,
                  });
                  setEditingId(p.id);
                  setMessage(`Editing ${p.title}`);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(p)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmModal
        open={!!pendingDelete}
        title="Delete project?"
        description={
          pendingDelete && (
            <>
              This will remove the project{' '}
              <span className="font-semibold">{pendingDelete.title}</span> from your portfolio.
            </>
          )
        }
        confirmLabel={saving ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => !saving && setPendingDelete(null)}
        disabled={saving}
      />
    </div>
  );
}

