"use client"

import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { ResumeData } from "@/lib/resume"

// Inter for reading (correct, tight line metrics in react-pdf),
// IBM Plex Mono for labels/metadata — a distinctly engineering-grade voice.
// Both are fully selectable + OCR/ATS friendly.
Font.register({
  family: "Sans",
  fonts: [
    { src: "/fonts/inter-latin-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/inter-latin-500-normal.woff", fontWeight: 500 },
    { src: "/fonts/inter-latin-600-normal.woff", fontWeight: 600 },
    { src: "/fonts/inter-latin-700-normal.woff", fontWeight: 700 },
  ],
})
Font.register({
  family: "PlexMono",
  fonts: [
    { src: "/fonts/ibm-plex-mono-latin-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/ibm-plex-mono-latin-500-normal.woff", fontWeight: 500 },
    { src: "/fonts/ibm-plex-mono-latin-600-normal.woff", fontWeight: 600 },
  ],
})

// Keep whole words intact so AI/OCR parsing stays clean.
Font.registerHyphenationCallback((word) => [word])

// Dark navy + teal — mirrors the on-screen UI theme.
const C = {
  bg: "#15212e",
  bgAlt: "#1b2836",
  card: "#1d2a38",
  border: "#2c3a4b",
  borderSoft: "#243140",
  ink: "#e9eef3",
  body: "#c3cdd7",
  muted: "#8b97a4",
  faint: "#67737f",
  accent: "#5cd1c5",
  accentDim: "#2f5d5c",
}

// ---------- Page geometry ----------
const PAGE_W = 595.28 // A4 width in pt
const PADX = 44
const PADTOP = 46
const PADBOT = 40
const CONTENT_W = PAGE_W - PADX * 2 // ~507
const EXP_W = CONTENT_W - 20 // timeline content
const CARD_W = (CONTENT_W - 16) / 2 // 2-col grid inner

// Rough single-page height estimator so everything fits on one long page.
function lineCount(text: string, fontSize: number, width: number) {
  // Inter glyphs are wider than a naive estimate; 0.56 avg advance keeps the
  // single-page estimate from undershooting when bullets wrap.
  const cpl = Math.max(1, Math.floor(width / (fontSize * 0.56)))
  return Math.max(1, Math.ceil((text?.length || 0) / cpl))
}
function textH(text: string, fontSize: number, width: number, lh = 1.4) {
  return lineCount(text, fontSize, width) * fontSize * lh
}

const SEC_HEAD = 30

function estimateHeight(data: ResumeData) {
  const { profile, experience, projects, interests, education, publications } = data
  let h = PADTOP + PADBOT

  // header
  h += 13 // eyebrow
  h += 36 // name
  h += 16 // title
  h += textH(profile.tagline, 10.5, 360, 1.4) + 8
  h += 16 // contact row
  h += 12 // gap
  h += 58 // stats boxes
  h += 26 // divider

  // profile
  h += SEC_HEAD
  profile.summary.forEach((p) => (h += textH(p, 9, CONTENT_W, 1.5) + 6))

  // experience
  h += SEC_HEAD
  experience.forEach((e) => {
    let eh = 15 + 12 + 5 // role + company + gap
    e.highlights.forEach((b) => (eh += textH(b, 8.7, EXP_W, 1.42) + 2.5))
    eh += 13 // tech line
    eh += 16 // margin
    h += eh
  })

  // projects (2-col)
  h += SEC_HEAD
  for (let i = 0; i < projects.length; i += 2) {
    const pair = [projects[i], projects[i + 1]].filter(Boolean) as typeof projects
    const heights = pair.map(
      (p) =>
        15 + textH(p.tagline, 8, CARD_W - 20, 1.35) + 4 + textH(p.description, 7.6, CARD_W - 20, 1.42) + 22,
    )
    h += Math.max(...heights) + 10
  }

  // skills
  h += SEC_HEAD
  interests.forEach((g) => (h += Math.max(14, textH(g.items.join(" · "), 9, CONTENT_W - 130, 1.4)) + 7))

  // education
  h += SEC_HEAD
  education.forEach(() => (h += 13 + 11 + 11 + 9))

  // publications
  h += SEC_HEAD
  publications.forEach((p) => (h += textH(p.title, 8.5, EXP_W, 1.42) + 7))

  // footer
  h += 36

  // safety margin so nothing spills onto a 2nd page
  return Math.ceil(h + 620)
}

