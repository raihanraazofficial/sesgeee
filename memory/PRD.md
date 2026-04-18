# SESGRG Website - Product Requirements Document

## Original Problem Statement
Build a separate student notes blog system for the SESGRG (Sustainable Energy & Smart Grid Research) website. Notes accessible at /notes URL (not in navbar). Professional blog system with admin CRUD. Rich text with math, code, tables, images/videos/PDFs via URL (no file upload). Power system subjects. Comment + share system.

## Architecture
- **Frontend**: React 18 + Tailwind CSS + Firebase SDK + DOMPurify
- **Backend**: FastAPI 0.136.0
- **Database**: Firebase Firestore (primary) + Mock data fallback
- **Auth**: sessionStorage with 30min expiry
- **Rich Text**: ReactQuill with KaTeX, URL-based media (image/video/PDF)
- **Security**: DOMPurify sanitization, no hardcoded secrets

## What's Been Implemented

### Session 1 - Notes System MVP
- Notes.js, NoteDetail.js, AdminNotes.js created
- DataContext extended with notes collection
- Admin dashboard integration

### Session 2 - Code Review Fixes
- DOMPurify sanitization on all HTML rendering
- localStorage → sessionStorage migration
- Hardcoded secrets removed
- Array index keys fixed
- Old server files cleaned up

### Session 3 - Complete Redesign + Features
- **Dark Navy Theme**: Complete redesign with #0a1628 dark navy background, cyan accents (#38bdf8)
- **Content Rendering Fixed**: Code blocks now have dark blue (#0f172a) background with light (#e2e8f0) text, tables styled with dark headers
- **Responsive Design**: Single column mobile, filter toggle, proper spacing at all breakpoints
- **Comment System**: Firestore-based comments on each note (name + text)
- **Share System**: WhatsApp, Facebook, Twitter, Copy Link buttons on note detail
- **URL-based Media**: Admin image/video/PDF buttons prompt for URLs instead of file upload
- **Mock Data Fix**: deleteItem/updateItem gracefully handle Firestore errors for mock data

## Backlog
### P1
- Note view counter
- Print/PDF export for notes
- React hook dependency fixes

### P2
- Full-text search indexing
- Student bookmarking/favorites
- Admin bulk operations
