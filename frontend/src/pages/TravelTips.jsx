// import { useState } from 'react'
// import { Link } from 'react-router-dom'

// export default function TravelTips() {
//   const [activePanel, setActivePanel] = useState(null) // Start with all closed, or set first ID to open one by default

//   const togglePanel = (id) => {
//     setActivePanel(activePanel === id ? null : id)
//   }

//   const tips = [
//     {
//       id: '1',
//       title: 'Choosing Your Holiday',
//       image: '/assets/img/faq-choosing-your-holiday.jpg',
//       content: (
//         <>
//           <p>Start with your holiday package by choosing a guided tour package. It's the best way to travel with family because all the details are pre-planned for you. This is especially important if you are not keen on researching destinations yourself.</p>
//           <p>For those who do pre-plan, take some time to create a complete itinerary following some research on the destination you are visiting. Pay special attention to special festivals, weather, and political climate when you are working on the itinerary. This provides space for back up plans in case of unforeseen travel problems.</p>
//           <p>The itinerary also ensures that everything is planned based on what you/ your family wants to see and experience. Just make sure all the activities are something worth trying and gives you and your fellow travellers a new dimension of the places visited.</p>
//           <p>If you are travelling on a budget then you should plan with flight, ground arrangements, passport, visa, meals, transport, shopping and contingency cash for emergency.</p>
//         </>
//       )
//     },
//     {
//       id: '2',
//       title: 'Prep Work for Travel',
//       image: '/assets/img/faq-prep-work-for-travel.jpg',
//       content: (
//         <>
//           <p>Make sure you apply for vacation days which include a day's rest after your return to cope with fatigue or jet lag if you're flying. Furthermore ensure all your travel documents are confirmed 3-4 working days before the travel date to ensure any last minute changes can still be accommodated.</p>
//           <p>As for packing, it is essential to pack what you need with consideration for the shopping you plan to do at your holiday destination. If you're travelling with family and kids, ensure the needs of the elders and children are itemized and packed to avoid discomfort or tantrums.</p>
//           <p>Most importantly, it is vital to inform your close relatives/ friends of your travel. It would be good to arrange for house/ pet sitting while you're away. Lastly, call your bank and let them know that you are travelling and there will be large amount of purchases with the debit or credit card.</p>
//         </>
//       )
//     },
//     {
//       id: '3',
//       title: 'Medical Requirement',
//       image: '/assets/img/faq-medical-requirement.jpg',
//       content: (
//         <p>You should be up to date on routine vaccinations while travelling to any destination. Some vaccines may also be required for travel. These vaccines include measles-mumps-rubella (MMR) vaccine, diphtheria-tetanus-pertussis vaccine, varicella (chickenpox) vaccine, polio vaccine, and your yearly flu shot. Latest updates on vaccinations can be obtained from your local clinic or hospital.</p>
//       )
//     },
//     {
//       id: '4',
//       title: 'Visa Requirement',
//       image: '/assets/img/faq-visa-requirement.jpg',
//       content: (
//         <p>Please take note that visa requirements for certain countries may change from time to time. It is advisable that you check with your travel agent or directly with destination country's Embassy or High Commission before booking a holiday.</p>
//       )
//     },
//     {
//       id: '5',
//       title: 'Travel Insurance',
//       image: '/assets/img/faq-travel-insurance.jpg',
//       content: (
//         <>
//           <p>What sort of protection/coverage does a travel insurance covers you? Some of the coverage that you should expect is as below:</p>
//           <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
//             {['Personal Accident', 'Medical Expenses', 'Loss of Luggage & Personal Effect', 'Loss of Travel Documents', 'Baggage Delay', 'Travel Delay', 'Missed Departure', 'Flight Overbooked', 'Hijack Inconvenience', 'Travel Cancellation', 'Loss of Money/ Valuables'].map((item, i) => (
//               <li key={i} style={{ marginBottom: '5px', color: '#555' }}>{item}</li>
//             ))}
//           </ul>
//           <p>Here are other examples that might NOT be covered in travel insurance:</p>
//           <ul style={{ paddingLeft: '20px', marginBottom: '15px' }}>
//             {['Declared or undeclared war or any act of war', 'Loss or destruction of goods due to radiation', 'Suicide/Self harm/ or any intentional acts', 'Engaging in professional competition or hazardous adventure'].map((item, i) => (
//               <li key={i} style={{ marginBottom: '5px', color: '#555' }}>{item}</li>
//             ))}
//           </ul>
//           <p>For more information on the inclusions & exclusions of travel insurance coverage, contact your travel agent.</p>
//         </>
//       )
//     },
//     {
//       id: '6',
//       title: 'Travel Day',
//       image: '/assets/img/faq-travel-day.jpg',
//       content: (
//         <>
//           <p>On your travel day, make a list of the things that you need to bring along- luggage, passport and tickets. Also, mark all your bags inside and out with your name and address – both home address and your holiday address. To be on the safe side, weigh your bags to ensure you don't exceed the baggage requirements of the airline.</p>
//           <p>You do know that it is possible to travel with hand-luggage only, right? Just that you will need to know the airline rules for carrying liquids, otherwise you may have to remove them at the security checkpoint! In order to handle jet lags, stay hydrated by drinking lots of plain water during the flight. Avoid tea and coffee.</p>
//         </>
//       )
//     },
//     {
//       id: '7',
//       title: 'Flight/Airport Reminders',
//       image: '/assets/img/faq-flight-airport-reminders.jpg',
//       content: (
//         <>
//           <p>Gather required documents before your flight as you are responsible to present as required, documents by the relevant authorities at all entry and exit lanes.</p>
//           <p>Self-check-in is free, simple & quick! Otherwise, counter check-in opens 3 hours before the scheduled time of departure and closes 1 hour before. Note: Check-in deadlines may vary at different airports.</p>
//           <p>Pre-book your checked baggage to save money and time. Each piece/item of checked baggage has to weigh less than 30kg.</p>
//           <p>Bringing liquids are subject to the prevalent applicable local laws and regulations guests may take liquids on board in their cabin baggage with a maximum volume of 100 ml. The items must be placed in a transparent, re-sealable plastic bag.</p>
//           <p>For boarding time, guests are required to be at the boarding gate at least 20 minutes before the scheduled time of departure or you will be denied boarding.</p>
//         </>
//       )
//     },
//     {
//       id: '8',
//       title: 'Self-Drive Travel Reminders',
//       image: '/assets/img/faq-self-drive-reminders.jpg',
//       content: (
//         <ul style={{ paddingLeft: '20px' }}>
//           {[
//             'Ensure you have a reliable GPS system and location maps in the car.',
//             'Pack enough liquids/water and snacks in the car as some stretches are long.',
//             'Try to reach your destination before dark as most stretches are either forests or farms.',
//             'Plan some games, pack short story books or sing along rhymes if you travel with kids.',
//             'Umbrellas are great in case there are light drizzles or rain.',
//             'Always ensure your tank is full and refill before it reaches quarter tank.',
//             'Buy insurance coverage for the driver and passengers.'
//           ].map((item, i) => (
//             <li key={i} style={{ marginBottom: '8px', color: '#555', lineHeight: '1.6' }}>{item}</li>
//           ))}
//         </ul>
//       )
//     },
//     {
//       id: '9',
//       title: 'On Holiday',
//       image: '/assets/img/faq-on-holidays.jpg',
//       content: (
//         <>
//           <p>When you are overseas/ holiday destination, do call your close relatives/ friends to let them know you have arrived safely and keep them updated of where you are if you are moving around. Make sure to always keep your luggage locked when leaving them behind in the hotel.</p>
//           <p>When you are abroad and if you want to try something local, make sure it is a recommendation from a trustworthy source. To make life easier, get a local map and identify the tourist info centres.</p>
//           <p>Before your return flight, do confirm your flight details in case of delays or cancellations. It is best to ensure that you have all travel documents prepared and easily accessible for check in.</p>
//           <p>Last but not least, make sure you are at the airport two hours (or 3-4 hours in some countries) earlier to avoid missing the flight.</p>
//         </>
//       )
//     }
//   ]

