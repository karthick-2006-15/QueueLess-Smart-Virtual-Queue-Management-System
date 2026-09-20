import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import { useQueue } from '../context/QueueContext';

const AdminPage = () => {
  const { services, queueList, addService, updateService, deleteService } = useQueue();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    prefix: '',
    description: '',
    location: 'Main Admin Wing',
    counterNumber: '',
    averageServiceTime: 5,
    category: 'Academic',
    status: 'OPEN',
  });

  const totalWaiting = queueList.filter((q) => q.status === 'WAITING').length;
  const totalCompleted = queueList.filter((q) => q.status === 'COMPLETED').length + 142;

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newService.name || !newService.prefix || !newService.counterNumber) {
      return;
    }
    addService(newService);
    setShowAddModal(false);
    setNewService({
      name: '',
      prefix: '',
      description: '',
      location: 'Main Admin Wing',
      counterNumber: '',
      averageServiceTime: 5,
      category: 'Academic',
      status: 'OPEN',
    });
  };

  const toggleStatus = (service) => {
    const nextStatus = service.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    updateService(service._id, { status: nextStatus });
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />

        <main className="main-content fade-in">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h1 style={{ fontSize: '1.85rem', color: 'var(--dark)', fontWeight: 800 }}>
                  Campus Administration
                </h1>
                <span className="badge badge-danger">ADMIN</span>
              </div>
              <p className="text-muted">Real-time metrics, counter controls, and service management.</p>
            </div>

            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <i className="fa-solid fa-plus"></i> Add New Service
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid-cards mb-4">
            <StatCard
              icon="fa-users"
              color="blue"
              label="Registered Users"
              value="1,248"
              subtext="Students & campus staff"
            />
            <StatCard
              icon="fa-hourglass-half"
              color="yellow"
              label="Currently In Queue"
              value={totalWaiting}
              subtext="Across all counters"
            />
            <StatCard
              icon="fa-circle-check"
              color="green"
              label="Completed Today"
              value={totalCompleted}
              subtext="Tickets serviced"
            />
            <StatCard
              icon="fa-clock"
              color="red"
              label="Avg. Wait Time"
              value="18m"
              subtext="Campus-wide average"
            />
          </div>

          {/* Service Management Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--dark)', fontWeight: 700 }}>Active Campus Desks</h3>
              <span className="badge badge-success">{services.length} Registered</span>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Prefix</th>
                    <th>Counter</th>
                    <th>Status</th>
                    <th>Avg Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td style={{ fontWeight: 600, color: 'var(--dark)' }}>{service.name}</td>
                      <td>
                        <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}>
                          {service.prefix}
                        </span>
                      </td>
                      <td>{service.counterNumber}</td>
                      <td>
                        <span
                          className={`badge ${
                            service.status === 'OPEN' ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {service.status}
                        </span>
                      </td>
                      <td>~{service.averageServiceTime} mins</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                            onClick={() => toggleStatus(service)}
                          >
                            {service.status === 'OPEN' ? 'Close Counter' : 'Open Counter'}
                          </button>
                          <button
                            className="btn btn-outline btn-danger"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.8rem',
                              borderColor: 'var(--danger)',
                              color: 'var(--danger)',
                            }}
                            onClick={() => deleteService(service._id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add New Service Modal */}
      <Modal
        isOpen={showAddModal}
        title="Add Campus Service Desk"
        onClose={() => setShowAddModal(false)}
        showFooter={false}
      >
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Service Desk Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sports Equipment Counter"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Token Prefix</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. SPORT"
                value={newService.prefix}
                onChange={(e) => setNewService({ ...newService, prefix: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Counter Desk</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Counter 5"
                value={newService.counterNumber}
                onChange={(e) => setNewService({ ...newService, counterNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Avg. Service Time (Mins)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={newService.averageServiceTime}
                onChange={(e) =>
                  setNewService({ ...newService, averageServiceTime: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Status</label>
              <select
                className="form-control"
                value={newService.status}
                onChange={(e) => setNewService({ ...newService, status: e.target.value })}
              >
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Brief summary of services provided at this counter..."
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Service Desk
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AdminPage;
