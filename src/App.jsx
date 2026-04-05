import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Ticket, FileText, BarChart3, Bell, Star, Settings, LogOut,
  ChevronRight, Clock, AlertTriangle, CheckCircle, X, MessageCircle,
  Send, Download, Search, Filter, Eye, Plus, RotateCcw, Trash2
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Context for global state
const AppContext = createContext();

// Mock initial data with calculated priorities
const initialTickets = [
  {
    id: 'TKT-001234',
    subject: 'Cannot access billing section',
    description: 'Getting error when trying to view my invoices',
    category: 'Billing Issue',
    emotion: 'frustrated',
    emotionWeight: 0.75,
    businessPriority: 3,
    finalPriority: 0.64,
    predictedTTR: 24,
    status: 'Resolved',
    slaLimit: 48,
    slaRemaining: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    timeline: [
      { status: 'Created', time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
      { status: 'Assigned', time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), completed: true },
      { status: 'Processing', time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
      { status: 'Resolved', time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true }
    ],
    rating: 4,
    comment: 'Quick resolution, thanks!'
  },
  {
    id: 'TKT-001235',
    subject: 'Feature request: Dark mode',
    description: 'Would love to have dark mode option in the app',
    category: 'Feature Request',
    emotion: 'calm',
    emotionWeight: 0.25,
    businessPriority: 2,
    finalPriority: 0.29,
    predictedTTR: 72,
    status: 'In Progress',
    slaLimit: 72,
    slaRemaining: 36,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
    timeline: [
      { status: 'Created', time: new Date(Date.now() - 36 * 60 * 60 * 1000), completed: true },
      { status: 'Assigned', time: new Date(Date.now() - 35 * 60 * 60 * 1000), completed: true },
      { status: 'Processing', time: new Date(Date.now() - 12 * 60 * 60 * 1000), completed: true },
      { status: 'Resolved', time: null, completed: false }
    ]
  },
  {
    id: 'TKT-001236',
    subject: 'App crashes on startup',
    description: 'The mobile app crashes immediately after opening',
    category: 'Technical Issue',
    emotion: 'angry',
    emotionWeight: 1.0,
    businessPriority: 5,
    finalPriority: 0.85,
    predictedTTR: 12,
    status: 'Under Review',
    slaLimit: 24,
    slaRemaining: 18,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    timeline: [
      { status: 'Created', time: new Date(Date.now() - 6 * 60 * 60 * 1000), completed: true },
      { status: 'Assigned', time: new Date(Date.now() - 5 * 60 * 60 * 1000), completed: true },
      { status: 'Processing', time: null, completed: false },
      { status: 'Resolved', time: null, completed: false }
    ]
  }
];

// Calculate priority for tickets
const calculatePriority = (emotionWeight, waitingHours, businessPriority) => {
  const emotionComponent = emotionWeight * 0.5;
  const waitingComponent = Math.min(waitingHours / 72, 1) * 0.3;
  const businessComponent = (businessPriority / 5) * 0.2;
  return (emotionComponent + waitingComponent + businessComponent).toFixed(2);
};

// Sidebar Component
function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/raise-ticket', icon: Ticket, label: 'Raise Ticket' },
    { path: '/my-tickets', icon: FileText, label: 'My Tickets' },
    { path: '/analytics', icon: BarChart3, label: 'My Analytics' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/feedback', icon: Star, label: 'Feedback' },
    { path: '/profile', icon: Settings, label: 'Profile' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">Support Hub</div>
          <div className="logo-sub">Ticket Management System</div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-mini-card">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <h4>John Doe</h4>
              <p>Premium User</p>
            </div>
          </div>
          <button className="nav-item" style={{ marginTop: 12, width: '100%' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

// Mobile Header
function MobileHeader({ onMenuClick }) {
  return (
    <div className="mobile-header">
      <button className="menu-btn" onClick={onMenuClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className="logo">Support Hub</div>
      <div style={{ width: 40 }}></div>
    </div>
  );
}

// Animated Counter
function AnimatedCounter({ value, duration = 1500 }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    const incrementTime = duration / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
}

// Dashboard Page
function DashboardPage() {
  const { tickets } = useContext(AppContext);
  
  const totalTickets = tickets.length;
  const activeTickets = tickets.filter(t => !['Resolved', 'Cancelled'].includes(t.status)).length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;
  const avgResolutionTime = resolvedTickets > 0 
    ? Math.round(tickets.filter(t => t.status === 'Resolved').reduce((acc, t) => acc + t.predictedTTR, 0) / resolvedTickets)
    : 0;
  const slaBreaches = tickets.filter(t => t.slaRemaining < 0).length;
  
  const recentTickets = tickets.slice(0, 3);
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Welcome back, John! 👋</h1>
        <p>Track and manage your support tickets with AI-powered priority system</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Ticket />
          </div>
          <div className="stat-value"><AnimatedCounter value={totalTickets} /></div>
          <div className="stat-label">Total Tickets Raised</div>
          <div className="stat-trend up">↑ 12% from last month</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-value"><AnimatedCounter value={activeTickets} /></div>
          <div className="stat-label">Active Tickets</div>
          <div className="stat-trend">In progress</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle />
          </div>
          <div className="stat-value"><AnimatedCounter value={resolvedTickets} /></div>
          <div className="stat-label">Resolved Tickets</div>
          <div className="stat-trend up">↑ 8% from last month</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-value"><AnimatedCounter value={avgResolutionTime} />h</div>
          <div className="stat-label">Avg Resolution Time</div>
          <div className="stat-trend down">↓ 15% faster</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' }}>
            <AlertTriangle />
          </div>
          <div className="stat-value"><AnimatedCounter value={slaBreaches} /></div>
          <div className="stat-label">SLA Breach Alerts</div>
          <div className="stat-trend down">↓ 3 from last week</div>
        </div>
      </div>
      
      <div className="recent-tickets">
        <h3>Recent Tickets</h3>
        {recentTickets.map(ticket => (
          <Link to={`/ticket/${ticket.id}`} key={ticket.id} className="ticket-card">
            <div className="ticket-card-left">
              <h4>{ticket.subject}</h4>
              <p>{ticket.id} • {ticket.category}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`emotion-badge ${ticket.emotion}`}>{ticket.emotion}</span>
              <span className={`badge badge-${ticket.status.toLowerCase().replace(' ', '')}`}>{ticket.status}</span>
              <ChevronRight size={20} color="#71717A" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Raise Ticket Page
function RaiseTicketPage() {
  const { addTicket, setShowSuccess, setSuccessTicketId } = useContext(AppContext);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    attachment: null
  });

  const HF_API_KEY = 'YOUR_HF_TOKEN_HERE'; // Get free from https://huggingface.co/settings/tokens

  const detectEmotion = async (text) => {
    if (!text.trim()) return { emotion: 'neutral', weight: 0.5 };
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
      const data = await response.json();
      if (!data?.[0]) return { emotion: 'neutral', weight: 0.5 };
      const { label, score } = data[0];
      let emotion;
      if (label === 'NEGATIVE') {
        emotion = score > 0.8 ? 'angry' : 'frustrated';
      } else if (label === 'NEUTRAL') {
        emotion = 'neutral';
      } else { // POSITIVE
        emotion = 'calm';
      }
      return { emotion, weight: emotionWeights[emotion] };
    } catch (error) {
      console.error('Emotion detection failed:', error);
      return { emotion: 'neutral', weight: 0.5 };
    }
  };



// emotionKeywords removed - now using HF API only


  const emotionWeights = {
    angry: 1.0,
    frustrated: 0.75,
    neutral: 0.5,
    calm: 0.25
  };

  const businessPriorities = {
    'Technical Issue': 4,
    'Billing Issue': 3,
    'Product Complaint': 3,
    'Feature Request': 2,
    'General Inquiry': 1
  };

// keyword-based detectEmotion replaced with HF API version above

  const [suggestion, setSuggestion] = useState('');
  
  const categories = [
    'Technical Issue',
    'Billing Issue', 
    'Product Complaint',
    'Feature Request',
    'General Inquiry'
  ];
  

  

  
  const aiSuggestions = {
    restart: "Have you tried restarting your device? This resolves most technical issues.",
    billing: "Check the billing invoice section in your account settings. You can find it under Profile > Billing.",
    error: "Please share the exact error message if possible. This helps us diagnose faster.",
    login: "Try clearing your browser cache and cookies, then attempt to login again."
  };
  
  const handleDescriptionChange = (e) => {
    const desc = e.target.value;
    setFormData({ ...formData, description: desc });
    
    // Check for keywords
    const keywords = Object.keys(aiSuggestions);
    for (const keyword of keywords) {
      if (desc.toLowerCase().includes(keyword)) {
        setSuggestion(aiSuggestions[keyword]);
        return;
      }
    }
    setSuggestion('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Detect emotion from description
    const { emotion, weight: emotionWeight } = await detectEmotion(formData.description);
    
    const ticketId = `TKT-${String(Math.floor(100000 + Math.random() * 900000))}`;
    const businessPriority = businessPriorities[formData.category];
    const waitingHours = 0;
    const finalPriority = calculatePriority(emotionWeight, waitingHours, businessPriority);
    
    // Predict TTR based on priority
    const predictedTTR = Math.round(72 - (parseFloat(finalPriority) * 48));
    
    const newTicket = {
      id: ticketId,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      emotion,
      emotionWeight,
      businessPriority,
      finalPriority,
      predictedTTR: Math.max(predictedTTR, 4),
      status: 'Pending',
      slaLimit: 48,
      slaRemaining: 48,
      createdAt: new Date(),
      timeline: [
        { status: 'Created', time: new Date(), completed: true },
        { status: 'Assigned', time: null, completed: false },
        { status: 'Processing', time: null, completed: false },
        { status: 'Resolved', time: null, completed: false }
      ]
    };
    
    addTicket(newTicket);
    setSuccessTicketId(ticketId);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      subject: '',
      description: '',
      category: '',
      attachment: null
    });
  };
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Raise a Ticket</h1>
        <p>Submit your issue and our AI system will prioritize it automatically</p>
      </div>
      
      <div className="glass-card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Brief summary of your issue"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={handleDescriptionChange}
              required
            />
            {suggestion && (
              <div className="suggestion-box">
                <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  AI Suggestion
                </h4>
                <p>{suggestion}</p>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Attachment (Optional)</label>
            <input
              type="file"
              className="form-input"
              onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Ticket size={18} />
            Submit Ticket
          </button>
        </form>
      </div>
    </div>
  );
}

// My Tickets Page
function MyTicketsPage() {
  const { tickets, updateTicketStatus, getTicketById } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  const statuses = ['All', 'Pending', 'Under Review', 'In Progress', 'Escalated', 'Resolved'];
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getPriorityBadge = (priority) => {
    if (priority >= 0.7) return 'badge-high';
    if (priority >= 0.4) return 'badge-medium';
    return 'badge-low';
  };
  
  const getStatusBadgeClass = (status) => {
    return `badge badge-${status.toLowerCase().replace(' ', '')}`;
  };
  
  const SLATimer = ({ ticket }) => {
    const [remaining, setRemaining] = useState(ticket.slaRemaining);
    
    useEffect(() => {
      if (ticket.status === 'Resolved') return;
      
      const interval = setInterval(() => {
        setRemaining(prev => Math.max(prev - 1/60, -1));
      }, 60000);
      
      return () => clearInterval(interval);
    }, [ticket.status]);
    
    const hours = Math.floor(remaining);
    const minutes = Math.floor((remaining - hours) * 60);
    
    let timerClass = 'sla-timer';
    if (remaining < 0) timerClass += ' danger';
    else if (remaining < 1) timerClass += ' warning';
    
    if (remaining < 0) return <span className={timerClass}>SLA BREACHED</span>;
    return <span className={timerClass}>{hours}h {minutes}m</span>;
  };
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>My Tickets</h1>
        <p>View and manage all your support tickets</p>
      </div>
      
      <div className="glass-card">
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: '#71717A' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ID or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: 150 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="ticket-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Subject</th>
                <th>Emotion</th>
                <th>Priority</th>
                <th>TTR</th>
                <th>Status</th>
                <th>SLA</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td><span className="ticket-id">{ticket.id}</span></td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ticket.subject}
                  </td>
                  <td>
                    <span className={`emotion-badge ${ticket.emotion}`}>
                      {ticket.emotion.charAt(0).toUpperCase() + ticket.emotion.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getPriorityBadge(ticket.finalPriority)}`}>
                      {ticket.finalPriority}
                    </span>
                  </td>
                  <td>{ticket.predictedTTR}h</td>
                  <td>
                    <span className={getStatusBadgeClass(ticket.status)}>{ticket.status}</span>
                  </td>
                  <td><SLATimer ticket={ticket} /></td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/ticket/${ticket.id}`}>
                        <button className="action-btn" title="View Details">
                          <Eye size={16} />
                        </button>
                      </Link>
                      {ticket.status === 'Resolved' && (
                        <button 
                          className="action-btn" 
                          title="Reopen Ticket"
                          onClick={() => updateTicketStatus(ticket.id, 'Pending')}
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {['Pending', 'Under Review'].includes(ticket.status) && (
                        <button 
                          className="action-btn danger" 
                          title="Cancel Ticket"
                          onClick={() => updateTicketStatus(ticket.id, 'Cancelled')}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="empty-state">
            <FileText />
            <p>No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Ticket Details Page
function TicketDetailsPage() {
  const { getTicketById } = useContext(AppContext);
  const location = useLocation();
  const ticketId = location.pathname.split('/').pop();
  const ticket = getTicketById(ticketId);
  
  if (!ticket) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <p>Ticket not found</p>
        </div>
      </div>
    );
  }
  
  const downloadPDF = async () => {
    const element = document.getElementById('ticket-details');
    const canvas = await html2canvas(element);
    const pdf = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`${ticket.id}.pdf`);
  };
  
  const getWaitingHours = () => {
    const created = new Date(ticket.createdAt);
    const now = new Date();
    return Math.round((now - created) / (1000 * 60 * 60));
  };
  
  const emotionComponent = (ticket.emotionWeight * 0.5).toFixed(2);
  const waitingComponent = (Math.min(getWaitingHours() / 72, 1) * 0.3).toFixed(2);
  const businessComponent = ((ticket.businessPriority / 5) * 0.2).toFixed(2);
  
  return (
    <div className="page-enter" id="ticket-details">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>{ticket.subject}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ticket-id">{ticket.id}</span>
              <span>•</span>
              <span>{ticket.category}</span>
            </p>
          </div>
          <button className="btn btn-secondary" onClick={downloadPDF}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="grid-2">
        <div>
          <div className="glass-card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Ticket Information</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label className="form-label">Status</label>
                <span className={`badge badge-${ticket.status.toLowerCase().replace(' ', '')}`}>
                  {ticket.status}
                </span>
              </div>
              <div>
                <label className="form-label">Emotion Detected</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`emotion-badge ${ticket.emotion}`}>
                    {ticket.emotion.charAt(0).toUpperCase() + ticket.emotion.slice(1)}
                  </span>
                  <span style={{ color: '#71717A', fontSize: 13 }}>(Weight: {ticket.emotionWeight})</span>
                </div>
              </div>
              <div>
                <label className="form-label">Predicted TTR</label>
                <p>{ticket.predictedTTR} hours</p>
              </div>
              <div>
                <label className="form-label">SLA Limit</label>
                <p>{ticket.slaLimit} hours</p>
              </div>
              <div>
                <label className="form-label">Created</label>
                <p>{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              {ticket.escalated && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.2)', 
                  padding: 12, 
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <AlertTriangle size={18} color="#EF4444" />
                  <span style={{ color: '#EF4444' }}>This ticket has been escalated</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card">
            <h3 style={{ marginBottom: 16 }}>Priority Breakdown</h3>
            <p style={{ color: '#71717A', marginBottom: 16, fontSize: 14 }}>
              Final Priority = (Emotion × 0.5) + (Waiting Time × 0.3) + (Business Priority × 0.2)
            </p>
            <div className="priority-breakdown">
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Emotion Component</span>
                  <span className="breakdown-value">{emotionComponent}</span>
                </div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{ 
                      width: `${(parseFloat(emotionComponent) / 0.5) * 100}%`,
                      background: 'var(--accent-primary)'
                    }} 
                  />
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Waiting Time Component</span>
                  <span className="breakdown-value">{waitingComponent}</span>
                </div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{ 
                      width: `${(parseFloat(waitingComponent) / 0.3) * 100}%`,
                      background: 'var(--accent-secondary)'
                    }} 
                  />
                </div>
              </div>
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-label">Business Priority Component</span>
                  <span className="breakdown-value">{businessComponent}</span>
                </div>
                <div className="breakdown-bar">
                  <div 
                    className="breakdown-fill" 
                    style={{ 
                      width: `${(parseFloat(businessComponent) / 0.2) * 100}%`,
                      background: 'var(--success)'
                    }} 
                  />
                </div>
              </div>
              <div style={{ 
                padding: 16, 
                background: 'var(--gradient)', 
                borderRadius: 12,
                textAlign: 'center',
                marginTop: 8
              }}>
                <span style={{ fontSize: 14 }}>Final Priority Score</span>
                <div style={{ fontSize: 32, fontWeight: 700 }}>{ticket.finalPriority}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="glass-card">
            <h3 style={{ marginBottom: 16 }}>Timeline</h3>
            <div className="timeline">
              {ticket.timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className={`timeline-dot ${item.completed ? 'completed' : ''}`}>
                    {item.completed && <CheckCircle size={12} />}
                  </div>
                  <div className="timeline-content">
                    <h4>{item.status}</h4>
                    <p>{item.time ? item.time.toLocaleString() : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Page
function AnalyticsPage() {
  const { tickets } = useContext(AppContext);
  
  // Emotion distribution
  const emotionData = [
    { name: 'Angry', value: tickets.filter(t => t.emotion === 'angry').length, color: '#EF4444' },
    { name: 'Frustrated', value: tickets.filter(t => t.emotion === 'frustrated').length, color: '#F97316' },
    { name: 'Neutral', value: tickets.filter(t => t.emotion === 'neutral').length, color: '#6B7280' },
    { name: 'Calm', value: tickets.filter(t => t.emotion === 'calm').length, color: '#22C55E' }
  ].filter(d => d.value > 0);
  
  // Resolution trend (mock data)
  const resolutionTrend = [
    { day: 'Mon', time: 24 },
    { day: 'Tue', time: 18 },
    { day: 'Wed', time: 32 },
    { day: 'Thu', time: 28 },
    { day: 'Fri', time: 22 },
    { day: 'Sat', time: 15 },
    { day: 'Sun', time: 20 }
  ];
  
  // Priority distribution
  const priorityData = [
    { name: 'High', value: tickets.filter(t => t.finalPriority >= 0.7).length, fill: '#EF4444' },
    { name: 'Medium', value: tickets.filter(t => t.finalPriority >= 0.4 && t.finalPriority < 0.7).length, fill: '#F59E0B' },
    { name: 'Low', value: tickets.filter(t => t.finalPriority < 0.4).length, fill: '#22C55E' }
  ];
  
  // Satisfaction trend (mock)
  const satisfactionData = [
    { week: 'W1', score: 3.5 },
    { week: 'W2', score: 4.0 },
    { week: 'W3', score: 3.8 },
    { week: 'W4', score: 4.2 }
  ];
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>My Analytics</h1>
        <p>Track your ticket patterns and satisfaction metrics</p>
      </div>
      
      <div className="grid-2">
        <div className="chart-container">
          <h3 className="chart-title">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252542" />
              <XAxis dataKey="name" stroke="#71717A" />
              <YAxis stroke="#71717A" />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Resolution Time Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resolutionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252542" />
              <XAxis dataKey="day" stroke="#71717A" />
              <YAxis stroke="#71717A" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="time" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={{ fill: '#7C3AED', strokeWidth: 2 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={satisfactionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252542" />
              <XAxis dataKey="week" stroke="#71717A" />
              <YAxis stroke="#71717A" domain={[0, 5]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Notifications Page
function NotificationsPage() {
  const { notifications, markNotificationRead } = useContext(AppContext);
  const [localNotifications, setLocalNotifications] = useState(notifications);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: ['status', 'escalation', 'sla', 'resolved'][Math.floor(Math.random() * 4)],
        title: 'Ticket Update',
        message: `Your ticket status has been updated to ${['Pending', 'Under Review', 'In Progress'][Math.floor(Math.random() * 3)]}`,
        time: new Date(),
        read: false
      };
      setLocalNotifications(prev => [newNotification, ...prev]);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status': return { icon: Bell, className: 'status' };
      case 'escalation': return { icon: AlertTriangle, className: 'escalation' };
      case 'sla': return { icon: Clock, className: 'sla' };
      case 'resolved': return { icon: CheckCircle, className: 'resolved' };
      default: return { icon: Bell, className: 'status' };
    }
  };
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated on your ticket status</p>
      </div>
      
      <div>
        {localNotifications.map(notification => {
          const { icon: Icon, className } = getNotificationIcon(notification.type);
          return (
            <div 
              key={notification.id} 
              className="notification-item"
              onClick={() => markNotificationRead(notification.id)}
              style={{ opacity: notification.read ? 0.6 : 1 }}
            >
              <div className={`notification-icon ${className}`}>
                <Icon size={18} />
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <div className="notification-time">
                  {notification.time.toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        
        {localNotifications.length === 0 && (
          <div className="empty-state">
            <Bell />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Feedback Page
function FeedbackPage() {
  const { tickets, submitRating } = useContext(AppContext);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  
  const ratings = tickets.filter(t => t.rating).map(t => t.rating);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) 
    : 0;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTicket && rating > 0) {
      submitRating(selectedTicket, rating, comment);
      setSubmitted(true);
    }
  };
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Feedback</h1>
        <p>Rate your support experience</p>
      </div>
      
      <div className="glass-card" style={{ marginBottom: 24, textAlign: 'center' }}>
        <h3>Customer Satisfaction Score</h3>
        <div style={{ 
          fontSize: 64, 
          fontWeight: 700, 
          background: 'var(--gradient)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '16px 0'
        }}>
          {avgRating}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Star 
              key={star} 
              size={24} 
              fill={star <= Math.round(avgRating) ? '#F59E0B' : 'none'}
              color="#F59E0B"
            />
          ))}
        </div>
        <p style={{ color: '#71717A', marginTop: 8 }}>
          Based on {ratings.length} ratings
        </p>
      </div>
      
      {submitted ? (
        <div className="glass-card text-center">
          <div className="success-icon" style={{ margin: '0 auto 16px' }}>
            <CheckCircle />
          </div>
          <h3>Thank you for your feedback!</h3>
          <p style={{ color: '#71717A' }}>Your input helps us improve our service.</p>
          <button 
            className="btn btn-primary" 
            style={{ marginTop: 16 }}
            onClick={() => setSubmitted(false)}
          >
            Submit Another
          </button>
        </div>
      ) : (
        <div className="glass-card">
          <h3 style={{ marginBottom: 16 }}>Rate Your Experience</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Ticket</label>
              <select
                className="form-select"
                value={selectedTicket}
                onChange={(e) => setSelectedTicket(e.target.value)}
                required
              >
                <option value="">Choose a resolved ticket</option>
                {resolvedTickets.map(ticket => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.id} - {ticket.subject}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={40}
                    fill={star <= rating ? '#F59E0B' : 'none'}
                    color="#F59E0B"
                    className={star <= rating ? 'active' : ''}
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  />
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Comment (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Tell us more about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={!selectedTicket || rating === 0}
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// Profile Page
function ProfilePage() {
  const { user, updateUser, tickets } = useContext(AppContext);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  const avgResolution = resolvedTickets.length > 0
    ? Math.round(resolvedTickets.reduce((acc, t) => acc + t.predictedTTR, 0) / resolvedTickets.length)
    : 0;
  
  const handleSave = () => {
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  
  return (
    <div className="page-enter">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information</p>
      </div>
      
      <div className="profile-section">
        <div className="glass-card" style={{ marginBottom: 24 }}>
          <div className="profile-header">
            <div className="profile-avatar">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{name}</h2>
              <p>{email}</p>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
        
        <div className="glass-card">
          <h3 style={{ marginBottom: 16 }}>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{totalTickets}</div>
              <div className="stat-label">Total Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{resolvedTickets.length}</div>
              <div className="stat-label">Resolved</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{avgResolution}h</div>
              <div className="stat-label">Avg Resolution</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success Modal
function SuccessModal() {
  const { showSuccess, successTicketId, setShowSuccess } = useContext(AppContext);
  const { tickets } = useContext(AppContext);
  const latestTicket = tickets[0]; // newest ticket
  
  if (!showSuccess) return null;
  
  return (
    <div className="modal-overlay" onClick={() => setShowSuccess(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="success-popup">
          <div className="success-icon">
            <CheckCircle />
          </div>
          <h3>✅ Ticket Created</h3>
          <p>Your ticket has been created with AI-powered analysis.</p>
          <div className="ticket-id-display">
            <span>{successTicketId}</span>
          </div>
          {latestTicket && (
            <>
              <div className="form-group" style={{ textAlign: 'left', margin: '16px 0' }}>
                <label style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: 4 }}>🤖 Detected Emotion</label>
                <span className={`emotion-badge ai-detected ${latestTicket.emotion}`}>
                  {latestTicket.emotion.charAt(0).toUpperCase() + latestTicket.emotion.slice(1)}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: 16 }}>
                ⏱ Predicted TTR: {latestTicket.predictedTTR} hours
              </div>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setShowSuccess(false)}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Chat Widget
function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI assistant. How can I help you today?", bot: true }
  ]);
  const [input, setInput] = useState('');
  
  const botResponses = [
    "I understand. Let me help you with that.",
    "Could you provide more details about your issue?",
    "Have you tried restarting the application?",
    "I'll connect you with a support agent shortly.",
    "Thank you for your patience."
  ];
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, bot: false }]);
    setInput('');
    
    setTimeout(() => {
      const response = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prev => [...prev, { text: response, bot: true }]);
    }, 1000);
  };
  
  return (
    <div className="chat-widget">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <MessageCircle size={20} />
            <span>Support Chat</span>
            <button 
              className="modal-close" 
              onClick={() => setIsOpen(false)}
              style={{ marginLeft: 'auto' }}
            >
              <X size={18} />
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.bot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      
      <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

// Main App
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'resolved',
      title: 'Ticket Resolved',
      message: 'Your ticket TKT-001234 has been resolved successfully.',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'escalation',
      title: 'Escalation Alert',
      message: 'Ticket TKT-001236 has been escalated to priority support.',
      time: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false
    }
  ]);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState('');
  
  const addTicket = (ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };
  
  const getTicketById = (id) => {
    return tickets.find(t => t.id === id);
  };
  
  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const timeline = [...t.timeline];
        const statusMap = {
          'Pending': 1,
          'Under Review': 2,
          'In Progress': 2,
          'Resolved': 3
        };
        const statusIndex = statusMap[newStatus];
        if (statusIndex !== undefined && timeline[statusIndex]) {
          timeline[statusIndex] = { 
            ...timeline[statusIndex], 
            time: new Date(), 
            completed: true 
          };
        }
        return { ...t, status: newStatus, timeline };
      }
      return t;
    }));
  };
  
  const submitRating = (ticketId, rating, comment) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, rating, comment };
      }
      return t;
    }));
  };
  
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };
  
  // Auto status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const pendingTickets = tickets.filter(t => 
        t.status === 'Pending' || t.status === 'Under Review' || t.status === 'In Progress'
      );
      
      if (pendingTickets.length > 0) {
        const ticket = pendingTickets[0];
        const statusFlow = {
          'Pending': 'Under Review',
          'Under Review': 'In Progress',
          'In Progress': 'Resolved'
        };
        
        const newStatus = statusFlow[ticket.status];
        if (newStatus) {
          updateTicketStatus(ticket.id, newStatus);
        }
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [tickets]);
  
  const contextValue = {
    tickets,
    notifications,
    user,
    showSuccess,
    successTicketId,
    addTicket,
    getTicketById,
    updateTicketStatus,
    submitRating,
    markNotificationRead,
    updateUser,
    setShowSuccess,
    setSuccessTicketId
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className="app-container">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <MobileHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/raise-ticket" element={<RaiseTicketPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/ticket/:id" element={<TicketDetailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          
          <ChatWidget />
          <SuccessModal />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App
