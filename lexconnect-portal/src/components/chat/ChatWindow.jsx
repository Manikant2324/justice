import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Send, Paperclip, FileText, Image, Mic, Video, Download, X } from 'lucide-react';

export const ChatWindow = ({ caseId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const getFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Polling for real-time update feel
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`/api/cases/${caseId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview('');
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    try {
      setLoading(true);
      const formData = new FormData();
      if (text.trim()) formData.append('text', text);
      if (selectedFile) formData.append('file', selectedFile);

      const res = await axios.post(`/api/cases/${caseId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages((prev) => [...prev, res.data]);
      setText('');
      setSelectedFile(null);
      setFilePreview('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '1rem 1.25rem',
        background: 'var(--navy-dark)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(197, 160, 89, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--gold-accent)' }}>
            Encrypted Client ↔ Lawyer Channel
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>End-to-End Privileged</span>
      </div>

      {/* Messages Stream */}
      <div style={{
        flex: 1,
        padding: '1.25rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#F8FAFC'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem' }}>No messages yet. Start your confidential legal conversation.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?._id === user._id || msg.sender === user._id;

            return (
              <div
                key={msg._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span style={{ fontWeight: 600 }}>{msg.sender?.name || 'User'}</span>
                  <span>•</span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className={isMe ? 'chat-bubble-sender' : 'chat-bubble-receiver'}>
                  {msg.text && <p style={{ fontSize: '0.9rem', marginBottom: msg.fileUrl ? '0.5rem' : 0 }}>{msg.text}</p>}

                  {/* Attachment Handlers */}
                  {msg.fileUrl && (
                    <div style={{
                      marginTop: '0.4rem',
                      background: isMe ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                      padding: '0.6rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid ' + (isMe ? 'rgba(255, 255, 255, 0.2)' : 'var(--border-light)')
                    }}>
                      {/* Image File */}
                      {msg.fileType === 'image' && (
                        <div style={{ maxWidth: '280px' }}>
                          <img
                            src={getFileUrl(msg.fileUrl)}
                            alt={msg.fileName}
                            style={{ width: '100%', borderRadius: '6px', cursor: 'pointer' }}
                            onClick={() => window.open(getFileUrl(msg.fileUrl), '_blank')}
                          />
                        </div>
                      )}

                      {/* PDF File */}
                      {msg.fileType === 'pdf' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={24} color={isMe ? 'var(--gold-accent)' : 'var(--navy-dark)'} />
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, truncate: 'true' }}>{msg.fileName}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>PDF Document ({msg.fileSize})</div>
                          </div>
                          <a
                            href={getFileUrl(msg.fileUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: isMe ? '#FFFFFF' : 'var(--navy-dark)' }}
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      )}

                      {/* Audio File */}
                      {msg.fileType === 'audio' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600 }}>
                            <Mic size={16} /> {msg.fileName || 'Audio Note'}
                          </div>
                          <audio controls src={getFileUrl(msg.fileUrl)} style={{ width: '100%', height: '36px' }} />
                        </div>
                      )}

                      {/* Video File */}
                      {msg.fileType === 'video' && (
                        <div style={{ maxWidth: '300px' }}>
                          <video controls src={getFileUrl(msg.fileUrl)} style={{ width: '100%', borderRadius: '6px' }} />
                        </div>
                      )}

                      {/* Generic File */}
                      {msg.fileType === 'document' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <FileText size={20} />
                          <span style={{ fontSize: '0.85rem' }}>{msg.fileName}</span>
                          <a href={getFileUrl(msg.fileUrl)} download target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}><Download size={16} /></a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected File Badge */}
      {selectedFile && (
        <div style={{
          padding: '0.5rem 1rem',
          background: '#FEF3C7',
          borderTop: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Paperclip size={14} color="#92400E" />
            <span style={{ fontWeight: 600, color: '#92400E' }}>Attachment: {selectedFile.name}</span>
          </div>
          <button onClick={() => { setSelectedFile(null); setFilePreview(''); }}>
            <X size={16} color="#92400E" />
          </button>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSendMessage} style={{
        padding: '0.85rem 1.25rem',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: '#FFFFFF'
      }}>
        <label style={{ cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          <Paperclip size={20} />
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.mp3,.wav,.mp4,.webm,.doc,.docx"
            style={{ display: 'none' }}
          />
        </label>

        <input
          type="text"
          placeholder="Write your confidential message or attach PDF/media..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ padding: '0.65rem 1.2rem' }}
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
