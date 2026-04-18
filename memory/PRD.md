# SESGRG Website - Product Requirements Document

## Original Problem Statement
Build a separate student notes blog system for the SESGRG (Sustainable Energy & Smart Grid Research) website. Notes should be accessible at /notes URL but NOT in the navbar. Professional blog system with full admin panel CRUD. Supports rich text content with math formulas, code blocks, tables, images/videos/PDFs via URL. Subjects are power system related. Admin panel integration into existing admin at /admin/notes.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Firebase SDK + DOMPurify
- **Backend**: FastAPI 0.136.0 (minimal, Firebase is primary data store)
- **Database**: Firebase Firestore (primary) + Mock data fallback
- **Auth**: Firebase Firestore users + hardcoded admin fallback, sessionStorage with 30min expiry
- **Rich Text**: ReactQuill with KaTeX (math), code blocks, tables, PDF embed
- **Security**: DOMPurify sanitization on all HTML rendering, no hardcoded secrets

## User Personas
1. **Students** - Browse and read course notes at /notes
2. **Admin/Faculty** - Create, edit, delete notes from /admin/notes

## Core Requirements
- [x] Public notes page at /notes (standalone, no navbar)
- [x] Note detail page at /notes/:noteId
- [x] Admin CRUD at /admin/notes (inside existing admin panel)
- [x] Rich text editor with tables, math formulas, code blocks, PDF/video/image embeds
- [x] Subject-based filtering (Power System related subjects)
- [x] Search functionality
- [x] Pin/unpin notes feature
- [x] Status: published/draft
- [x] Admin dashboard integration (stats + quick action)
- [x] Design matches existing blue/white theme

## What's Been Implemented (Jan 2026)
### Session 1 - Notes System MVP
- Notes.js: Public notes listing page with hero, search, subject filters, cards grid
- NoteDetail.js: Individual note view with rich content rendering, related notes
- AdminNotes.js: Full admin CRUD with ReactQuill rich text editor, table/PDF/formula handlers
- DataContext.js: Extended with notes collection, mock data (3 sample notes)
- AdminDashboard.js: Updated with Student Notes stats and quick actions
- App.js: Routes for /notes, /notes/:noteId, /admin/notes

### Session 2 - Code Review Fixes
**Security (Critical):**
- DOMPurify sanitization on ProfessionalContentRenderer.js, NoteDetail.js, NewsDetail.js
- localStorage → sessionStorage with 30min expiry in AuthContext.js
- Removed hardcoded SECRET_KEY fallback from server.py and server_minimal_auth.py
- Fixed document.write XSS vector in NewsDetail.js print function

**Code Quality (Important):**
- Replaced array-index keys with stable unique keys in Home.js, Notes.js, NoteDetail.js, AdminPublications.js
- Cleaned up 12 old/broken backend server files (server_old.py, server_broken.py, etc.)
- Fixed bare except clauses in server.py (now catches ValueError, TypeError)
- Upgraded FastAPI 0.105.0 → 0.136.0 (CORS middleware fix)

## Subjects List
- Power System Analysis, Power Electronics, Renewable Energy Integration
- Smart Grid Technologies, Energy Storage Systems, Power System Protection
- Electrical Machines, Control Systems, Microgrids & Distributed Energy
- Grid Optimization & Stability, Cybersecurity for Power Systems, Power System Automation

## Prioritized Backlog
### P0 (Done)
- All core CRUD for notes
- Public notes browsing
- Admin panel integration
- Security hardening (DOMPurify, sessionStorage, no hardcoded secrets)

### P1 (Next)
- React hook dependency fixes (44 missing dependencies across files)
- Split large components (AdminNews 1112 lines, ProfessionalContentRenderer 1023 lines)
- Note view counter
- Print/PDF export for notes

### P2 (Future)
- Full-text search with Firestore indexing
- Note commenting system for students
- Bookmarking/favorites system
- Subject-specific landing pages
