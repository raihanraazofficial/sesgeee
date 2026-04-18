# SESGRG Website - Product Requirements Document

## Original Problem Statement
Build a separate student notes blog system for the SESGRG (Sustainable Energy & Smart Grid Research) website. Notes should be accessible at /notes URL but NOT in the navbar. Professional blog system with full admin panel CRUD. Supports rich text content with math formulas, code blocks, tables, images/videos/PDFs via URL. Subjects are power system related. Admin panel integration into existing admin at /admin/notes.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Firebase SDK
- **Backend**: FastAPI (minimal, Firebase is primary data store)
- **Database**: Firebase Firestore (primary) + Mock data fallback
- **Auth**: Firebase Firestore users + hardcoded admin fallback
- **Rich Text**: ReactQuill with KaTeX (math), code blocks, tables, PDF embed

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
- Notes.js: Public notes listing page with hero, search, subject filters, cards grid
- NoteDetail.js: Individual note view with rich content rendering, related notes
- AdminNotes.js: Full admin CRUD with ReactQuill rich text editor, table/PDF/formula handlers
- DataContext.js: Extended with notes collection, mock data (3 sample notes)
- AdminDashboard.js: Updated with Student Notes stats and quick actions
- App.js: Routes for /notes, /notes/:noteId, /admin/notes

## Subjects List
- Power System Analysis, Power Electronics, Renewable Energy Integration
- Smart Grid Technologies, Energy Storage Systems, Power System Protection
- Electrical Machines, Control Systems, Microgrids & Distributed Energy
- Grid Optimization & Stability, Cybersecurity for Power Systems, Power System Automation

## Prioritized Backlog
### P0 (Done)
- All core CRUD for notes ✅
- Public notes browsing ✅
- Admin panel integration ✅

### P1 (Next)
- Add more sample notes for each subject
- Note view counter
- Print/PDF export for notes

### P2 (Future)
- Full-text search with Firestore indexing
- Note commenting system for students
- Bookmarking/favorites system
- Subject-specific landing pages
