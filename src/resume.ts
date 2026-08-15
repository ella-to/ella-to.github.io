import resume from '@data/resume.json';

export type Resume = typeof resume;

/** "Years with Go" -> "years with Go" (leaves acronyms like "DX" alone). */
const lowerFirst = (s: string) =>
  /^[A-Z][A-Z]/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1);

const bullets = (items: readonly string[]) => items.map((i) => `* ${i}`).join('\n');

/**
 * Renders data/resume.json as a single markdown document.
 * The shape mirrors data/Sample.md — that file is the reference for this output.
 */
export function resumeToMarkdown(data: Resume = resume): string {
  const { profile, social, stats, interests, experience, projects, education, publications } = data;

  const out: string[] = [];

  // --- Header ---
  out.push(`# ${profile.name}`);
  out.push(`**${profile.title}**`);
  out.push(profile.tagline);

  const contact = [
    profile.location,
    `[${profile.email}](mailto:${profile.email})`,
    ...social
      .filter((s) => s.label !== 'Email')
      .map((s) => `[${s.href.replace(/^https?:\/\//, '')}](${s.href})`),
  ];
  out.push(contact.join('\n'));

  if (stats.length) {
    out.push(`**${stats.map((s) => `${s.value} ${lowerFirst(s.label)}`).join(' · ')}**`);
  }

  // --- Profile ---
  out.push('---');
  out.push('## Profile');
  out.push(...profile.summary);

  // --- Experience ---
  out.push('---');
  out.push('## Experience');
  for (const job of experience) {
    out.push(`### ${job.role} — ${job.company}`);
    out.push(`**${[job.period, job.location].filter(Boolean).join(' · ')}**`);
    out.push(bullets(job.highlights));
    if (job.stack?.length) out.push(`**${job.stack.join(' · ')}**`);
  }

  // --- Open Source ---
  out.push('---');
  out.push('## Open Source');
  for (const p of projects) {
    out.push(`### [${p.name}](${p.url})`);
    out.push(`**${[p.language, p.tagline].filter(Boolean).join(' — ')}**`);
    out.push(p.description);
  }

  // --- Technical Stack ---
  out.push('---');
  out.push('## Technical Stack');
  for (const group of interests) {
    out.push(`**${group.category}**\n${group.items.join(' · ')}`);
  }

  // --- Education & Writing ---
  out.push('---');
  out.push('## Education & Writing');
  for (const e of education) {
    out.push(`### ${e.degree}`);
    out.push(`**${e.school}**\n${e.period}`);
  }
  if (publications.length) {
    out.push('### Research / Writing');
    out.push(bullets(publications.map((p) => p.title)));
  }

  // --- Footer ---
  out.push('---');
  out.push(`**${profile.name}**`);
  out.push(bullets(social.map((s) => `[${s.label} — ${s.handle}](${s.href})`)));

  return out.join('\n\n') + '\n';
}

export { resume };
