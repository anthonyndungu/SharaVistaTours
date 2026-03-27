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