const styles = StyleSheet.create({
  page: {
    paddingTop: PADTOP,
    paddingBottom: PADBOT,
    paddingHorizontal: PADX,
    backgroundColor: C.bg,
    fontFamily: "Sans",
    fontSize: 9,
    lineHeight: 1.42,
    color: C.body,
  },

  // ---------- Header ----------
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flex: 1, paddingRight: 18 },
  eyebrow: {
    fontFamily: "PlexMono",
    fontSize: 7.5,
    color: C.accent,
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  name: {
    fontSize: 27,
    fontWeight: 700,
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 1.05,
  },
  title: {
    fontFamily: "PlexMono",
    fontSize: 9,
    color: C.accent,
    letterSpacing: 0.4,
    marginTop: 7,
  },
  tagline: {
    fontSize: 10.5,
    color: C.muted,
    marginTop: 9,
    maxWidth: 320,
    lineHeight: 1.4,
  },
  headerRight: { alignItems: "flex-end", paddingTop: 2 },
  contactLine: {
    fontFamily: "PlexMono",
    fontSize: 8,
    color: C.body,
    marginBottom: 4,
    textAlign: "right",
  },
  contactLabel: { color: C.faint },
  link: { color: C.accent, textDecoration: "none" },
  availPill: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dotLive: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accent,
    marginRight: 5,
  },
  availText: {
    fontFamily: "PlexMono",
    fontSize: 7.5,
    color: C.muted,
  },

  // ---------- Stats ----------
  stats: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 700,
    color: C.accent,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontFamily: "PlexMono",
    fontSize: 6.8,
    color: C.muted,
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: "uppercase",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginTop: 18,
  },

  // ---------- Section header ----------
  section: { marginTop: 16 },
  secHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  secIndex: {
    fontFamily: "PlexMono",
    fontSize: 8,
    color: C.accent,
    marginRight: 8,
  },
  secTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: C.ink,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  secRule: {
    flex: 1,
    height: 1,
    backgroundColor: C.borderSoft,
    marginLeft: 12,
  },

  // ---------- Profile ----------
  summaryPara: {
    marginBottom: 5,
    color: C.body,
    lineHeight: 1.5,
  },

  // ---------- Experience (timeline) ----------
  timeline: {
    paddingLeft: 18,
    borderLeftWidth: 1.2,
    borderLeftColor: C.accentDim,
    marginLeft: 3,
  },
  entry: { position: "relative", marginBottom: 13 },
  entryDot: {
    position: "absolute",
    left: -22.5,
    top: 3.5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
  },
  entryDotHollow: {
    position: "absolute",
    left: -22,
    top: 4,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    borderWidth: 1.2,
    borderColor: C.faint,
    backgroundColor: C.bg,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  entryRole: {
    fontSize: 10.5,
    fontWeight: 700,
    color: C.ink,
    lineHeight: 1.2,
  },
  entryCompany: {
    fontSize: 9,
    fontWeight: 600,
    color: C.accent,
    marginTop: 1.5,
  },
  entryMeta: { alignItems: "flex-end", paddingLeft: 10 },
  entryPeriod: { fontFamily: "PlexMono", fontSize: 7.5, color: C.body },
  entryLocation: { fontFamily: "PlexMono", fontSize: 7, color: C.faint, marginTop: 2 },
  bullet: { flexDirection: "row", marginTop: 2.5 },
  bulletDot: { width: 10, color: C.accent, fontSize: 8, lineHeight: 1.42 },
  bulletText: { flex: 1, color: C.body, lineHeight: 1.42 },
  techLine: {
    fontFamily: "PlexMono",
    marginTop: 5,
    fontSize: 7,
    color: C.muted,
    letterSpacing: 0.2,
    lineHeight: 1.4,
  },

  // ---------- Projects ----------
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: CARD_W,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  cardHead: { flexDirection: "row", alignItems: "baseline", marginBottom: 2 },
  cardName: {
    fontFamily: "PlexMono",
    fontSize: 9.5,
    fontWeight: 600,
    color: C.ink,
    textDecoration: "none",
  },
  cardLang: {
    fontFamily: "PlexMono",
    fontSize: 6.5,
    color: C.accent,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  cardTagline: { fontSize: 8, color: C.muted, marginBottom: 3, lineHeight: 1.35 },
  cardDesc: { fontSize: 7.6, color: C.body, lineHeight: 1.42 },

  // ---------- Skills ----------
  skillRow: { flexDirection: "row", marginBottom: 6, alignItems: "flex-start" },
  skillCat: {
    fontFamily: "PlexMono",
    fontSize: 7.5,
    color: C.accent,
    width: 130,
    paddingTop: 1,
  },
  skillItems: { flex: 1, fontSize: 9, color: C.body, lineHeight: 1.4 },

  // ---------- Education / Publications ----------
  twoCol: { flexDirection: "row", justifyContent: "space-between" },
  col: { width: "48%" },
  eduEntry: { marginBottom: 8 },
  eduDegree: { fontSize: 9.5, fontWeight: 600, color: C.ink },
  eduSchool: { fontSize: 8.5, color: C.accent, marginTop: 1.5 },
  eduPeriod: { fontFamily: "PlexMono", fontSize: 7, color: C.muted, marginTop: 2 },
  pubItem: { flexDirection: "row", marginBottom: 6 },
  pubText: { flex: 1, fontSize: 8.5, color: C.body, lineHeight: 1.42 },

  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: C.borderSoft,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "PlexMono",
    fontSize: 6.8,
    color: C.faint,
    letterSpacing: 0.5,
  },
})

