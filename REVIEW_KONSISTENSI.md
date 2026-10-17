# REVIEW_KONSISTENSI.md — Audit Formal Konsistensi Lintas Dokumen Phase 0

**Tanggal audit:** 2026-10-16  
**Task:** TITIS-012  
**Scope:** 9 dokumen Phase 0 — `PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`, `DESIGN.md`, `TESTING.md`, `TASK.md`, `TITIS_MASTER_BUILD_GUIDE_FINAL.md`, `AGENTS.md`  
**Dasar:** Keputusan Owner D-01..D-10, keputusan desain, V-01 (2026-10-16)

---

## Ringkasan Eksekutif

| Kategori | Status | Catatan |
|---|---|---|
| **Status DEC (21/21)** | **PASS** | Semua DEC-001..DEC-021 kini `Accepted` (8 Proposed→Accepted, 5 Accepted*→Accepted via V-01) |
| **Batas MVP & Scope** | **PASS** | Konsisten di 9 dokumen; fitur deferred dieksplisitkan |
| **Bahasa UI (EN default + ID via selector)** | **PASS** | Tercatat di PRD, ARCH, DESIGN, TESTING, GUIDE, AGENTS, TASK |
| **Tema Gelap Tunggal (no toggle)** | **PASS** | Tercatat di PRD, DESIGN, TESTING, GUIDE, AGENTS |
| **Auth: Satu Owner, no signup, no Staff** | **PASS** | DEC-016 Accepted; tercatat di PRD, ARCH, DB, SEC, TASK |
| **Booking: Edge Function + internal DB ops** | **PASS** | DEC-006 Accepted; PRD, ARCH, DB, SEC konsisten |
| **Spam Protection: honeypot + request limiting** | **PASS** | DEC-017 Accepted; PRD, ARCH, DB, SEC, DESIGN, TESTING konsisten |
| **Uang: IDR integer `bigint` DB, string TS/JSON** | **PASS** | DEC-009 Accepted; PRD, ARCH, DB, SEC, DESIGN, AGENTS konsisten |
| **Checkout: atomic, idempotent, snapshot** | **PASS** | DEC-008 Accepted; PRD, ARCH, DB, SEC konsisten |
| **Katalog: Single `products` untuk publik + POS** | **PASS** | DEC-021 Accepted; PRD, ARCH, DB, TASK konsisten |
| **SEO: Basic only; prerender/SSR/multilingual deferred** | **PASS** | DEC-011 Accepted; PRD, ARCH, DB, DESIGN*, TESTING, GUIDE konsisten |
| **Testing: Vitest+RTL+db wajib; Playwright/axe deferred** | **PASS** | DEC-013 Accepted; ARCH, DB, SEC, DESIGN, TESTING konsisten |
| **Dependency Deferred: Lenis, GSAP, lucide-react, i18n, Turnstile** | **PASS** | Tercatat di ARCH §5.2, DESIGN §9, TESTING §3.2 |
| **Optional rejection reason (`decision_note`)** | **PASS** | PRD AC-BOOK-02.2, DB booking table, SEC SEC-PERM-07, DESIGN, TESTING BOOK-025 |
| **Contact page: external map link only** | **PASS** | PRD Pages table, DESIGN DQ-12, TESTING UI-021 |
| **RLS, Grants, Function Permissions** | **PASS** | SECURITY matriks, DB §12/§14, ARCH §10 konsisten |
| **Task Status & Evidence** | **PASS** | TITIS-002/003 Done; TITIS-004..010 Review dengan evidence |
| **Gate Phase 0 Criteria** | **PASS** | TITIS-001..014 `Done`; Owner menyetujui Phase 1 (2026-10-17) |

---

## Detail Audit per Area

### 1. Status Keputusan Arsitektur (DEC-001..DEC-021)

**Sumber kebenaran:** `ARCHITECTURE.md` lines 80-100 (tabel DEC)

