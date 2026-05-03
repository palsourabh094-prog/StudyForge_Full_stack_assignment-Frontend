/* ============================================================
   StudyForge — Shared Utilities (app.js)
   ============================================================ */

const API_BASE = 'https://study-forge-backend.vercel.app';

// ── Theme Toggle ────────────────────────────────────────────
// Manages light/dark theme with localStorage persistence

function initTheme() {
  const stored = localStorage.getItem('studyforge-theme');
  const theme = stored || 'light';
  document.documentElement.className = theme;
  return theme;
}

function toggleTheme() {
  const current = document.documentElement.className;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.className = next;
  localStorage.setItem('studyforge-theme', next);
  // Update toggle button text
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
}

// ── Toast Notification ──────────────────────────────────────
// Creates a toast message at bottom-right that auto-dismisses

let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function showToast(message, type = 'info') {
  const container = getToastContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const dot = document.createElement('span');
  dot.className = 'toast-dot';

  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(dot);
  toast.appendChild(text);
  container.appendChild(toast);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 280);
  }, 3000);
}

// ── Button Loading States ──────────────────────────────────
// Disables a button and shows a spinner during async operations

function showLoading(buttonEl) {
  buttonEl.disabled = true;
  buttonEl._originalHTML = buttonEl.innerHTML;

  const spinner = document.createElement('span');
  spinner.className = 'spinner';

  const text = document.createElement('span');
  text.textContent = 'Loading…';

  buttonEl.innerHTML = '';
  buttonEl.appendChild(spinner);
  buttonEl.appendChild(text);
}

function hideLoading(buttonEl) {
  buttonEl.disabled = false;
  if (buttonEl._originalHTML !== undefined) {
    buttonEl.innerHTML = buttonEl._originalHTML;
  }
}

// ── Date Formatter ─────────────────────────────────────────
// Converts ISO date string to human-readable format: "May 3, 2026"

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ── API Helper ─────────────────────────────────────────────
// Centralized fetch wrapper with error handling

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const defaults = {
    headers: { 'Content-Type': 'application/json' },
  };
  console.log('📤 API Call:', { url, method: options.method || 'GET' });
  try {
    const response = await fetch(url, { ...defaults, ...options });
    console.log('📥 API Response:', { status: response.status, statusText: response.statusText });
    const data = await response.json();
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || data.error || 'Something went wrong');
    }
    console.log('✅ API Success:', data);
    return data;
  } catch (error) {
    console.error('🔴 API Fetch Error:', error);
    throw error;
  }
}

// ── Sidebar Initializer ────────────────────────────────────
// Renders the Notion-style sidebar and highlights the active page

