import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Shield, User, MessageSquare, ChevronDown, ChevronUp, Sparkles, Target, ExternalLink } from 'lucide-react';

const InstagramIcon = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function ContactUs({ coach, venueSchedule, onAddInquiry }) {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    userType: 'Archer / Student',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.emailOrPhone.trim() || !formData.message.trim()) {
      alert("Please complete all required fields before submitting your inquiry.");
      return;
    }

    const newInquiry = {
      id: 'inq_' + Date.now(),
      name: formData.name.trim(),
      emailOrPhone: formData.emailOrPhone.trim(),
      userType: formData.userType,
      subject: formData.subject,
      message: formData.message.trim(),
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'new'
    };

    if (onAddInquiry) {
      onAddInquiry(newInquiry);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        emailOrPhone: '',
        userType: 'Archer / Student',
        subject: 'General Inquiry',
        message: ''
      });
    }, 5000);
  };

  const faqs = [
    {
      q: "Where is the Heritage College Archery Target Range located?",
      a: "Our official target range is located at The Heritage College Sports Ground Target Range, Chowbaga Road, Anandapur, East Kolkata Township, Kolkata, West Bengal 700107."
    },
    {
      q: "What are the official archery practice hours?",
      a: "Daily practice sessions take place from 4:30 PM to 7:00 PM IST (Monday through Saturday). Archers practice at 70m Olympic Recurve and 50m Compound distance lines."
    },
    {
      q: "Who can register as a new archer on the portal?",
      a: "Any Heritage College student practicing or interested in college target archery can submit a registration request. New account requests are reviewed and verified by Admin/Coach."
    },
    {
      q: "How can I contact the archery team or send a message directly?",
      a: "You can reach us directly via Instagram DM (@theheritage_archery), through the contact inquiry form on this page, or by visiting the target range during daily practice hours."
    }
  ];

  return (
    <div className="fade-in-up" style={{ marginBottom: '36px' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '32px 28px',
        marginBottom: '28px',
        border: '1px solid rgba(5, 150, 105, 0.4)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(5, 150, 105, 0.2), rgba(217, 119, 6, 0.15))',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span className="badge-emerald">
            <Phone size={13} /> Official Team Contact
          </span>
          <span className="badge-gold">
            <MapPin size={13} /> Target Range Line 🎯
          </span>
        </div>

        <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 900, color: '#f8fafc', margin: '0 0 10px 0', lineHeight: 1.2 }}>
          Contact <span className="metallic-text-shine">The Heritage Archery</span>
        </h1>

        <p style={{ fontSize: 'clamp(0.92rem, 2.2vw, 1.05rem)', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '850px', margin: 0 }}>
          Have questions regarding college team practice, target distance line allocations, bow tuning sessions, or archer registrations? Reach out directly via our Instagram, DM us, or submit an inquiry below.
        </p>
      </div>

      {/* Grid Layout: Contact Info Cards + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        
        {/* Left Column: Quick Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Target Range Location */}
          <div className="glass-card hover-lift" style={{ padding: '22px', borderLeft: '4px solid #34d399' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(5, 150, 105, 0.2)', color: '#34d399', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>
                  Target Range Location
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {venueSchedule?.venue || "The Heritage College Sports Ground - Target Range, Chowbaga Road, Anandapur, East Kolkata Township, Kolkata, WB 700107"}
                </p>
              </div>
            </div>
          </div>

          {/* Practice Hours */}
          <div className="glass-card hover-lift" style={{ padding: '22px', borderLeft: '4px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', flexShrink: 0 }}>
                <Clock size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px 0' }}>
                  Daily Practice Hours
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {venueSchedule?.time || "4:30 PM - 7:00 PM IST"} (Monday – Saturday)
                </p>
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                  Distance Line: {venueSchedule?.distance || "70m & 50m Target Line"}
                </div>
              </div>
            </div>
          </div>

          {/* Official Instagram & Direct Message (DM) Hub */}
          <div className="glass-card hover-lift" style={{ 
            padding: '22px', 
            borderLeft: '4px solid #e1306c',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(225, 48, 108, 0.12))'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(220,39,67,0.35)',
                flexShrink: 0
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '12px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <InstagramIcon size={22} color="#f472b6" />
                </div>
              </div>

              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Official Instagram & DM Support
                  </h4>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(225, 48, 108, 0.2)', color: '#f472b6', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid rgba(225, 48, 108, 0.3)' }}>
                    @theheritage_archery
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: '6px 0 12px 0' }}>
                  Follow our official Instagram handle for practice updates & tournament highlights. Need instant assistance? Send us a Direct Message (DM)!
                </p>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href="https://www.instagram.com/theheritage_archery?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold"
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '10px'
                    }}
                  >
                    <InstagramIcon size={15} color="#090d16" /> Instagram Link <ExternalLink size={12} />
                  </a>

                  <a
                    href="https://ig.me/m/theheritage_archery"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      color: '#ffffff',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                      cursor: 'pointer'
                    }}
                    className="hover-lift"
                  >
                    <MessageSquare size={15} /> DM Us on Instagram 💬
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="glass-card" style={{ padding: '28px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={20} color="#fbbf24" /> Send Team Message
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
              Submit your message below. Coach Jayanta or Team Admin will respond to your inquiry.
            </p>
          </div>

          {submitted ? (
            <div style={{ background: 'rgba(5, 150, 105, 0.15)', border: '1px solid #059669', padding: '20px', borderRadius: '14px', textAlign: 'center', color: '#34d399' }}>
              <CheckCircle2 size={36} color="#34d399" style={{ marginBottom: '10px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
                Inquiry Sent Successfully!
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#a7f3d0', margin: 0 }}>
                Thank you for reaching out, <strong>{formData.name}</strong>! Coach Jayanta will review your message shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Enter your name..."
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Email or Phone Number *
                </label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Enter email or WhatsApp phone..."
                  value={formData.emailOrPhone}
                  onChange={e => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    I am a...
                  </label>
                  <select
                    className="select-glass"
                    value={formData.userType}
                    onChange={e => setFormData({ ...formData, userType: e.target.value })}
                  >
                    <option value="Archer / Student">Archer / Student</option>
                    <option value="Prospective Student">Prospective Student</option>
                    <option value="Parent / Guardian">Parent / Guardian</option>
                    <option value="Visitor / Guest">Visitor / Guest</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Subject
                  </label>
                  <select
                    className="select-glass"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Practice & Range Timings">Practice & Range Timings</option>
                    <option value="Team Registration">Team Registration</option>
                    <option value="Bow Tuning & Gear Help">Bow Tuning & Gear Help</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Your Message / Question *
                </label>
                <textarea
                  className="input-glass"
                  rows={4}
                  placeholder="Type your message or inquiry for Coach Jayanta here..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn-gold hover-lift"
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  justifyContent: 'center',
                  marginTop: '4px'
                }}
              >
                <Send size={18} /> Submit Inquiry
              </button>

            </form>
          )}

        </div>

      </div>

      {/* FAQ Accordion Section */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#34d399" /> Frequently Asked Questions (FAQ)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  color: '#f8fafc',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp size={18} color="#fbbf24" /> : <ChevronDown size={18} color="#94a3b8" />}
              </button>

              {activeFaq === idx && (
                <div style={{ padding: '0 18px 14px 18px', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