| DEC | Judul | Status | Evidence Cross-Doc | Verdict |
|---|---|---|---|---|
| DEC-001 | Frontend Vite + React + TS | Accepted | PRD, GUIDE, AGENTS | PASS |
| DEC-002 | Routing React Router v7 | **Accepted** (was Accepted*) | PRD, DB, DESIGN | PASS |
| DEC-003 | Form Validation (Valibot) | Accepted | PRD, SEC | PASS |
| DEC-004 | Styling Tailwind v4 | Accepted | PRD, DESIGN, GUIDE | PASS |
| DEC-005 | Server State (TanStack Query) | Accepted | ARCH §7 | PASS |
| **DEC-006** | **Public Booking Write Path** | **Accepted** (was Proposed) | PRD US-BOOK-01, DB §1.2/§6.1, SEC §6.1, TASK TITIS-004 | **PASS — D-03 Applied** |
| **DEC-007** | **Booking Anti-Bentrok** | **Accepted** (was Accepted*) | DB §1.2/§7.1, PRD, TASK | **PASS — Promoted via V-01** |
| DEC-008 | Atomic Checkout + Idempotency | Accepted | PRD, DB §7.2, SEC §6.2 | PASS |
| **DEC-009** | **Money Representation** | **Accepted** (was Proposed) | PRD §7, DB §3.3, SEC §6.2, DESIGN §6, AGENTS §4 | **PASS — D-04 Applied** |
| DEC-010 | DB TypeScript Types | Accepted | ARCH §8 | PASS |
| **DEC-011** | **SEO Publik** | **Accepted** (was Proposed) | PRD §7, DB §1.2, DESIGN §8.2, TESTING §3.2, GUIDE §2.2 | **PASS — D-05 Applied** |
| **DEC-012** | **Hosting/Environment** | **Accepted** (was Accepted*) | PRD, GUIDE | **PASS — Promoted via V-01** |
| **DEC-013** | **Tooling Testing** | **Accepted** (was Proposed) | PRD, DB §1.2, SEC, DESIGN §9, TESTING §4 | **PASS — D-06 Applied** |
| **DEC-014** | **CMS Content/Rendering** | **Accepted** (was Accepted*) | PRD, DB §1.2, TASK | **PASS — Promoted via V-01** |
| DEC-015 | Runtime/Package Manager/CI | Accepted | ARCH §5 | PASS |
| **DEC-016** | **Authentication** | **Accepted** (was Proposed) | PRD, DB §1.2, SEC §12, TASK TITIS-003 | **PASS — D-07 Applied** |
| **DEC-017** | **Booking Spam/Abuse** | **Accepted** (was Proposed) | PRD, DB §1.2, SEC §6.1, DESIGN, TESTING SEC-015 | **PASS — D-08 Applied** |
| DEC-018 | Client State | Accepted | ARCH §7 | PASS |
| **DEC-019** | **Error Handling** | **Accepted** (was Accepted*) | SEC | **PASS — Promoted via V-01** |
| **DEC-020** | **Template vs Custom UI/UX** | **Accepted** (was Proposed) | PRD, DB §1.2, DESIGN, TASK | **PASS — D-09 Applied** |
| **DEC-021** | **Domain Data/Catalog** | **Accepted** (was Proposed) | PRD, DB §1.2/§8.3, TASK | **PASS — D-10 Applied** |

**V-01 Verification:** ✅ 5 Accepted* (DEC-002, 007, 012, 014, 019) → Accepted; ✅ 8 Proposed → Accepted. **All 21 Accepted.**

---

### 2. Konsistensi Batas MVP & Scope

