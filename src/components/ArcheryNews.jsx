import React, { useState } from 'react';
import { Newspaper, Globe, Award, ExternalLink, Search, Filter, Calendar, Tag, Flame, Sparkles, Flag } from 'lucide-react';

const initialNewsArticles = [
  {
    id: "news_1",
    title: "Indian Recurve & Compound Squads Set Target for World Archery Stage & National Trials",
    category: "Indian Archery 🇮🇳",
    date: "August 2026",
    source: "Archery Association of India",
    image: "https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?auto=format&fit=crop&w=800&q=80",
    summary: "Indian archers Dhiraj Bommadevara, Ankita Bhakat, and Deepika Kumari lead national selections following high-scoring practice rounds in Kolkata and Sonipat training hubs.",
    bullets: [
      "Record scoring scores registered at 70m recurve national selection rounds.",
      "Special focus on wind reading and mental stamina conditioning under pressure.",
      "Compound team prepares for upcoming Asian Grand Prix stages."
    ],
    url: "https://worldarchery.sport/news"
  },
  {
    id: "news_2",
    title: "World Archery Unveils Enhanced 70m & 50m Target Scoring Technologies for 2026 Circuit",
    category: "World Archery 🏆",
    date: "August 2026",
    source: "World Archery News",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    summary: "Next-generation electronic target sensors and high-speed camera line verification will deliver instant 0.1mm millimeter ring precision in World Cup finals.",
    bullets: [
      "Instant optical sensors verify arrow shaft edge cuts on target face lines.",
      "Real-time heart rate and arrow speed telemetry broadcast live for archery fans.",
      "Standardized across all international outdoor and indoor championships."
    ],
    url: "https://worldarchery.sport"
  },
  {
    id: "news_3",
    title: "Para-Archery Champion Sheetal Devi Wins Gold with Historic Armless Compound Technique",
    category: "Paralympic Archery 🏅",
    date: "July 2026",
    source: "Paralympic Sports Digest",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    summary: "Indian para-archery sensation Sheetal Devi delivers a flawless 150/150 maximum score in Asian Para-Archery Cup finals, setting a new benchmark for global accuracy.",
    bullets: [
      "Scored perfect 10-rings across 5 consecutive ends under high pressure.",
      "Honored with international Para-Athlete Excellence Award.",
      "Inspiring thousands of young Indian athletes to embrace competitive archery."
    ],
    url: "https://www.paralympic.org"
  },
  {
    id: "news_4",
    title: "Mastering Fletching & Stabilizer Tuning: Expert Insights for College Archers",
    category: "Equipment & Tech 🏹",
    date: "July 2026",
    source: "Bowhunter & Target Archery Tech",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80",
    summary: "Top national bow technicians release new data on dampener weight distribution, bare-shaft paper tuning, and clicker timing for recurve consistency.",
    bullets: [
      "Optimizing front-to-back stabilizer weight ratios for steady hold.",
      "How vane profile and spin-wing helical angles affect 70m wind drift.",
      "Tiller tuning adjustments to eliminate vertical grouping spread."
    ],
    url: "https://worldarchery.sport/rules"
  },
  {
    id: "news_5",
    title: "Kolkata Archery Academy Host Inter-College State Championships",
    category: "Indian Archery 🇮🇳",
    date: "August 2026",
    source: "West Bengal Archery Association",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    summary: "Heritage Archery team archers gear up for state ranking tournaments, aiming for top podium spots across Junior and Senior Recurve divisions.",
    bullets: [
      "Over 250 archers from across colleges participating in ranking rounds.",
      "70m Recurve and 50m Compound individual and team knockout brackets.",
      "Selection trial spots for upcoming National Championships."
    ],
    url: "https://indianarchery.info"
  }
];

export default function ArcheryNews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Indian Archery 🇮🇳', 'World Archery 🏆', 'Paralympic Archery 🏅', 'Equipment & Tech 🏹'];

  const filteredArticles = initialNewsArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ marginBottom: '36px' }}>
      
      {/* News Header Banner */}
      <div className="glass-card glass-card-gold" style={{ padding: '28px', marginBottom: '24px', border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(56,189,248,0.12))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge-gold" style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)' }}>
                <Newspaper size={13} /> Global & Indian Archery Updates
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Archery World & India News Hub 📰🎯
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0 }}>
              Stay updated with national team trials, World Archery Cup results, equipment tech breakthroughs, and collegiate archery bulletins.
            </p>
          </div>

          {/* News Stats Pill */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Featured Articles</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{initialNewsArticles.length} Live Bulletins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: selectedCategory === cat ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.25)' : 'rgba(15,23,42,0.6)',
                color: selectedCategory === cat ? '#f8fafc' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-glass"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
          No archery news articles found matching your search. Try adjusting filters or search term!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredArticles.map(article => (
            <div key={article.id} className="glass-card hover-card" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Image Banner */}
              <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={article.image} 
                  alt={article.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800 }}>
                  {article.category}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe size={13} color="#fbbf24" /> {article.source}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} /> {article.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 10px 0', lineHeight: 1.35 }}>
                  {article.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                  {article.summary}
                </p>

                {/* Bullets */}
                <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>Key Highlights:</div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {article.bullets.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* External Link */}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    borderRadius: '8px'
                  }}
                >
                  Read Official Coverage <ExternalLink size={14} />
                </a>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
