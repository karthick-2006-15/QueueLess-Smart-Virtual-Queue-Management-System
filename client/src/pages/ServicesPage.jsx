import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useQueue } from '../context/QueueContext';
import { useToast } from '../context/ToastContext';

const ServicesPage = () => {
  const { services, joinQueue, activeQueue, queueList } = useQueue();
  const toast = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joiningId, setJoiningId] = useState(null);

  const categories = ['All', 'Academic', 'Finance', 'Technical', 'Open Only'];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.counterNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Open Only') return service.status === 'OPEN';
    return service.category === selectedCategory;
  });

  const handleJoin = async (service) => {
    if (service.status !== 'OPEN') {
      return toast.warning('This service counter is currently closed.');
    }

    if (activeQueue) {
      return toast.warning(`You are already waiting in queue with token ${activeQueue.tokenNumber}. Cancel it first to join another.`);
    }

    setJoiningId(service._id);
    try {
      await joinQueue(service._id);
      navigate('/queue');
    } catch (err) {
      toast.error(err.message || 'Failed to join queue.');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content fade-in">
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--dark)', fontWeight: 800 }}>
              Campus Services & Queues
            </h1>
            <p className="text-muted">Select a department or service desk to take a virtual digital token.</p>
          </div>

          {/* Search & Filter Controls */}
          <div
            className="glass-card mb-4"
            style={{
              background: 'white',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              ></i>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Search service name, counter, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.875rem',
                    borderRadius: '99px',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid-cards">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => {
                const isCurrentService = activeQueue?.serviceId === service._id;
                const activeWaitingCount = queueList.filter(
                  (q) => q.serviceId === service._id && (q.status === 'WAITING' || q.status === 'CALLED')
                ).length;

                return (
                  <div
                    key={service._id}
                    className="glass-card"
                    style={{
                      background: 'white',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '1rem',
                        }}
                      >
                        <span
                          className={`badge ${
                            service.status === 'OPEN' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {service.status}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {service.prefix}
                        </span>
                      </div>

                      <h3 style={{ color: 'var(--dark)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                        {service.name}
                      </h3>
                      <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.25rem', minHeight: '40px' }}>
                        {service.description || 'Administrative support and student services.'}
                      </p>

                      <div
                        style={{
                          background: 'var(--bg-main)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius)',
                          marginBottom: '1.5rem',
                          fontSize: '0.875rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span className="text-muted">Location:</span>
                          <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{service.counterNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span className="text-muted">Currently In Line:</span>
                          <span style={{ fontWeight: 700, color: 'var(--warning)' }}>
                            {activeWaitingCount} students
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span className="text-muted">Avg. Time:</span>
                          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                            ~{service.averageServiceTime || 5} mins / student
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      className={`btn ${isCurrentService ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                      disabled={service.status !== 'OPEN' || joiningId === service._id}
                      onClick={() => handleJoin(service)}
                    >
                      {joiningId === service._id ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Generating Token...
                        </>
                      ) : isCurrentService ? (
                        <>
                          <i className="fa-solid fa-check"></i> Already In Queue
                        </>
                      ) : service.status !== 'OPEN' ? (
                        'Desk Closed'
                      ) : (
                        <>
                          <i className="fa-solid fa-ticket"></i> Join Virtual Queue
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                }}
              >
                <i
                  className="fa-solid fa-filter-circle-xmark"
                  style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}
                ></i>
                <h3 style={{ color: 'var(--dark)' }}>No matching services found</h3>
                <p className="text-muted">Try modifying your search keywords or switching category filters.</p>
                <button
                  className="btn btn-outline mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ServicesPage;