| Dokumen | Scope MVP Tercatat | Deferred Explisit | Verdict |
|---|---|---|---|
| PRD.md | ✅ §3, §4.1 | ✅ §4.2 tabel deferred (13 items) | PASS |
| ARCHITECTURE.md | ✅ §4, §5.2 approved deps | ✅ §5.2 deferred table (8 items) | PASS |
| DATABASE.md | ✅ §1.2 DEC table | ✅ §12 blockers cleared | PASS |
| SECURITY.md | ✅ §3 trust boundary | ✅ §12 auth (DEC-016) | PASS |
| DESIGN.md | ✅ Header revision notes | ✅ §9 deferred deps, §17 deferred table | PASS |
| TESTING.md | ✅ §3.2 deferred features | ✅ 14 items including i18n, SSR, Turnstile, Lenis, GSAP | PASS |
| TASK.md | ✅ Status block & evidence | ✅ TITIS-004..010 Review | PASS |
| GUIDE.md | ✅ §2.1/§2.2 | ✅ §2.2 clarified "beyond bilingual UI selector" | PASS |
| AGENTS.md | ✅ Baseline project | ✅ §3.2 boundaries | PASS |

**Finding:** Semua dokumen secara eksplisit memisahkan MVP vs Deferred. Tidak ada fitur deferred yang "diam-diam" masuk MVP.

---

### 3. Bahasa UI & Tema

| Kriteria | PRD | ARCH | DB | SEC | DESIGN | TESTING | TASK | GUIDE | AGENTS | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| English default | ✅ §7 | ✅ §8.2 | — | — | ✅ §12, header | ✅ UI-020 | ✅ Evidence | ✅ §4, §6 | ✅ Baseline | PASS |
| Indonesian via selector | ✅ §7 | ✅ §8.2 | — | — | ✅ §12, header | ✅ UI-020 | ✅ Evidence | ✅ §4, §6 | ✅ Baseline | PASS |
| Public + admin | ✅ §7 | ✅ §10.4 | — | — | ✅ header, nav | ✅ UI-020 | ✅ Evidence | ✅ §6 | ✅ Baseline | PASS |
| No i18n library | ✅ §7 | ✅ §5.2 deferred | — | — | ✅ §9 deferred, DQ-08 | ✅ §3.2 | ✅ Evidence | ✅ §2.2 | ✅ Baseline | PASS |
| CMS bilingual content | ✅ AC-CMS-01.6 | ✅ §8.2 | — | — | ✅ §12 | — | ✅ Evidence | ✅ §6 | ✅ Baseline | PASS |
| Single dark theme primary | ✅ §7, AC-DESIGN | — | — | — | ✅ header, nav, rev notes | ✅ UI-019 | ✅ Evidence | ✅ §6 | ✅ Baseline | PASS |
| No light/dark toggle | ✅ §7 | — | — | — | ✅ header, nav | ✅ UI-019 | ✅ Evidence | ✅ §6 | ✅ Baseline | PASS |
| No dominant white bg | ✅ AC-DESIGN | — | — | — | ✅ tokens | ✅ UI-019 | — | — | — | PASS |

---

### 4. Booking, Buffer, Akses Publik, Owner-Only, Spam Protection

| Kriteria | PRD | ARCH | DB | SEC | Verdict |
|---|---|---|---|---|---|
| Edge Function entry point | ✅ US-BOOK-01 | ✅ §10.4 | ✅ §6.1 | ✅ §6.1 | PASS |
| Internal DB ops only | ✅ US-BOOK-01 | ✅ §10.4 | ✅ §6.1 | ✅ §6.1 | PASS |
| No `anon` read access to bookings | ✅ Booking rules | ✅ §10.4 | ✅ §6.1 | ✅ §3, §6.1 | PASS |
| Status `pending` set by system | ✅ US-BOOK-01 | ✅ §10.4 | ✅ §6.1 | ✅ §6.1 | PASS |
| Buffer 15 menit enforced | ✅ Booking rules | ✅ DEC-007 | ✅ §7.1 | — | PASS |
| Anti-bentrok DB constraint | ✅ US-BOOK-02.3/02.4 | ✅ DEC-007 | ✅ §7.1 | — | PASS |
| Owner-only status decision | ✅ US-BOOK-02 | ✅ §10.4 | ✅ §6.1 | ✅ SEC-PERM-07 | PASS |
| Honeypot field | ✅ AC-BOOK-01.7 | ✅ DEC-017 | ✅ §1.2 | ✅ §6.1 | PASS |
| Request limiting | ✅ AC-BOOK-01.7 | ✅ DEC-017 | ✅ §1.2 | ✅ §6.1 | PASS |
| Turnstile not required | ✅ AC-BOOK-01.7 | ✅ DEC-017 | ✅ §1.2 | ✅ §6.1 | PASS |
| Optional rejection reason | ✅ AC-BOOK-02.2 | — | ✅ `decision_note` | ✅ SEC-PERM-07 | PASS |

