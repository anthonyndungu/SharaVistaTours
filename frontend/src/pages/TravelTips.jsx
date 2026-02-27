import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

export default function TravelTips() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTip, setSelectedTip] = useState(null)

  // Data with short summaries for the grid view
  const tips = [
    {
      id: '1',
      title: 'Choosing Your Holiday',
      category: 'Planning',
      icon: 'fa-map-signs',
      // ✅ Updated Placeholder: Map/Planning theme
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Learn how to pick the perfect guided tour or plan your own itinerary with confidence.',
      content: (
        <>
          <p>Start with your holiday package by choosing a guided tour package. It's the best way to travel with family because all the details are pre-planned for you.</p>
          <h4>Key Planning Steps:</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li>Research destinations, festivals, and weather patterns.</li>
            <li>Create a backup plan for unforeseen issues.</li>
            <li>Ensure activities match your family's interests.</li>
            <li>Budget for flights, visas, meals, and emergencies.</li>
          </ul>
        </>
      )
    },
    {
      id: '2',
      title: 'Prep Work for Travel',
      category: 'Preparation',
      icon: 'fa-suitcase',
      // ✅ Updated Placeholder: Suitcase/Packing theme
      image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Essential checklists for documents, packing, and informing loved ones before you go.',
      content: (
        <>
          <p>Apply for vacation days including a rest day after return. Confirm all travel documents 3-4 days prior.</p>
          <h4>Packing Tips:</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li>Pack considering shopping space at your destination.</li>
            <li>Itemize needs for elders and children specifically.</li>
            <li>Inform relatives/friends of your itinerary.</li>
            <li>Notify your bank about travel to avoid card blocks.</li>
          </ul>
        </>
      )
    },
    {
      id: '3',
      title: 'Medical Requirements',
      category: 'Health',
      icon: 'fa-medkit',
      // ✅ Updated Placeholder: Health/Medical theme
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Stay safe with up-to-date vaccinations and health precautions for your destination.',
      content: (
        <p>You should be up to date on routine vaccinations (MMR, Tetanus, Chickenpox, Polio, Flu). Some destinations require specific vaccines. Always consult your local clinic or hospital for the latest travel health advice.</p>
      )
    },
    {
      id: '4',
      title: 'Visa Requirements',
      category: 'Documents',
      icon: 'fa-passport',
      // ✅ Updated Placeholder: Passport/Documents theme
      image: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Navigate visa rules smoothly by checking official embassy sources before booking.',
      content: (
        <p>Visa requirements change frequently. Always verify with your travel agent or the destination country's Embassy/High Commission before booking any non-refundable tickets.</p>
      )
    },
    {
      id: '5',
      title: 'Travel Insurance',
      category: 'Safety',
      icon: 'fa-shield-alt',
      // ✅ Updated Placeholder: Safety/Shield theme
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Understand what is covered (accidents, luggage) and what isn\'t (war, extreme sports).',
      content: (
        <>
          <p>Travel insurance is crucial. Standard coverage includes:</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {['Personal Accident', 'Medical Expenses', 'Lost Luggage', 'Lost Documents', 'Flight Delays', 'Cancellation'].map((item, i) => (
              <li key={i} style={{ fontSize: '0.9rem' }}>✓ {item}</li>
            ))}
          </ul>
          <p><strong>Exclusions:</strong> War, radiation, self-harm, professional sports, and hazardous adventures are typically not covered.</p>
        </>
      )
    },
    {
      id: '6',
      title: 'Travel Day Essentials',
      category: 'Airport',
      icon: 'fa-plane-departure',
      // ✅ Updated Placeholder: Airport/Departure theme
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Final checks for luggage, documents, and staying hydrated to beat jet lag.',
      content: (
        <>
          <p>Weigh your bags to avoid excess fees. Mark luggage inside and out. Consider travel insurance for lost bags or delays.</p>
          <h4>Hand Luggage:</h4>
          <p>Liquids must be under 100ml in a clear bag. Stay hydrated with water during the flight to minimize jet lag; avoid excessive caffeine.</p>
        </>
      )
    },
    {
      id: '7',
      title: 'Airport Reminders',
      category: 'Airport',
      icon: 'fa-clock',
      // ✅ Updated Placeholder: Time/Airport theme
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Timelines for check-in, security, and boarding to ensure you never miss a flight.',
      content: (
        <>
          <p>Have all documents ready. Self-check-in saves time. Counter check-in usually closes 1 hour before departure.</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li>Arrive at the gate 20 mins before departure.</li>
            <li>Pre-book baggage to save money (max 30kg per bag).</li>
            <li>Security queues can be long; arrive early.</li>
          </ul>
        </>
      )
    },
    {
      id: '8',
      title: 'Self-Drive Tips',
      category: 'Driving',
      icon: 'fa-car',
      // ✅ Updated Placeholder: Road trip/Car theme
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Stay safe on the road with GPS, supplies, and smart driving habits.',
      content: (
        <ul style={{ paddingLeft: '20px' }}>
          <li>Use reliable GPS + physical maps as backup.</li>
          <li>Carry extra water and snacks for long stretches.</li>
          <li>Avoid driving at night in rural areas.</li>
          <li>Keep fuel above quarter tank.</li>
          <li>Entertain kids with games/books.</li>
        </ul>
      )
    },
    {
      id: '9',
      title: 'On Holiday Safety',
      category: 'Safety',
      icon: 'fa-umbrella-beach',
      // ✅ Updated Placeholder: Beach/Safety theme
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      summary: 'Stay connected, secure your valuables, and enjoy your trip safely.',
      content: (
        <>
          <p>Inform family of your arrival. Keep luggage locked. Carry passport copies, not originals, when possible.</p>
          <h4>Safety First:</h4>
          <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
            <li>Avoid walking alone at night.</li>
            <li>Beware of pickpockets in crowded areas.</li>
            <li>Follow local traffic rules if driving.</li>
            <li>Confirm return flight details 24h prior.</li>
          </ul>
        </>
      )
    }
  ]

  // Filter tips based on search
  const filteredTips = useMemo(() => {
    return tips.filter(tip => 
      tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  return (
    <div className="archive" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* 1. Modern Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', 
        color: '#fff', 
        padding: '80px 0 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Circle */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', opacity: 0.8 }}>Expert Advice</span>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '10px 0 20px' }}>Travel Tips & Guides</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px', opacity: 0.9 }}>
            Everything you need to know to plan, pack, and enjoy your perfect getaway.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search for tips (e.g., 'Visa', 'Packing')..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '15px 25px',
                borderRadius: '50px',
                border: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                fontSize: '1rem',
                outline: 'none'
              }}
            />
            <i className="fa fa-search" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}></i>
          </div>
          
          {/* Breadcrumb */}
          <div style={{ marginTop: '30px', fontSize: '0.9rem', opacity: 0.7 }}>
            <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link> / <span>Travel Tips</span>
          </div>
        </div>
      </div>

      {/* 2. Grid Content */}
      <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 3 }}>
        {filteredTips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#777' }}>
            <i className="fa fa-search" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}></i>
            <p>No tips found matching "{searchTerm}"</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '30px' 
          }}>
            {filteredTips.map((tip) => (
              <div 
                key={tip.id}
                onClick={() => setSelectedTip(tip)}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
                }}
              >
                {/* Card Image/Header */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={tip.image} 
                    alt={tip.title} 
                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x400?text=Travel+Tip'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.7))'
                  }}></div>
                  <span style={{
                    position: 'absolute', top: '15px', right: '15px',
                    background: '#ffb300', color: '#fff',
                    padding: '5px 12px', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase'
                  }}>
                    {tip.category}
                  </span>
                  <div style={{
                    position: 'absolute', bottom: '15px', left: '15px',
                    color: '#fff', fontSize: '1.5rem'
                  }}>
                    <i className={`fa ${tip.icon}`}></i>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', color: '#333' }}>{tip.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>{tip.summary}</p>
                  
                  <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', color: '#2a5298', fontWeight: '600', fontSize: '0.9rem' }}>
                    Read More <i className="fa fa-arrow-right" style={{ marginLeft: '8px', transition: 'transform 0.2s' }}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Modal for Details */}
      {selectedTip && (
        <div 
          onClick={() => setSelectedTip(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '16px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              animation: 'slideUp 0.3s ease-out',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedTip(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: '#f0f0f0', border: 'none',
                width: '36px', height: '36px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1.2rem', color: '#555',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10
              }}
            >
              <i className="fa fa-times"></i>
            </button>

            {/* Modal Header Image */}
            <div style={{ height: '250px', width: '100%', overflow: 'hidden' }}>
              <img 
                src={selectedTip.image} 
                alt={selectedTip.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', top: '20px', left: '20px',
                background: '#ffb300', color: '#fff',
                padding: '6px 15px', borderRadius: '20px',
                fontWeight: 'bold', fontSize: '0.85rem'
              }}>
                {selectedTip.category}
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '40px' }}>
              <h2 style={{ fontSize: '2rem', margin: '0 0 20px', color: '#333' }}>{selectedTip.title}</h2>
              <div style={{ color: '#555', lineHeight: '1.8', fontSize: '1.05rem' }}>
                {selectedTip.content}
              </div>
              
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'right' }}>
                <button 
                  onClick={() => setSelectedTip(null)}
                  style={{
                    background: '#2a5298', color: '#fff',
                    border: 'none', padding: '12px 30px',
                    borderRadius: '8px', fontSize: '1rem', fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}