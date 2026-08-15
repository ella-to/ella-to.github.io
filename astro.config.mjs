// @ts-check
import { defineConfig } from 'astro/config';
import resumePdf from './src/integrations/resume-pdf';

export default defineConfig({
  site: 'https://ella.to',
  // Emits /<pkg>/index.html so vanity import paths resolve without a trailing-slash redirect.
  build: { format: 'directory' },
  integrations: [resumePdf({ page: '/', output: 'resume.pdf' })],
});