---

### 5. Representasi Uang, Checkout, Katalog

| Kriteria | PRD | ARCH | DB | SEC | DESIGN | Verdict |
|---|---|---|---|---|---|---|
| IDR integer `bigint` DB | ✅ §7 | ✅ DEC-009 | ✅ §3.3 | ✅ §6.2 | ✅ §6 | PASS |
| String di TS/JSON | ✅ §7 | ✅ DEC-009 | ✅ §3.3 | ✅ §6.2 | ✅ §6 | PASS |
| No floating-point for money | ✅ §7 | ✅ DEC-009 | ✅ §3.3 | ✅ §6.2 | ✅ §6 | PASS |
| Atomic checkout | ✅ Success criteria | ✅ DEC-008 | ✅ §7.2 | ✅ §6.2 | — | PASS |
| Idempotency (request ID) | ✅ Success criteria | ✅ DEC-008 | ✅ §7.2 | ✅ §6.2 | — | PASS |
| Snapshot item/harga | ✅ Success criteria | ✅ DEC-008 | ✅ §6.2, §7.2 | ✅ §6.2 | — | PASS |
| Single `products` catalog | ✅ Scope | ✅ DEC-021 | ✅ §8.3 | — | — | PASS |
| Inactive items hidden | ✅ Scope | ✅ DEC-021 | ✅ §8.3 | — | — | PASS |

---

### 6. Keamanan: RLS, Grants, Function Permissions

| Area | SECURITY.md | DATABASE.md | ARCHITECTURE.md | Verdict |
|---|---|---|---|---|
| Trust boundary | ✅ §3 (DEC-006/017) | ✅ §6.1 | ✅ §10.4 | PASS |
| Permission matrix | ✅ SEC-PERM-01..10 | — | — | PASS |
| SEC-PERM-07 (booking decision) | ✅ optional rejection | ✅ `decision_note` | — | PASS |
| Public booking submission | ✅ §6.1 Edge Function | ✅ §6.1 | ✅ §10.4 | PASS |
| Checkout POS | ✅ §6.2 (DEC-008/009) | ✅ §7.2 | — | PASS |
| Auth model (Owner only) | ✅ §12 (DEC-016) | ✅ §1.2 | ✅ DEC-016 | PASS |
| RLS active on all client tables | ✅ §4 matrix | ✅ §12 | — | PASS |
| Grants reviewed | ✅ §4 matrix | ✅ §12 | — | PASS |
| Function `SECURITY DEFINER` controlled | ✅ §5 policy | — | — | PASS |
| No `USING (true)` shortcuts | ✅ §5 policy | — | — | PASS |
| No secrets in frontend | ✅ §7 | — | ✅ §5 | PASS |
| Error messages no PII/tokens | ✅ §7 | — | — | PASS |

---

### 7. Acceptance Criteria & Test Coverage

