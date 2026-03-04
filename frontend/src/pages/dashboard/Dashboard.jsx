// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// import { Link } from 'react-router-dom';
// import Spinner from '../../components/Spinner';

// // Brand colors
// const COLORS = {
//   primary: '#1976d2',
//   primaryLight: '#e3f2fd',
//   text: '#000',
//   textSecondary: '#666',
//   background: '#fff',
//   border: '#e0e0e0',
//   cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
// };

// export default function Dashboard() {
//   const dispatch = useDispatch();
//   const { bookings, loading } = useSelector((state) => state.bookings);
//   const { user } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchUserBookings());
//   }, [dispatch]);

//   if (loading && !bookings.length) {
//     return (
//       <div style={{ padding: '48px 0' }}>
//         <Spinner />
//       </div>
//     );
//   }

//   // Get stats
//   const totalBookings = bookings.length;
//   const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
//   const completedBookings = bookings.filter(b => b.status === 'completed').length;
//   const pendingBookings = bookings.filter(b => b.status === 'pending').length;

//   // Status badge colors
//   const getStatusStyle = (status) => {
//     switch (status) {
//       case 'confirmed': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
//       case 'completed': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
//       case 'cancelled': return { backgroundColor: '#ffebee', color: '#c62828' };
//       default: return { backgroundColor: '#fff3e0', color: '#e65100' };
//     }
//   };

//   return (
//     <div style={{ padding: '24px' }}>
//       <div style={{ marginBottom: '24px' }}>
//         <h1 style={{
//           fontSize: '24px',
//           fontWeight: '700',
//           color: COLORS.text,
//           marginBottom: '8px'
//         }}>
//           Welcome back, {user?.name?.split(' ')[0]}!
//         </h1>
//         <p style={{ color: COLORS.textSecondary }}>
//           Manage your bookings and account settings
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: '20px',
//         marginBottom: '28px'
//       }}>
//         {[
//           { title: 'Total Bookings', value: totalBookings, icon: '📅', color: COLORS.primary },
//           { title: 'Confirmed', value: confirmedBookings, icon: '✅', color: '#2e7d32' },
//           { title: 'Completed', value: completedBookings, icon: '🏁', color: '#7b1fa2' },
//           { title: 'Pending', value: pendingBookings, icon: '⏳', color: '#e65100' }
//         ].map((item, idx) => (
//           <div key={idx} style={{
//             backgroundColor: COLORS.background,
//             borderRadius: '12px',
//             boxShadow: COLORS.cardShadow,
//             padding: '20px',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}>
//             <div>
//               <p style={{
//                 fontSize: '14px',
//                 fontWeight: '600',
//                 color: COLORS.textSecondary,
//                 marginBottom: '4px'
//               }}>{item.title}</p>
//               <p style={{
//                 fontSize: '20px',
//                 fontWeight: '700',
//                 color: COLORS.text
//               }}>{item.value}</p>
//             </div>
//             <div style={{
//               width: '44px',
//               height: '44px',
//               backgroundColor: `${item.color}15`,
//               borderRadius: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: item.color,
//               fontSize: '18px'
//             }}>
//               {item.icon}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Bookings */}
//       <div style={{
//         backgroundColor: COLORS.background,
//         borderRadius: '12px',
//         boxShadow: COLORS.cardShadow,
//         padding: '24px',
//         marginBottom: '28px'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '20px'
//         }}>
//           <h2 style={{
//             fontSize: '20px',
//             fontWeight: '700',
//             color: COLORS.text
//           }}>Recent Bookings</h2>
//           <Link
//             to="/dashboard/bookings"
//             style={{
//               color: COLORS.primary,
//               fontWeight: '600',
//               textDecoration: 'none',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             View All →
//           </Link>
//         </div>

//         {bookings.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '32px 0' }}>
//             <div style={{
//               width: '48px',
//               height: '48px',
//               margin: '0 auto 16px',
//               color: COLORS.textSecondary,
//               fontSize: '24px'
//             }}>
//               📅
//             </div>
//             <p style={{ color: COLORS.textSecondary, marginBottom: '16px' }}>
//               You haven't made any bookings yet.
//             </p>
//             <Link
//               to="/tours"
//               style={{
//                 display: 'inline-block',
//                 padding: '8px 16px',
//                 backgroundColor: COLORS.primary,
//                 color: '#fff',
//                 textDecoration: 'none',
//                 borderRadius: '6px',
//                 fontWeight: '600'
//               }}
//             >
//               Browse Tours
//             </Link>
//           </div>
//         ) : (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//             {bookings.slice(0, 5).map((booking) => (
//               <div
//                 key={booking.id}
//                 style={{
//                   paddingBottom: '16px',
//                   borderBottom: `1px solid ${COLORS.border}`,
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'flex-start'
//                 }}
//               >
//                 <div>
//                   <h3 style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
//                     {booking.TourPackage?.title}
//                   </h3>
//                   <p style={{ fontSize: '14px', color: COLORS.textSecondary }}>
//                     {booking.start_date} to {booking.end_date}
//                   </p>
//                 </div>
//                 <div style={{ textAlign: 'right' }}>
//                   <p style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
//                     KES {booking.total_amount.toLocaleString()}
//                   </p>
//                   <span style={{
//                     ...getStatusStyle(booking.status),
//                     padding: '4px 8px',
//                     borderRadius: '12px',
//                     fontSize: '12px',
//                     fontWeight: '600'
//                   }}>
//                     {booking.status}
//                   </span>
//                 </div>
//                 <div style={{ marginTop: '8px', width: '100%' }}>
//                   <Link
//                     to={`/dashboard/bookings/${booking.id}`}
//                     style={{
//                       color: COLORS.primary,
//                       fontWeight: '600',
//                       textDecoration: 'none',
//                       fontSize: '14px'
//                     }}
//                   >
//                     View Details
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Quick Actions */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
//         gap: '24px'
//       }}>
//         <div style={{
//           backgroundColor: COLORS.background,
//           borderRadius: '12px',
//           boxShadow: COLORS.cardShadow,
//           padding: '24px'
//         }}>
//           <h3 style={{
//             fontSize: '18px',
//             fontWeight: '700',
//             color: COLORS.text,
//             marginBottom: '16px'
//           }}>Quick Actions</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {[
//               { label: 'Browse New Tours', path: '/tours' },
//               { label: 'Manage My Bookings', path: '/dashboard/bookings' },
//               { label: 'Update Profile', path: '/dashboard/profile' }
//             ].map((action, idx) => (
//               <Link
//                 key={idx}
//                 to={action.path}
//                 style={{
//                   padding: '12px 16px',
//                   backgroundColor: '#f8f9fa',
//                   borderRadius: '8px',
//                   textDecoration: 'none',
//                   color: COLORS.text,
//                   fontWeight: '500'
//                 }}
//               >
//                 {action.label}
//               </Link>
//             ))}
//           </div>
//         </div>

