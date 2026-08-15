import type { APIRoute } from 'astro';
import { resumeToMarkdown } from '../resume';

// Serves the same document the homepage renders, as raw markdown.
export const GET: APIRoute = () =>
  new Response(resumeToMarkdown(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
