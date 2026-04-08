import { useState, useEffect, useCallback, useMemo } from 'react';
import { MONTH_NAMES } from '../utils/calendar';

const TAG_OPTIONS = ['Personal', 'Work', 'Important'];
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * NotesDrawer — slide-in side drawer (desktop) / bottom sheet (mobile).
 * Contains:
 *   1. Date header (64px Playfair day number)
 *   2. Note textarea
 *   3. Tags row (Personal · Work · Important)
 *   4. Set Reminder section
 *   5. Saved reminders list
 *   6. Sticky save button
 *
 * All data persisted to localStorage with spec-exact key patterns.
 */
export default function NotesDrawer({ dateKey, isOpen, onClose, theme }) {
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMsg, setReminderMsg] = useState('');
  const [reminders, setReminders] = useState([]);
  const [noteSaved, setNoteSaved] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  // Parse date info from dateKey
  const dateInfo = useMemo(() => {
    if (!dateKey) return { day: '', dayName: '', monthName: '', year: '' };
    const [y, m, d] = dateKey.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return {
      day: parseInt(d),
      dayName: DAY_LABELS[date.getDay()],
      monthName: MONTH_NAMES[parseInt(m) - 1],
      year: y,
    };
  }, [dateKey]);

  // Load note
  useEffect(() => {
    if (!dateKey) return;
    try {
      const saved = localStorage.getItem(`note_${dateKey}`) || '';
      setNote(saved);
    } catch { setNote(''); }
    setNoteSaved(false);
  }, [dateKey]);

  // Load tags
  useEffect(() => {
    if (!dateKey) return;
    try {
      const saved = localStorage.getItem(`tag_${dateKey}`) || '';
      setTags(saved ? saved.split(',') : []);
    } catch { setTags([]); }
  }, [dateKey]);

  // Load reminders
  useEffect(() => {
    if (!dateKey) return;
    try {
      const saved = JSON.parse(localStorage.getItem(`reminder_${dateKey}`) || '[]');
      setReminders(saved);
    } catch { setReminders([]); }
    setReminderSet(false);
  }, [dateKey]);

  // ── Save note ──
  const saveNote = useCallback(() => {
    if (!dateKey) return;
    try {
      if (note.trim()) {
        localStorage.setItem(`note_${dateKey}`, note);
      } else {
        localStorage.removeItem(`note_${dateKey}`);
      }
    } catch {}
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  }, [dateKey, note]);

  // ── Toggle tag ──
  const toggleTag = useCallback((tag) => {
    setTags(prev => {
      const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
      try {
        if (next.length) {
          localStorage.setItem(`tag_${dateKey}`, next.join(','));
        } else {
          localStorage.removeItem(`tag_${dateKey}`);
        }
      } catch {}
      return next;
    });
  }, [dateKey]);

  // ── Schedule reminder ──
  const scheduleReminder = useCallback(async () => {
    if (!reminderTime || !reminderMsg.trim() || !dateKey) return;

    // Build full datetime from date + time
    const targetTime = new Date(`${dateKey}T${reminderTime}`).getTime();
    if (isNaN(targetTime) || targetTime <= Date.now()) return;

    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
      }
      if (Notification.permission !== 'granted') return;

      const delay = targetTime - Date.now();
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setTimeout(() => {
        new Notification('📅 Calendar Reminder', { body: reminderMsg });
      }, delay);

      const newReminder = { time: reminderTime, message: reminderMsg, id };
      const updated = [...reminders, newReminder];
      setReminders(updated);

      try {
        localStorage.setItem(`reminder_${dateKey}`, JSON.stringify(updated));
      } catch {}

      setReminderSet(true);
      setTimeout(() => setReminderSet(false), 1500);
      setReminderMsg('');
      setReminderTime('');
    }
  }, [dateKey, reminderTime, reminderMsg, reminders]);

  // ── Delete reminder ──
  const deleteReminder = useCallback((id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    try {
      if (updated.length) {
        localStorage.setItem(`reminder_${dateKey}`, JSON.stringify(updated));
      } else {
        localStorage.removeItem(`reminder_${dateKey}`);
      }
    } catch {}
  }, [dateKey, reminders]);

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const accent = theme?.accent || '#4A90D9';
  const textAccent = theme?.textAccent || '#7DB8F0';

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`notes-drawer ${isOpen ? 'open' : ''}`}>
        {/* Close button */}
        <button className="drawer-close" onClick={onClose} aria-label="Close drawer">
          ×
        </button>

        {/* Date Header */}
        <div className="drawer-date-header">
          <div className="drawer-day-number">{dateInfo.day}</div>
          <div className="drawer-day-name" style={{ color: textAccent }}>
            {dateInfo.dayName} · {dateInfo.monthName} {dateInfo.year}
          </div>
        </div>

        {/* Note Section */}
        <div className="drawer-section">
          <div className="drawer-section-title" style={{ color: textAccent }}>NOTE</div>
          <textarea
            className="drawer-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for this day…"
            style={{ '--focus-color': accent }}
            onFocus={(e) => e.target.style.borderColor = accent}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {/* Tags Row */}
        <div className="drawer-section">
          <div className="tags-row">
            {TAG_OPTIONS.map(tag => (
              <button
                key={tag}
                className={`tag-pill ${tags.includes(tag) ? 'selected' : 'unselected'}`}
                style={tags.includes(tag) ? { background: accent } : {}}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Reminder Section */}
        <div className="drawer-section">
          <div className="drawer-section-title" style={{ color: textAccent }}>SET REMINDER</div>
          <div className="reminder-row">
            <input
              type="time"
              className="reminder-input"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
          <div className="reminder-row">
            <input
              type="text"
              className="reminder-input"
              value={reminderMsg}
              onChange={(e) => setReminderMsg(e.target.value)}
              placeholder="Reminder message..."
            />
          </div>
          <button
            className="reminder-set-btn"
            style={{ background: accent }}
            onClick={scheduleReminder}
          >
            {reminderSet ? '✓ Reminder Set!' : 'Set Reminder'}
          </button>
        </div>

        {/* Saved Reminders List */}
        {reminders.length > 0 && (
          <div className="drawer-section">
            <div className="drawer-section-title" style={{ color: textAccent }}>REMINDERS</div>
            {reminders.map((r) => (
              <div key={r.id} className="reminder-pill">
                <span className="reminder-pill-time">{r.time}</span>
                <span className="reminder-pill-msg">{r.message}</span>
                <button
                  className="reminder-pill-delete"
                  onClick={() => deleteReminder(r.id)}
                  aria-label="Delete reminder"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sticky Save Button */}
        <button
          className={`drawer-save-btn ${noteSaved ? 'saved' : ''}`}
          style={{
            border: `1px solid ${noteSaved ? '#4CAF50' : accent}`,
            color: noteSaved ? '#4CAF50' : accent,
          }}
          onClick={saveNote}
        >
          {noteSaved ? 'Saved ✓' : 'Save Note'}
        </button>
      </div>
    </>
  );
}