function SectionHead({ index, title }: { index: string; title: string }) {
  return (
    <View style={styles.secHead}>
      <Text style={styles.secIndex}>{index}</Text>
      <Text style={styles.secTitle}>{title}</Text>
      <View style={styles.secRule} />
    </View>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>{"\u2013"}</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  )
}

export function ResumePdf({ data }: { data: ResumeData }) {
  const { profile, social, stats, experience, projects, education, publications, interests } = data

  const githubPrimary = social.find((s) => s.label === "GitHub")?.href
  const ghDisplay = githubPrimary?.replace(/^https?:\/\//, "")
  const pageHeight = estimateHeight(data)

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject={profile.title}
      keywords={interests.flatMap((i) => i.items).join(", ")}
      creator="ali-najafizadeh.dev"
    >
      <Page size={{ width: PAGE_W, height: pageHeight }} style={styles.page}>
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.eyebrow}>{"// CURRICULUM VITAE"}</Text>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.title}>{profile.title.toUpperCase()}</Text>
            <Text style={styles.tagline}>{profile.tagline}</Text>
          </View>
          <View style={styles.headerRight}>
            <Link src={`mailto:${profile.email}`} style={[styles.contactLine, styles.link]}>
              {profile.email}
            </Link>
            <Text style={styles.contactLine}>{profile.phone}</Text>
            <Text style={styles.contactLine}>{profile.location}</Text>
            {ghDisplay ? (
              <Link src={githubPrimary as string} style={[styles.contactLine, styles.link]}>
                {ghDisplay}
              </Link>
            ) : null}
            <View style={styles.availPill}>
              <View style={styles.dotLive} />
              <Text style={styles.availText}>{profile.availability}</Text>
            </View>
          </View>
        </View>

        {/* ---------- Stats ---------- */}
        <View style={styles.stats}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* ---------- Profile ---------- */}
        <View style={styles.section}>
          <SectionHead index="01" title="Profile" />
          {profile.summary.map((para, i) => (
            <Text key={i} style={styles.summaryPara}>
              {para}
            </Text>
          ))}
        </View>

        {/* ---------- Experience ---------- */}
        <View style={styles.section}>
          <SectionHead index="02" title="Experience" />
          <View style={styles.timeline}>
            {experience.map((exp, i) => (
              <View key={i} style={styles.entry}>
                <View style={exp.current ? styles.entryDot : styles.entryDotHollow} />
                <View style={styles.entryHeader}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.entryRole}>{exp.role}</Text>
                    <Text style={styles.entryCompany}>{exp.company}</Text>
                  </View>
                  <View style={styles.entryMeta}>
                    <Text style={styles.entryPeriod}>{exp.period}</Text>
                    <Text style={styles.entryLocation}>{exp.location}</Text>
                  </View>
                </View>
                {exp.highlights.map((h, j) => (
                  <Bullet key={j}>{h}</Bullet>
                ))}
                <Text style={styles.techLine}>{exp.stack.join("  /  ")}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------- Projects ---------- */}
        <View style={styles.section}>
          <SectionHead index="03" title="Open Source" />
          <View style={styles.grid}>
            {projects.map((p, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHead}>
                  <Link src={p.url} style={[styles.cardName, styles.link]}>
                    {p.name}
                  </Link>
                  <Text style={styles.cardLang}>{p.language.toUpperCase()}</Text>
                </View>
                <Text style={styles.cardTagline}>{p.tagline}</Text>
                <Text style={styles.cardDesc}>{p.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---------- Skills ---------- */}
        <View style={styles.section}>
          <SectionHead index="04" title="Stack" />
          {interests.map((group, i) => (
            <View key={i} style={styles.skillRow}>
              <Text style={styles.skillCat}>{group.category}</Text>
              <Text style={styles.skillItems}>{group.items.join("  \u00b7  ")}</Text>
            </View>
          ))}
        </View>

        {/* ---------- Education + Publications ---------- */}
        <View style={styles.section}>
          <SectionHead index="05" title="Education & Writing" />
          <View style={styles.twoCol}>
            <View style={styles.col}>
              {education.map((e, i) => (
                <View key={i} style={styles.eduEntry}>
                  <Text style={styles.eduDegree}>{e.degree}</Text>
                  <Text style={styles.eduSchool}>{e.school}</Text>
                  <Text style={styles.eduPeriod}>{e.period}</Text>
                </View>
              ))}
            </View>
            <View style={styles.col}>
              {publications.map((pub, i) => (
                <View key={i} style={styles.pubItem}>
                  <Text style={styles.bulletDot}>{"\u2013"}</Text>
                  <Text style={styles.pubText}>{pub.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ---------- Footer ---------- */}
        <View style={styles.footer}>
          <Text>{profile.name.toUpperCase()}</Text>
          <Text>{ghDisplay || "ali-najafizadeh.dev"}</Text>
        </View>
      </Page>
    </Document>
  )
}