//   return (
//     <div className="archive" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
//       {/* Breadcrumb */}
//       <div className="top_site_main" style={{backgroundImage: 'url(/assets/img/banner/top-heading.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
//         <div style={{ position: 'absolute', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.5)' }}></div>
//         <div className="banner-wrapper container article_heading" style={{ position: 'relative', zIndex: 2, padding: '60px 0' }}>
//           <div className="breadcrumbs-wrapper">
//             <ul className="phys-breadcrumb" style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '10px', color: '#fff' }}>
//               <li><Link to="/" className="home" style={{ color: '#ffb300', textDecoration: 'none' }}>Home</Link></li>
//               <li style={{ color: '#fff' }}>/</li>
//               <li style={{ color: '#fff' }}>Travel Tips</li>
//             </ul>
//           </div>
//           <h1 className="heading_primary" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '700', marginTop: '15px' }}>Travel Tips</h1>
//         </div>
//       </div>

//       {/* Main Content */}
//       <section className="content-area" style={{ padding: '60px 0' }}>
//         <div className="container">
//           <div className="row">
//             <div className="site-main col-sm-12 full-width">
              
//               <div style={{ maxWidth: '900px', margin: '0 auto' }}>
//                 {tips.map((tip) => (
//                   <div 
//                     key={tip.id} 
//                     style={{ 
//                       marginBottom: '20px', 
//       borderRadius: '8px', 
//       overflow: 'hidden',
//       boxShadow: activePanel === tip.id ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 5px rgba(0,0,0,0.05)',
//       border: '1px solid #eee',
//       backgroundColor: '#fff',
//       transition: 'all 0.3s ease'
//     }}
//                   >
//                     {/* Header / Trigger */}
//                     <div 
//                       onClick={() => togglePanel(tip.id)}
//                       style={{
//                         padding: '20px 25px',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         backgroundColor: activePanel === tip.id ? '#fff' : '#fff',
//                         borderBottom: activePanel === tip.id ? '1px solid #eee' : 'none',
//                         transition: 'background-color 0.2s'
//                       }}
//                       onMouseEnter={(e) => e.currentTarget.style.backgroundColor = activePanel === tip.id ? '#fff' : '#f8f9fa'}
//                       onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activePanel === tip.id ? '#fff' : '#fff'}
//                     >
//                       <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>
//                         {tip.title}
//                       </h4>
//                       <div style={{ 
//                         width: '30px', 
//                         height: '30px', 
//                         borderRadius: '50%', 
//                         backgroundColor: activePanel === tip.id ? '#ffb300' : '#f0f0f0',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         transition: 'all 0.3s ease',
//                         transform: activePanel === tip.id ? 'rotate(180deg)' : 'rotate(0deg)'
//                       }}>
//                         <i className="fa fa-chevron-down" style={{ color: activePanel === tip.id ? '#fff' : '#777', fontSize: '0.9rem' }}></i>
//                       </div>
//                     </div>

