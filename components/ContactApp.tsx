import React, { useState } from 'react';

export function ContactApp() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset sent state after 3 seconds
      setTimeout(() => setIsSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="contact-app">
      <div className="contact-sidebar">
        <div className="contact-folder active">📥 Inbox</div>
        <div className="contact-folder">📤 Sent</div>
        <div className="contact-folder">📝 Drafts</div>
        <div className="contact-folder">🗑️ Trash</div>
      </div>
      
      <div className="contact-main">
        <div className="contact-header">
          <h2>Compose Message</h2>
          <p>Get in touch for freelance opportunities, open source collaboration, or just to say hi!</p>
        </div>

        {isSent ? (
          <div className="contact-success-state">
            <div className="success-icon">✓</div>
            <h3>Message Sent Successfully!</h3>
            <p>I'll get back to you as soon as possible.</p>
            <button className="mint-button" onClick={() => setIsSent(false)}>Send Another Message</button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                disabled={isSending}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={isSending}
              />
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                required 
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                disabled={isSending}
              />
            </div>
            
            <div className="form-group message-group">
              <label>Message</label>
              <textarea 
                required 
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                disabled={isSending}
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="mint-button" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