function initNavbar(activePage) {
  // Initialize theme
  const theme = initTheme();

  const links = [
    { href: 'index.html', emoji: '🏠', label: 'Dashboard' },
    { href: 'generate.html', emoji: '✨', label: 'Generate' },
    { href: 'courses.html', emoji: '📚', label: 'Courses' },
    { href: 'recent.html', emoji: '🕐', label: 'Recent Activity' },
    { href: 'habits.html', emoji: '✅', label: 'Habits' },
    { href: 'notes.html', emoji: '📝', label: 'Notes' },
  ];

  // Build sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  // Logo
  const logo = document.createElement('a');
  logo.href = 'index.html';
  logo.className = 'sidebar-logo';
  logo.innerHTML = `
    <img src="logo.png" alt="StudyForge" style="width:24px;height:24px;object-fit:contain;border-radius:4px;">
    <span>StudyForge</span>
    <span class="sidebar-badge">Beta</span>
  `;

  // Nav
  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';

  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    if (link.href === activePage) a.classList.add('active');

    const emoji = document.createElement('span');
    emoji.className = 'nav-emoji';
    emoji.textContent = link.emoji;

    const text = document.createElement('span');
    text.textContent = link.label;

    a.appendChild(emoji);
    a.appendChild(text);
    nav.appendChild(a);
  });

  // Footer with theme toggle
  const footer = document.createElement('div');
  footer.className = 'sidebar-footer';

  const themeBtn = document.createElement('button');
  themeBtn.className = 'theme-toggle-btn';
  themeBtn.id = 'theme-toggle';
  themeBtn.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
  themeBtn.addEventListener('click', toggleTheme);

  footer.appendChild(themeBtn);

  sidebar.appendChild(logo);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);

  // Overlay for mobile
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    const hb = document.getElementById('hamburger-btn');
    if (hb) hb.classList.remove('open');
  });

  // Mobile header
  const mobileHeader = document.createElement('div');
  mobileHeader.className = 'mobile-header';

  const mobileLogo = document.createElement('span');
  mobileLogo.className = 'sidebar-logo';
  mobileLogo.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;">
      <img src="logo.png" alt="StudyForge" style="width:24px;height:24px;object-fit:contain;border-radius:4px;">
      <span style="font-weight:600;font-size:16px;">StudyForge</span>
    </div>
  `;

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger';
  hamburger.id = 'hamburger-btn';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.innerHTML = '<span></span><span></span><span></span>';
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
  });

  mobileHeader.appendChild(mobileLogo);
  mobileHeader.appendChild(hamburger);

  // Wrap existing main content
  const body = document.body;
  const children = Array.from(body.childNodes);

  const layout = document.createElement('div');
  layout.className = 'app-layout';

  const mainContent = document.createElement('div');
  mainContent.className = 'main-content';

  // Move mobile header inside main content
  mainContent.appendChild(mobileHeader);

  // Move all existing children into main content (except old navbar)
  children.forEach(child => {
    if (child.id === 'navbar' || (child.classList && child.classList.contains('navbar'))) return;
    if (child.classList && child.classList.contains('mobile-menu')) return;
    body.removeChild(child);
    mainContent.appendChild(child);
  });

  // Remove old navbar if it exists
  const oldNav = document.getElementById('navbar');
  if (oldNav) oldNav.remove();

  layout.appendChild(overlay);
  layout.appendChild(sidebar);
  layout.appendChild(mainContent);
  body.appendChild(layout);
}

// ── Skeleton Loader Builder ────────────────────────────────
// Creates placeholder skeleton rows for loading states

function buildSkeletonCard() {
  const wrap = document.createElement('div');
  wrap.className = 'skeleton-card';

  const lines = [
    { cls: 'skeleton-medium', h: '16px' },
    { cls: 'skeleton-full', h: '12px' },
    { cls: 'skeleton-short', h: '12px' },
  ];

  lines.forEach(({ cls, h }) => {
    const line = document.createElement('div');
    line.className = `skeleton skeleton-line ${cls}`;
    line.style.height = h;
    wrap.appendChild(line);
  });

  return wrap;
}

// ── Render Skeletons ───────────────────────────────────────
// Inserts n skeleton cards into a container while data loads

function renderSkeletons(container, count = 3) {
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    container.appendChild(buildSkeletonCard());
  }
}

// ── Empty State ────────────────────────────────────────────
// Renders a centered empty state illustration inside a container

function renderEmptyState(container, icon, title, subtitle) {
  container.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'empty-state';

  const ic = document.createElement('span');
  ic.className = 'empty-icon';
  ic.textContent = icon;

  const h = document.createElement('h3');
  h.textContent = title;

  const p = document.createElement('p');
  p.textContent = subtitle;

  wrap.appendChild(ic);
  wrap.appendChild(h);
  wrap.appendChild(p);
  container.appendChild(wrap);
}

// ════════════════════════════════════════════════════════════════════════════
// API CALL IMPLEMENTATIONS — Habits, Notes, Courses & Generate
// ════════════════════════════════════════════════════════════════════════════

// ── HABITS API ───────────────────────────────────────────────────────────────

/**
 * Fetch all habits from the backend.
 * @returns {Promise<Array>} Array of habit objects
 * @example
 * const habits = await fetchHabits();
 * // Returns: [{ id, name, description, streak, completed_today, created_at }, ...]
 */
async function fetchHabits() {
  try {
    const habits = await apiFetch('/api/habits');
    return habits;
  } catch (error) {
    showToast(`Failed to fetch habits: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Create a new habit.
 * @param {string} name - Habit name (required, min 3 chars)
 * @param {string} description - Habit description (optional)
 * @returns {Promise<Object>} Created habit object { id, name, description, streak, completed_today, created_at }
 * @example
 * const habit = await createHabit('Morning Run', 'Run 5km every morning');
 */