//                     {/* Content Body */}
//                     <div 
//                       style={{
//                         maxHeight: activePanel === tip.id ? '1000px' : '0',
//                         opacity: activePanel === tip.id ? 1 : 0,
//                         overflow: 'hidden',
//                         transition: 'max-height 0.4s ease, opacity 0.4s ease',
//                         backgroundColor: '#fff'
//                       }}
//                     >
//                       <div style={{ padding: '25px' }}>
//                         <div style={{ display: 'flex', gap: '25px', flexDirection: 'window.innerWidth < 600 ? column : row' }}>
//                           {/* Image Column */}
//                           <div style={{ flex: '0 0 150px', display: 'flex', alignItems: 'flex-start' }}>
//                             <img 
//                               src={tip.image} 
//                               alt={tip.title}
//                               onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
//                               style={{ 
//                                 width: '100%', 
//                                 borderRadius: '8px', 
//                                 objectFit: 'cover',
//                                 boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
//                               }}
//                             />
//                           </div>
                          
//                           {/* Text Column */}
//                           <div style={{ flex: 1, color: '#555', lineHeight: '1.8', fontSize: '1rem' }}>
//                             {tip.content}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }


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
      image: '/assets/img/faq-choosing-your-holiday.jpg',
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
      image: '/assets/img/faq-prep-work-for-travel.jpg',
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
      image: '/assets/img/faq-medical-requirement.jpg',
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
      image: '/assets/img/faq-visa-requirement.jpg',
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
      image: '/assets/img/faq-travel-insurance.jpg',
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
      image: '/assets/img/faq-travel-day.jpg',
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
      image: '/assets/img/faq-flight-airport-reminders.jpg',
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
      image: '/assets/img/faq-self-drive-reminders.jpg',
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
      image: '/assets/img/faq-on-holidays.jpg',
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
                    onError={(e) => e.target.src = '/assets/img/placeholder.jpg'}
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