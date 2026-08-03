import React, { useState } from 'react';
import { MapPin, Clock, Edit3, UserCheck, Calendar, Info, Check } from 'lucide-react';
import RangeWhistleControl from './RangeWhistleControl';

export default function VenueTracker({ venueSchedule, currentUser, onUpdateVenue }) {
  const [showModal, setShowModal] = useState(false);
  const [venue, setVenue] = useState(venueSchedule.venue);
  const [date, setDate] = useState(venueSchedule.date);
  const [time, setTime] = useState(venueSchedule.time);
  const [distance, setDistance] = useState(venueSchedule.distance);
  const [equipmentNotes, setEquipmentNotes] = useState(venueSchedule.equipmentNotes);

  const handleSaveVenue = (e) => {
    e.preventDefault();
    const now = new Date();
    const timeFormatted = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onUpdateVenue({
      venue,
      date,
      time,
      distance,
      equipmentNotes,
      updatedBy: currentUser.name,
      updatedAt: timeFormatted
    });
    setShowModal(false);
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-gold">
              <MapPin size={13} /> Live Range Schedule
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            Practice Timing & Venue Update 📍
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Anyone on the team can update the practice timing and venue. Updates immediately log who updated it.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn-gold" style={{ padding: '12px 20px' }}>
          <Edit3 size={18} /> Update Timing & Venue
        </button>
      </div>

      {/* Official World Archery Whistle System */}
      <RangeWhistleControl />

      {/* Main Live Venue Card */}
      <div className="glass-card glass-card-gold" style={{ padding: '32px', position: 'relative', border: '1px solid rgba(217, 119, 6, 0.4)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="venue-responsive-grid">
          
          <div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
              📍 Range Location & Venue
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '14px', lineHeight: 1.3 }}>
              {venueSchedule.venue}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <Calendar size={18} color="#34d399" />
                <span>Practice Date: <strong style={{ color: '#f8fafc' }}>{venueSchedule.date}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <Clock size={18} color="#fbbf24" />
                <span>Practice Slot: <strong style={{ color: '#fbbf24' }}>{venueSchedule.time}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1' }}>
                <MapPin size={18} color="#60a5fa" />
                <span>Target Distance: <strong style={{ color: '#f8fafc' }}>{venueSchedule.distance}</strong></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ background: 'rgba(15,23,42,0.7)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} color="#fbbf24" /> Equipment & Session Notes
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {venueSchedule.equipmentNotes || "Check arrow fletchings, bring water bottles and sight mark logs."}
              </p>
            </div>

            {/* Audit Stamp */}
            <div style={{ marginTop: '16px', background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(5,150,105,0.3)', padding: '10px 14px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#34d399' }}>
              <UserCheck size={16} />
              <span>
                Last updated by <strong style={{ color: '#f8fafc' }}>{venueSchedule.updatedBy}</strong> at {venueSchedule.updatedAt}
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Edit Venue & Timing Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={20} color="#fbbf24" /> Update Practice Timing & Venue
              </h3>
              <button onClick={() => setShowModal(false)} className="btn-ghost" style={{ padding: '4px 8px' }}>✕</button>
            </div>

            <form onSubmit={handleSaveVenue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Venue Location</label>
                <input
                  type="text"
                  className="input-glass"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Practice Date</label>
                  <input
                    type="text"
                    className="input-glass"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Time Slot</label>
                  <input
                    type="text"
                    className="input-glass"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Target Distances</label>
                <input
                  type="text"
                  className="input-glass"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Equipment / Special Instructions</label>
                <textarea
                  className="input-glass"
                  rows={3}
                  value={equipmentNotes}
                  onChange={(e) => setEquipmentNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-gold">Publish Schedule Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