//         <div style={{
//           backgroundColor: COLORS.background,
//           borderRadius: '12px',
//           boxShadow: COLORS.cardShadow,
//           padding: '24px'
//         }}>
//           <h3 style={{
//             fontSize: '18px',
//             fontWeight: '700',
//             color: COLORS.text,
//             marginBottom: '16px'
//           }}>Need Help?</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {[
//               { label: 'Contact Support', href: 'mailto:support@sharavistatours.com' },
//               { label: 'Visit Contact Page', path: '/contact' },
//               { label: 'Call Us: +254 712 345 678', href: 'tel:+254712345678' }
//             ].map((action, idx) => (
//               action.path ? (
//                 <Link
//                   key={idx}
//                   to={action.path}
//                   style={{
//                     padding: '12px 16px',
//                     backgroundColor: '#f8f9fa',
//                     borderRadius: '8px',
//                     textDecoration: 'none',
//                     color: COLORS.text,
//                     fontWeight: '500'
//                   }}
//                 >
//                   {action.label}
//                 </Link>
//               ) : (
//                 <a
//                   key={idx}
//                   href={action.href}
//                   style={{
//                     padding: '12px 16px',
//                     backgroundColor: '#f8f9fa',
//                     borderRadius: '8px',
//                     textDecoration: 'none',
//                     color: COLORS.text,
//                     fontWeight: '500'
//                   }}
//                 >
//                   {action.label}
//                 </a>
//               )
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserBookings } from '../../features/bookings/bookingSlice';
import Spinner from '../../components/Spinner';
import './Dashboard.css';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (loading && !bookings.length) {
    return (
      <div className="dashboard-loading">
        <Spinner />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Get stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="dashboard-container">
      
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}!</h1>
          <p>Manage your bookings and upcoming adventures</p>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        <StatCard 
          title="Total Bookings" 
          value={totalBookings} 
          icon="📅" 
          color="blue" 
        />
        <StatCard 
          title="Confirmed" 
          value={confirmedBookings} 
          icon="✅" 
          color="green" 
        />
        <StatCard 
          title="Completed" 
          value={completedBookings} 
          icon="🏁" 
          color="purple" 
        />
        <StatCard 
          title="Pending" 
          value={pendingBookings} 
          icon="⏳" 
          color="orange" 
        />
      </section>

      {/* Recent Bookings */}
      <section className="card recent-bookings">
        <div className="card-header">
          <h2>Recent Bookings</h2>
          <Link to="/dashboard/bookings" className="view-all-link">
            View All <span className="arrow">→</span>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings yet</h3>
            <p>You haven't made any bookings yet. Start your next adventure today!</p>
            <Link to="/tours" className="btn btn-primary">
              Browse Tours
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <h3>{booking.TourPackage?.title || 'Unknown Package'}</h3>
                  <div className="booking-dates">
                    <span className="icon">📅</span>
                    {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="booking-meta">
                  <div className="booking-price">
                    KES {parseFloat(booking.total_amount).toLocaleString()}
                  </div>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-action">
                  <Link to={`/dashboard/bookings/${booking.id}`} className="details-link">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions & Help */}
      <section className="actions-grid">
        <div className="card quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-list">
            <Link to="/tours" className="action-item">
              <span className="action-icon">🌍</span>
              Browse New Tours
            </Link>
            <Link to="/dashboard/bookings" className="action-item">
              <span className="action-icon">📋</span>
              Manage My Bookings
            </Link>
            <Link to="/dashboard/profile" className="action-item">
              <span className="action-icon">👤</span>
              Update Profile
            </Link>
          </div>
        </div>

        <div className="card help-support">
          <h3>Need Help?</h3>
          <div className="action-list">
            <a href="mailto:support@sharavista.com" className="action-item">
              <span className="action-icon">📧</span>
              Contact Support
            </a>
            <Link to="/contact" className="action-item">
              <span className="action-icon">💬</span>
              Visit Contact Page
            </Link>
            <a href="tel:+254712345678" className="action-item">
              <span className="action-icon">📞</span>
              Call Us: +254 712 345 678
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className={`stat-icon-bg stat-icon-${color}`}>
        <span className="stat-emoji">{icon}</span>
      </div>
    </div>
  );
}