// // import { useEffect } from 'react'
// // import { useDispatch, useSelector } from 'react-redux'
// // import { fetchUserBookings } from '../../features/bookings/bookingSlice'
// // import { Link } from 'react-router-dom'
// // import { ArrowRightIcon } from '@heroicons/react/24/outline'
// // import Spinner from '../../components/Spinner'
// // import { fetchUserProfile } from '../../features/auth/authSlice' 

// // export default function Dashboard() {
// //   const dispatch = useDispatch()
// //   const { bookings, loading } = useSelector((state) => state.bookings)
// //   const { user } = useSelector((state) => state.auth)

// //   useEffect(() => {
// //     dispatch(fetchUserBookings())
// //   }, [dispatch])

// //   if (loading && !bookings.length) {
// //     return <div className="py-12"><Spinner /></div>
// //   }

// //   // Get stats
// //   const totalBookings = bookings.length
// //   const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
// //   const completedBookings = bookings.filter(b => b.status === 'completed').length
// //   const pendingBookings = bookings.filter(b => b.status === 'pending').length

// //   return (
// //     <div className="py-8">
// //       <div className="mb-8">
// //         <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
// //         <p className="text-gray-600">Manage your bookings and account settings</p>
// //       </div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-gray-600">Total Bookings</p>
// //               <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
// //             </div>
// //             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
// //               <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
// //               </svg>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-gray-600">Confirmed</p>
// //               <p className="text-2xl font-bold text-gray-900">{confirmedBookings}</p>
// //             </div>
// //             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
// //               <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //               </svg>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-gray-600">Completed</p>
// //               <p className="text-2xl font-bold text-gray-900">{completedBookings}</p>
// //             </div>
// //             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
// //               <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
// //               </svg>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <p className="text-sm font-medium text-gray-600">Pending</p>
// //               <p className="text-2xl font-bold text-gray-900">{pendingBookings}</p>
// //             </div>
// //             <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
// //               <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
// //               </svg>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Recent Bookings */}
// //       <div className="bg-white rounded-xl shadow-card p-6 mb-8">
// //         <div className="flex items-center justify-between mb-6">
// //           <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
// //           <Link to="/dashboard/bookings" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
// //             View All
// //             <ArrowRightIcon className="ml-1 h-4 w-4" />
// //           </Link>
// //         </div>

// //         {bookings.length === 0 ? (
// //           <div className="text-center py-8">
// //             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
// //             </svg>
// //             <p className="mt-2 text-gray-600">You haven't made any bookings yet.</p>
// //             <Link
// //               to="/tours"
// //               className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
// //             >
// //               Browse Tours
// //             </Link>
// //           </div>
// //         ) : (
// //           <div className="space-y-4">
// //             {bookings.slice(0, 5).map((booking) => (
// //               <div key={booking.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <h3 className="font-medium text-gray-900">{booking.TourPackage?.title}</h3>
// //                     <p className="text-sm text-gray-600">{booking.start_date} to {booking.end_date}</p>
// //                   </div>
// //                   <div className="text-right">
// //                     <p className="font-medium text-gray-900">KES {booking.total_amount.toLocaleString()}</p>
// //                     <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
// //                       booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
// //                       booking.status === 'completed' ? 'bg-purple-100 text-purple-800' :
// //                       booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
// //                       'bg-yellow-100 text-yellow-800'
// //                     }`}>
// //                       {booking.status}
// //                     </span>
// //                   </div>
// //                 </div>
// //                 <div className="mt-2">
// //                   <Link
// //                     to={`/dashboard/bookings/${booking.id}`}
// //                     className="text-primary-600 hover:text-primary-700 text-sm font-medium"
// //                   >
// //                     View Details
// //                   </Link>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
// //           <div className="space-y-3">
// //             <Link
// //               to="/tours"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Browse New Tours
// //             </Link>
// //             <Link
// //               to="/dashboard/bookings"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Manage My Bookings
// //             </Link>
// //             <Link
// //               to="/dashboard/profile"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Update Profile
// //             </Link>
// //           </div>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-card p-6">
// //           <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
// //           <div className="space-y-3">
// //             <a
// //               href="mailto:support@travelease.com"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Contact Support
// //             </a>
// //             <Link
// //               to="/contact"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Visit Contact Page
// //             </Link>
// //             <a
// //               href="tel:+254712345678"
// //               className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
// //             >
// //               Call Us: +254 712 345 678
// //             </a>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// // src/pages/dashboard/Dashboard.jsx
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// import { Link } from 'react-router-dom';
// import Spinner from '../../components/Spinner';
// import { fetchUserProfile } from '../../features/auth/authSlice';

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
//     <div style={{ padding: '32px 0' }}>
//       <div style={{ marginBottom: '32px' }}>
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
//         gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//         gap: '24px',
//         marginBottom: '32px'
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
//             padding: '24px',
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
//               width: '48px',
//               height: '48px',
//               backgroundColor: `${item.color}15`,
//               borderRadius: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               color: item.color,
//               fontSize: '20px'
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
//         marginBottom: '32px'
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '24px'
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
//                 fontWeight: '600',
//                 transition: 'background-color 0.2s'
//               }}
//               onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
//               onMouseLeave={(e) => e.target.style.backgroundColor = COLORS.primary}
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
//         gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
//                   fontWeight: '500',
//                   transition: 'background-color 0.2s'
//                 }}
//                 onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
//                 onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
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
//               { label: 'Contact Support', href: 'mailto:support@travelease.com' },
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
//                     fontWeight: '500',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
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
//                     fontWeight: '500',
//                     transition: 'background-color 0.2s'
//                   }}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
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


