import { useState, useEffect } from 'react';
import {
  getAssignments, getTasks, getPresentations
} from '../api';
import { MdAssignment, MdChecklist, MdDoneAll, MdWarning, MdSlideshow } from 'react-icons/md';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function UpcomingItem({ title, subject, date, type }) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' });
  const isOverdue = d < new Date();

  return (
    <div className="upcoming-item">
      <div className="upcoming-date-badge" style={{ color: isOverdue ? 'var(--danger)' : undefined }}>
        <span style={{ fontSize: '16px', fontWeight: 700 }}>{day}</span>
        <span>{month}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{title}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{subject} &bull; {type}</div>
      </div>
      {isOverdue && <span className="badge badge-overdue">Overdue</span>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, tasks: 0, tasksDone: 0, presentations: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [aRes, tRes, pRes] = await Promise.all([
          getAssignments(),
          getTasks(),
          getPresentations(),
        ]);
        const assignments = aRes.data.data;
        const tasks = tRes.data.data;
        const presentations = pRes.data.data;

        setStats({
          total: assignments.length,
          pending: assignments.filter(a => a.status === 'pending').length,
          completed: assignments.filter(a => a.status === 'completed').length,
          tasks: tasks.length,
          tasksDone: tasks.filter(t => t.completed).length,
          presentations: presentations.length,
        });

        const upcomingItems = [
          ...assignments
            .filter(a => a.status === 'pending')
            .map(a => ({ title: a.title, subject: a.subject, date: a.dueDate, type: 'Assignment' })),
          ...presentations
            .map(p => ({ title: p.title, subject: p.subject, date: p.presentationDate, type: 'Presentation' })),
        ].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 6);

        setUpcoming(upcomingItems);
      } catch (e) {
        // Backend not available — show empty dashboard rather than infinite spinner
        console.warn('Backend not reachable:', e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      <div className="page-header">
        <h1>{greeting}! 👋</h1>
        <p>Here's your academic overview for today.</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Total Assignments" value={stats.total} icon={<MdAssignment />} color="var(--primary)" />
        <StatCard label="Pending" value={stats.pending} icon={<MdWarning />} color="var(--warning)" />
        <StatCard label="Completed" value={stats.completed} icon={<MdDoneAll />} color="var(--success)" />
        <StatCard label="Daily Tasks" value={`${stats.tasksDone}/${stats.tasks}`} icon={<MdChecklist />} color="var(--accent)" />
        <StatCard label="Presentations" value={stats.presentations} icon={<MdSlideshow />} color="#a855f7" />
      </div>

      <div className="card">
        <div className="flex-between mb-16">
          <h2 style={{ fontSize: '16px', fontWeight: 600 }}>Upcoming Deadlines</h2>
          <span className="text-muted">{upcoming.length} items</span>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty-state" style={{ padding: '30px' }}>
            <div className="empty-icon">🎉</div>
            <h3>All clear!</h3>
            <p>No upcoming deadlines right now.</p>
          </div>
        ) : (
          upcoming.map((item, i) => <UpcomingItem key={i} {...item} />)
        )}
      </div>
    </div>
  );
}