| Area | PRD AC | TESTING.md | Verdict |
|---|---|---|---|
| CMS bilingual (AC-CMS-01.6) | ✅ | — | PASS (manual) |
| Single dark theme (AC-DESIGN-01.1) | ✅ | ✅ UI-019 P0 | PASS |
| Language selector | ✅ §7 | ✅ UI-020 P0 | PASS |
| Contact external map link | ✅ Pages table | ✅ UI-021 P0 | PASS |
| Booking spam protection | ✅ AC-BOOK-01.7 | ✅ SEC-015 P1 | PASS |
| Optional rejection reason | ✅ AC-BOOK-02.2 | ✅ BOOK-025 P0 | PASS |
| Money IDR integer | ✅ §7 | — (unit/integration) | PASS |
| Atomic checkout | ✅ Success criteria | — (integration/db) | PASS |
| Anti-bentrok concurrency | ✅ US-BOOK-02.3/02.4 | ✅ BOOK-024/025 | PASS |
| RLS/grants negative tests | — | ✅ SEC-001..015 | PASS |
| E2E tooling note (Playwright/axe deferred) | — | ✅ §4 | PASS |
| Manual a11y checks required | — | ✅ §4 | PASS |

---

### 8. Task Status & Evidence (TASK.md)

| Task | Status | Evidence Quality | Verdict |
|---|---|---|---|
| TITIS-001 | **Done** | AGENTS.md approved 2026-10-17; agent summary provided | **PASS** |
| TITIS-002 | **Done** | Owner decisions D-01..D-10 recorded, PRD updated | **PASS** |
| TITIS-003 | **Done** | All 7 AC checked, decisions confirmed | **PASS** |
| TITIS-004 | **Done** | Owner approved ARCHITECTURE.md 2026-10-17 | **PASS** |
| TITIS-005 | **Done** | Cloudflare + Supabase evidence | **PASS** |
| TITIS-006 | **Done** | Owner approved SEO strategy 2026-10-17 | **PASS** |
| TITIS-007 | **Done** | Owner approved DATABASE.md 2026-10-17 | **PASS** |
| TITIS-008 | **Done** | Owner approved SECURITY.md 2026-10-17 | **PASS** |
| TITIS-009 | **Done** | Owner approved DESIGN.md 2026-10-17 | **PASS** |
| TITIS-010 | **Done** | Owner approved TESTING.md 2026-10-17 | **PASS** |
| TITIS-011 | **Done** | License file | **PASS** |
| TITIS-012 | **Done** | Audit report + local link check (20 links, 0 broken) 2026-10-17 | **PASS** |
| TITIS-013 | **Done** | opencode.json loaded, git rules documented | **PASS** |
| TITIS-014 | **Done** | Owner approved Phase 1 2026-10-17; gate passed | **PASS** |

---

### 9. Gate Phase 0 Criteria (GUIDE.md §6 + TASK.md)

| Criteria | GUIDE.md | TASK.md | Current State | Verdict |
|---|---|---|---|---|
| Scope MVP & deferred understood | ✅ §6 checklist | ✅ TITIS-002/003 Done | Done | PASS |
| Template vs custom UI/UX clear | ✅ §6 checklist | ✅ TITIS-003 Done | Done | PASS |
| Single business + Owner agreed | ✅ §6 checklist | ✅ TITIS-003 Done | Done | PASS |
| Booking rules recorded | ✅ §6 checklist | ✅ TITIS-003 Done | Done | PASS |
| Checkout rules recorded | ✅ §6 checklist | ✅ TITIS-003 Done | Done | PASS |
| Stack/data flow/auth/RLS documented | ✅ §6 checklist | ✅ TITIS-004/007/008 Done | Done | PASS |
| AGENTS.md & TASK.md available | ✅ §6 checklist | ✅ Both exist | Done | PASS |
| **Language strategy agreed** | ✅ §6 checklist (added) | ✅ TITIS-003 evidence | **Recorded** | PASS |
| **Single dark theme agreed** | ✅ §6 checklist (added) | ✅ TITIS-003 evidence | **Recorded** | PASS |
| Decisions affecting schema/access/booking/checkout/SEO Accepted or Deferred | ✅ Exit criteria | ✅ Exit criteria TITIS-014 | **All 21 DEC Accepted** | PASS |
| No critical blockers delegated to AI | ✅ Exit criteria | ✅ No Proposed blocking | Done | PASS |

