import React, { useState, useEffect, useContext } from 'react';
import { CheckCircle, Ticket, X, Download } from 'lucide-react';

const RaiseTicket = ({ addTicket, tickets }) => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    attachment: null
  });
  const [detectedEmotion, setDetectedEmotion] = useState('neutral');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  const categories = [
    { value: 'Technical Issue', label: 'Technical Issue', priority: 1.0 },
    { value: 'Billing Issue', label: 'Billing Issue', priority: 0.9 },
    { value: 'Product Complaint', label: 'Product Complaint', priority: 0.8 },
    { value: 'Feature Request', label: 'Feature Request', priority: 0.5 },
    { value: 'General Inquiry', label: 'General Inquiry', priority: 0.3 }
  ];

  const emotionKeywords = {
    angry: ["hate", "worst", "angry", "issue", "problem", "error", "fail", "not working", "broken", "crash", "crashed"],
    frustrated: ["slow", "annoying", "frustrated", "delay", "stuck", "retry", "lag", "hang", "freeze"],
    neutral: ["check", "want", "need", "info", "help", "question", "how", "what", "when", "where"],
    calm: ["thanks", "good", "great", "awesome", "nice", "working", "fine", "perfect", "excellent"]
  };

  const emotionWeights = {
    angry: 1.0,
    frustrated: 0.75,
    neutral: 0.5,
    calm: 0.25
  };

  const emotionColors = {
    angry: 'bg-red-500/20 text-red-400 border-red-400',
    frustrated: 'bg-orange-500/20 text-orange-400 border-orange-400',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-400',
    calm: 'bg-green-500/20 text-green-400 border-green-400'
  };

  // Live emotion detection
  useEffect(() => {
    if (formData.description.trim()) {
      const emotion = detectEmotion(formData.description);
      setDetectedEmotion(emotion);
    } else {
      setDetectedEmotion('neutral');
    }
  }, [formData.description]);

  const detectEmotion = (text) => {
    const tokens = text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    
    const scores = {
      angry: 0,
      frustrated: 0,
      neutral: 0,
      calm: 0
    };

    tokens.forEach(token => {
      Object.keys(emotionKeywords).forEach(emotion => {
        if (emotionKeywords[emotion].includes(token)) {
          scores[emotion]++;
        }
      });
    });

    return Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  };

  const generateTicketId = () => {
    return `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const predictTTR = () => {
    return (Math.random() * 5 + 1).toFixed(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim() || !formData.category) {
      alert('Please fill all required fields');
      return;
    }

    const emotion = detectedEmotion;
    const categoryPriority = categories.find(cat => cat.value === formData.category)?.priority || 0.3;
    const priorityScore = (emotionWeights[emotion] * 0.5) + (categoryPriority * 0.2) + 0.3;
    const ticketId = generateTicketId();
    const ttr = predictTTR();

    const newTicket = {
      id: ticketId,
      subject: formData.subject,
      description: formData.description,
      category: formData.category,
      emotion,
      priorityScore: priorityScore.toFixed(2),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ttr
    };

    addTicket(newTicket);
    setSuccessTicket(newTicket);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Raise a New Ticket
          </h1>
          <p className="text-xl text-slate-400">Our AI will automatically analyze and prioritize your issue</p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Subject *</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300"
                placeholder="Brief summary of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Description *</label>
              <textarea
                rows={6}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 resize-vertical"
                placeholder="Describe your issue in detail. Our AI will automatically detect emotion and priority..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              
              {/* Live Emotion Detection */}
              {formData.description.trim() && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🤖</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-300">AI Detected Emotion</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold mt-1 ${emotionColors[detectedEmotion]}`}>
                        <span className="capitalize">{detectedEmotion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Category *</label>
              <select
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 appearance-none bg-no-repeat bg-right"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">Attachment (Optional)</label>
              <input
                type="file"
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-500/50 file:text-white hover:file:bg-purple-400 transition-colors cursor-pointer"
                onChange={(e) => setFormData({...formData, attachment: e.target.files[0]})}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-6 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg backdrop-blur-sm border border-purple-500/30"
            >
              <Ticket size={24} />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setShowSuccess(false)}>
          <div 
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <CheckCircle size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                Ticket Created Successfully!
              </h2>
              <p className="text-slate-300 mb-8 text-lg">Your ticket has been analyzed by AI and queued for processing.</p>
              
              {/* Ticket ID */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6 mb-6">
                <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Ticket ID</p>
                <p className="text-2xl font-mono font-bold text-white">{successTicket.id}</p>
              </div>

              {/* Emotion & TTR */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="text-left">
                  <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">AI Detected Emotion</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${emotionColors[successTicket.emotion]}`}>
                    <span className="capitalize">{successTicket.emotion}</span>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Predicted Resolution</p>
                  <p className="text-2xl font-bold text-white">{successTicket.ttr} hours</p>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-purple-500/25 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center gap-3 text-lg"
                onClick={() => setShowSuccess(false)}
              >
                <span>View My Tickets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaiseTicket;