// src/pages/dashboard/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';

// Brand colors
const COLORS = {
  primary: '#1976d2',
  primaryLight: '#e3f2fd',
  text: '#000',
  textSecondary: '#666',
  background: '#fff',
  border: '#e0e0e0',
  cardShadow: '0 2px 8px rgba(0,0,0,0.1)'
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  if (loading && !bookings.length) {
    return (
      <div style={{ padding: '48px 0' }}>
        <Spinner />
      </div>
    );
  }

  // Get stats
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;

  // Status badge colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'completed': return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      case 'cancelled': return { backgroundColor: '#ffebee', color: '#c62828' };
      default: return { backgroundColor: '#fff3e0', color: '#e65100' };
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: '8px'
        }}>
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p style={{ color: COLORS.textSecondary }}>
          Manage your bookings and account settings
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {[
          { title: 'Total Bookings', value: totalBookings, icon: '📅', color: COLORS.primary },
          { title: 'Confirmed', value: confirmedBookings, icon: '✅', color: '#2e7d32' },
          { title: 'Completed', value: completedBookings, icon: '🏁', color: '#7b1fa2' },
          { title: 'Pending', value: pendingBookings, icon: '⏳', color: '#e65100' }
        ].map((item, idx) => (
          <div key={idx} style={{
            backgroundColor: COLORS.background,
            borderRadius: '12px',
            boxShadow: COLORS.cardShadow,
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.textSecondary,
                marginBottom: '4px'
              }}>{item.title}</p>
              <p style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.text
              }}>{item.value}</p>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              backgroundColor: `${item.color}15`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.color,
              fontSize: '18px'
            }}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div style={{
        backgroundColor: COLORS.background,
        borderRadius: '12px',
        boxShadow: COLORS.cardShadow,
        padding: '24px',
        marginBottom: '28px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: COLORS.text
          }}>Recent Bookings</h2>
          <Link
            to="/dashboard/bookings"
            style={{
              color: COLORS.primary,
              fontWeight: '600',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            View All →
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              color: COLORS.textSecondary,
              fontSize: '24px'
            }}>
              📅
            </div>
            <p style={{ color: COLORS.textSecondary, marginBottom: '16px' }}>
              You haven't made any bookings yet.
            </p>
            <Link
              to="/tours"
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                backgroundColor: COLORS.primary,
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '600'
              }}
            >
              Browse Tours
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                style={{
                  paddingBottom: '16px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div>
                  <h3 style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
                    {booking.TourPackage?.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: COLORS.textSecondary }}>
                    {booking.start_date} to {booking.end_date}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', color: COLORS.text, marginBottom: '4px' }}>
                    KES {booking.total_amount.toLocaleString()}
                  </p>
                  <span style={{
                    ...getStatusStyle(booking.status),
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {booking.status}
                  </span>
                </div>
                <div style={{ marginTop: '8px', width: '100%' }}>
                  <Link
                    to={`/dashboard/bookings/${booking.id}`}
                    style={{
                      color: COLORS.primary,
                      fontWeight: '600',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: COLORS.background,
          borderRadius: '12px',
          boxShadow: COLORS.cardShadow,
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: '16px'
          }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Browse New Tours', path: '/tours' },
              { label: 'Manage My Bookings', path: '/dashboard/bookings' },
              { label: 'Update Profile', path: '/dashboard/profile' }
            ].map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: COLORS.text,
                  fontWeight: '500'
                }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{
          backgroundColor: COLORS.background,
          borderRadius: '12px',
          boxShadow: COLORS.cardShadow,
          padding: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: COLORS.text,
            marginBottom: '16px'
          }}>Need Help?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Contact Support', href: 'mailto:support@travelease.com' },
              { label: 'Visit Contact Page', path: '/contact' },
              { label: 'Call Us: +254 712 345 678', href: 'tel:+254712345678' }
            ].map((action, idx) => (
              action.path ? (
                <Link
                  key={idx}
                  to={action.path}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: COLORS.text,
                    fontWeight: '500'
                  }}
                >
                  {action.label}
                </Link>
              ) : (
                <a
                  key={idx}
                  href={action.href}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: COLORS.text,
                    fontWeight: '500'
                  }}
                >
                  {action.label}
                </a>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}