**Gate Blocker:** Tidak ada blocker — TITIS-001 s/d TITIS-013 `Done`, Q-01..Q-04 `Resolved`, Q-05 `Deferred` ke Phase 4, dan Owner telah menyetujui mulai Phase 1 (2026-10-17). TITIS-014 `Done`.

---

### 10. Cross-Document Reference Integrity

| Check | Result | Notes |
|---|---|---|
| Heading IDs match cross-references | PASS | Verified PRD §7, ARCH §7.2/§10.4, DESIGN §12/§17 |
| Task IDs consistent (TITIS-001..014) | PASS | TASK.md matches GUIDE.md references |
| File names correct in references | PASS | All 9 docs referenced correctly |
| No orphaned OPEN-xxx references | PASS | All OPEN replaced by DEC |
| No stale "Proposed" for accepted DEC | **FIXED** | DESIGN.md lines 336, 627 corrected; DQ-08 line 648 checked |
| DQ-08 single active entry | PASS | Line 625 shows Decided; line 648 checked |
| Language/tema rules consistent | PASS | Verified across all 9 docs |

---

### 11. Temuan Material (FAIL/UNVERIFIED)

| ID | Temuan | Severity | Lokasi | Koreksi Diperlukan |
|---|---|---|---|---|
| F-01 | **DESIGN.md checklist item 10 unchecked** (now fixed) | Low | DESIGN.md:648 | ✅ Fixed — checked with Owner decision reference |
| F-02 | **DESIGN.md stale DEC-011 "Proposed" reference** | Low | DESIGN.md:336 | ✅ Fixed — changed to "Accepted" |
| F-03 | **DESIGN.md stale DEC-013 "Proposed" reference** | Low | DESIGN.md:627 | ✅ Fixed — changed to "Accepted" |
| U-01 | **TITIS-001 AGENTS.md review** | Process | AGENTS.md status header | ✅ Resolved — TITIS-001 `Done` (approved 2026-10-17; agent summary provided) |
| U-02 | **TITIS-004..010 Owner review pending** | Gate | TASK.md status Review | ✅ Resolved — TITIS-004..010 `Done` (approved 2026-10-17) |
| U-03 | **TITIS-013 agent safety enforcement** | Blocker | TASK.md status Done | ✅ Noted — `opencode.json` loaded; interactive permission testing documented as limitation (not an AC requirement) |
| U-04 | **TITIS-014 Gate Phase 0** | Gate | TASK.md status Done | ✅ Resolved — Owner approved Phase 1 2026-10-17 |

**No material conflicts** found in data models, security policies, acceptance criteria, or scope definitions.

---

## 12. Kesimpulan TITIS-012

**Status: PASS dengan catatan (CONDITIONAL PASS) — audit selesai (Done)**

Semua 9 dokumen Phase 0 konsisten dengan keputusan Owner D-01..D-10, keputusan desain, dan V-01. Dua referensi DEC yang kedaluwarsa di `DESIGN.md` telah dikoreksi. Checklist review DESIGN.md item 10 diperbarui. Pemeriksaan tautan lokal Markdown (20 tautan, 0 rusak) selesai pada 2026-10-17.

**Bloker untuk Gate Phase 0 (TITIS-014):**
1. Tidak ada — Owner telah menyetujui mulai Phase 1 (2026-10-17); TITIS-014 `Done`. Q-05 (domain final + backup/recovery) ditunda ke Phase 4 dan tidak memblokir Phase 1.

**Rekomendasi:** Lanjut ke Phase 1 sesuai instruksi Owner berikutnya (TITIS-101 belum dimulai).
Tanggal update: 2026-10-17

---

*Dibuat sebagai bagian dari eksekusi TITIS-012. File ini menjadi evidence formal audit konsistensi.*