async function createHabit(name, description = '') {
  try {
    if (!name || name.trim().length < 3) {
      throw new Error('Habit name must be at least 3 characters');
    }
    const habit = await apiFetch('/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    });
    showToast(`✅ Habit "${name}" created successfully!`, 'success');
    return habit;
  } catch (error) {
    showToast(`Failed to create habit: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Mark a habit as completed (increment streak).
 * @param {string} habitId - UUID of the habit to complete
 * @returns {Promise<Object>} Updated habit object
 */
async function completeHabit(habitId) {
  try {
    const habit = await apiFetch(`/api/habits/${habitId}`, {
      method: 'PUT',
    });
    showToast('✨ Habit marked as complete! Streak increased.', 'success');
    return habit;
  } catch (error) {
    showToast(`Failed to mark habit as complete: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Delete a habit.
 * @param {string} habitId - UUID of the habit to delete
 * @returns {Promise<Object>} Response from server
 */
async function deleteHabit(habitId) {
  try {
    const response = await apiFetch(`/api/habits/${habitId}`, {
      method: 'DELETE',
    });
    showToast('🗑️ Habit deleted successfully.', 'success');
    return response;
  } catch (error) {
    showToast(`Failed to delete habit: ${error.message}`, 'error');
    throw error;
  }
}

// ── NOTES API ────────────────────────────────────────────────────────────────

/**
 * Fetch all notes from the backend (newest first).
 * @returns {Promise<Array>} Array of note objects
 */
async function fetchNotes() {
  try {
    const notes = await apiFetch('/api/notes');
    return notes;
  } catch (error) {
    showToast(`Failed to fetch notes: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Create a new note.
 * @param {string} title - Note title (required)
 * @param {string} content - Note content (required)
 * @param {string} tag - Note tag (optional)
 * @returns {Promise<Object>} Created note object
 */
async function createNote(title, content, tag = '') {
  try {
    if (!title || !title.trim()) {
      throw new Error('Note title is required');
    }
    if (!content || !content.trim()) {
      throw new Error('Note content is required');
    }
    const note = await apiFetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        tag: tag.trim(),
      }),
    });
    showToast(`📝 Note "${title}" created successfully!`, 'success');
    return note;
  } catch (error) {
    showToast(`Failed to create note: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Update an existing note.
 * @param {string} noteId - UUID of the note to update
 * @param {Object} updates - Object containing fields to update: { title?, content?, tag? }
 * @returns {Promise<Object>} Updated note object
 */
async function updateNote(noteId, updates) {
  try {
    if (!updates || Object.keys(updates).length === 0) {
      throw new Error('No fields provided to update');
    }
    const note = await apiFetch(`/api/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    showToast('✏️ Note updated successfully!', 'success');
    return note;
  } catch (error) {
    showToast(`Failed to update note: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Delete a note.
 * @param {string} noteId - UUID of the note to delete
 * @returns {Promise<Object>} Response from server
 */
async function deleteNote(noteId) {
  try {
    const response = await apiFetch(`/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    showToast('🗑️ Note deleted successfully.', 'success');
    return response;
  } catch (error) {
    showToast(`Failed to delete note: ${error.message}`, 'error');
    throw error;
  }
}

// ── COURSES API ──────────────────────────────────────────────────────────────

/**
 * Fetch all saved courses from the backend (newest first).
 * @returns {Promise<Array>} Array of course objects
 */
async function fetchCourses() {
  try {
    const courses = await apiFetch('/api/courses');
    return courses;
  } catch (error) {
    showToast(`Failed to fetch courses: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Save a generated course to the backend.
 * @param {string} topic - Course topic (required)
 * @param {Object} content - Full course content object (required)
 * @returns {Promise<Object>} Saved course object
 */
async function saveCourse(topic, content) {
  try {
    if (!topic || !topic.trim()) {
      throw new Error('Course topic is required');
    }
    if (!content) {
      throw new Error('Course content is required');
    }
    const course = await apiFetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify({
        topic: topic.trim(),
        content: content,
      }),
    });
    showToast(`📚 Course "${topic}" saved successfully!`, 'success');
    return course;
  } catch (error) {
    showToast(`Failed to save course: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Delete a saved course.
 * @param {string} courseId - UUID of the course to delete
 * @returns {Promise<Object>} Response from server
 */
async function deleteCourse(courseId) {
  try {
    const response = await apiFetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
    showToast('🗑️ Course deleted successfully.', 'success');
    return response;
  } catch (error) {
    showToast(`Failed to delete course: ${error.message}`, 'error');
    throw error;
  }
}

// ── GENERATE API ─────────────────────────────────────────────────────────────

/**
 * Generate a course outline using Google Gemini AI.
 * @param {string} topic - Topic for course generation (required)
 * @returns {Promise<Object>} Generated course outline object
 */
async function generateCourse(topic) {
  try {
    if (!topic || !topic.trim()) {
      throw new Error('Topic is required for course generation');
    }
    const courseData = await apiFetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ topic: topic.trim() }),
    });
    showToast(`✨ Course outline generated for "${topic}"!`, 'success');
    return courseData;
  } catch (error) {
    showToast(`Failed to generate course: ${error.message}`, 'error');
    throw error;
  }
}
