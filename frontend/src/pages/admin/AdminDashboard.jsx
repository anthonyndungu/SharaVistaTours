import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageStats } from '../../features/packages/packageSlice';
import { getAllBookings } from '../../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import './../../layouts/AdminLayout.css'; // Uses global styles

// Icons
const Icons = {
  Calendar: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Flag: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-8a2 2 0 012-2h10a2 2 0 012 2v8m2-2a2 2 0 100-4m0 4a2 2 0 110-4m-6 8V3" /></svg>,
  Money: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Search: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  ChevronLeft: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  ChevronDown: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
  ArrowRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
};

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats: packageStats, loading: packageLoading } = useSelector((state) => state.packages);
  const { bookings: allBookings, loading: bookingLoading } = useSelector((state) => state.bookings);

  const [packageSearch, setPackageSearch] = useState('');
  const [packagePage, setPackagePage] = useState(1);
  const [packageRows, setPackageRows] = useState(5);

  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingPage, setBookingPage] = useState(1);
  const [bookingRows, setBookingRows] = useState(5);

  useEffect(() => {
    dispatch(fetchPackageStats());
    dispatch(getAllBookings());
  }, [dispatch]);

  useEffect(() => { setPackagePage(1); }, [packageSearch, packageRows]);
  useEffect(() => { setBookingPage(1); }, [bookingSearch, bookingStatusFilter, bookingRows]);

  const loading = packageLoading || bookingLoading;

  const totalBookings = allBookings?.length || 0;
  const confirmedBookings = allBookings?.filter(b => b.status === 'confirmed').length || 0;
  const completedBookings = allBookings?.filter(b => b.status === 'completed').length || 0;
  const totalRevenue = allBookings?.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0) || 0;

  const filteredPackages = useMemo(() => {
    if (!packageStats) return [];
    return packageStats.filter(stat => stat.category.toLowerCase().includes(packageSearch.toLowerCase()));
  }, [packageStats, packageSearch]);

  const packageTotalPages = Math.ceil(filteredPackages.length / packageRows);
  const currentPackages = filteredPackages.slice((packagePage - 1) * packageRows, packagePage * packageRows);

  const filteredBookings = useMemo(() => {
    if (!allBookings) return [];
    return allBookings.filter(b => {
      const matchesSearch = 
        b.TourPackage?.title?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.User?.name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.booking_number?.toLowerCase().includes(bookingSearch.toLowerCase());
      const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allBookings, bookingSearch, bookingStatusFilter]);

  const bookingTotalPages = Math.ceil(filteredBookings.length / bookingRows);
  const currentBookings = filteredBookings.slice((bookingPage - 1) * bookingRows, bookingPage * bookingRows);

  const getStatusClass = (status) => `status-badge status-${status}`;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="content-container">
      
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Overview of your tours, bookings, and revenue</p>
      </header>

      {/* Stats Grid */}
      <section className="stats-grid">
        <StatCard title="Total Bookings" value={totalBookings} icon={<Icons.Calendar />} color="blue" />
        <StatCard title="Confirmed" value={confirmedBookings} icon={<Icons.Check />} color="green" />
        <StatCard title="Completed" value={completedBookings} icon={<Icons.Flag />} color="purple" />
        <StatCard title="Total Revenue" value={`KES ${totalRevenue.toLocaleString()}`} icon={<Icons.Money />} color="orange" />
      </section>

      {/* Package Categories Section */}
      <section className="card">
        <div className="card-header">
          <h2>Package Categories</h2>
          <Link to="/admin/packages" className="view-all-link">View All <Icons.ArrowRight /></Link>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <Icons.Search />
            <input type="text" placeholder="Search categories..." value={packageSearch} onChange={(e) => setPackageSearch(e.target.value)} />
          </div>
          <div className="rows-per-page">
            <label>Show:</label>
            <select value={packageRows} onChange={(e) => setPackageRows(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {filteredPackages.length === 0 ? (
          <div className="empty-state-small">No package categories found.</div>
        ) : (
          <>
            {/* ✅ MOBILE CARD VIEW FOR PACKAGES */}
            <div className="mobile-card-list">
              {currentPackages.map((stat, idx) => (
                <div key={idx} className="data-card">
                  <div className="card-header-simple">
                    <span className="category-title">{stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}</span>
                    <span className="badge-count">{stat.count} Packages</span>
                  </div>
                  <div className="card-body-grid">
                    <div className="detail-item">
                      <span className="detail-label">Avg Price</span>
                      <span className="detail-value">KES {parseFloat(stat.avgPrice).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Min Price</span>
                      <span className="detail-value">KES {parseFloat(stat.minPrice).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Max Price</span>
                      <span className="detail-value">KES {parseFloat(stat.maxPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Packages</th>
                    <th className="text-right">Avg Price</th>
                    <th className="text-right">Min Price</th>
                    <th className="text-right">Max Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPackages.map((stat) => (
                    <tr key={stat.category}>
                      <td className="font-bold">{stat.category.charAt(0).toUpperCase() + stat.category.slice(1)}</td>
                      <td>{stat.count}</td>
                      <td className="text-right">KES {parseFloat(stat.avgPrice).toLocaleString()}</td>
                      <td className="text-right">KES {parseFloat(stat.minPrice).toLocaleString()}</td>
                      <td className="text-right">KES {parseFloat(stat.maxPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {packageTotalPages > 1 && (
              <Pagination currentPage={packagePage} totalPages={packageTotalPages} onPageChange={setPackagePage} />
            )}
          </>
        )}
      </section>

      {/* Recent Bookings Section */}
      <section className="card">
        <div className="card-header">
          <h2>Recent Bookings</h2>
          <Link to="/admin/bookings" className="view-all-link">View All <Icons.ArrowRight /></Link>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <Icons.Search />
            <input type="text" placeholder="Search by user, package, or ID..." value={bookingSearch} onChange={(e) => setBookingSearch(e.target.value)} />
          </div>
          <div className="filters-group">
            <div className="select-wrapper">
              <select value={bookingStatusFilter} onChange={(e) => setBookingStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Icons.ChevronDown />
            </div>
            <div className="rows-per-page">
              <label>Show:</label>
              <select value={bookingRows} onChange={(e) => setBookingRows(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="empty-state-small">No bookings found matching your filters.</div>
        ) : (
          <>
            {/* ✅ MOBILE CARD VIEW FOR BOOKINGS */}
            <div className="mobile-card-list">
              {currentBookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="card-header">
                    <div className="header-top">
                      <span className="booking-id">{booking.booking_number}</span>
                      <span className={getStatusClass(booking.status)}>{booking.status}</span>
                    </div>
                    <h3 className="package-title-mobile">{booking.TourPackage?.title || 'N/A'}</h3>
                  </div>
                  <div className="card-body-grid">
                    <div className="detail-item">
                      <span className="detail-label">Client</span>
                      <span className="detail-value">{booking.User?.name || 'Guest'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{new Date(booking.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item amount-item">
                      <span className="detail-label">Amount</span>
                      <span className="detail-value amount-text">KES {parseFloat(booking.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>User</th>
                    <th>Booking ID</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="font-bold">{booking.TourPackage?.title || 'N/A'}</td>
                      <td>{booking.User?.name || 'Guest'}</td>
                      <td className="mono-text">{booking.booking_number}</td>
                      <td className="text-right font-bold">KES {parseFloat(booking.total_amount).toLocaleString()}</td>
                      <td><span className={getStatusClass(booking.status)}>{booking.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {bookingTotalPages > 1 && (
              <Pagination currentPage={bookingPage} totalPages={bookingTotalPages} onPageChange={setBookingPage} />
            )}
          </>
        )}
      </section>

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
      <div className={`stat-icon-bg stat-icon-${color}`}>{icon}</div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination-container">
      <button className="btn-pagination" onClick={() => onPageChange(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        <Icons.ChevronLeft /> Prev
      </button>
      <span className="page-info">Page {currentPage} of {totalPages}</span>
      <button className="btn-pagination" onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
        Next <Icons.ChevronRight />
      </button>
    </div>
  );
}