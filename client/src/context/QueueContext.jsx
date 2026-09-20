import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ApiClient from '../services/api';
import socket from '../services/socket';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const QueueContext = createContext(null);

const DEFAULT_SERVICES = [
  {
    _id: 'srv-cert-01',
    name: 'Certificate Office',
    prefix: 'CERT',
    description: 'Degree certificates, transcripts, Bonafide and ID cards',
    location: 'Admin Block, Ground Floor',
    counterNumber: 'Counter 2',
    averageServiceTime: 4,
    status: 'OPEN',
    icon: 'fa-certificate',
    category: 'Academic',
  },
  {
    _id: 'srv-acc-02',
    name: 'Accounts Section',
    prefix: 'ACC',
    description: 'Tuition fees, scholarship disbursements, and fine clearance',
    location: 'Admin Block, 1st Floor',
    counterNumber: 'Counter 1',
    averageServiceTime: 6,
    status: 'OPEN',
    icon: 'fa-receipt',
    category: 'Finance',
  },
  {
    _id: 'srv-it-03',
    name: 'IT Help Desk',
    prefix: 'IT',
    description: 'Campus WiFi setup, portal password resets, and lab accounts',
    location: 'Tech Hub, Room 104',
    counterNumber: 'Counter 4',
    averageServiceTime: 5,
    status: 'OPEN',
    icon: 'fa-laptop-code',
    category: 'Technical',
  },
  {
    _id: 'srv-lib-04',
    name: 'Central Library',
    prefix: 'LIB',
    description: 'Book issuance, returns, digital repository access, and NOC',
    location: 'Central Library, Block C',
    counterNumber: 'Circulation Desk',
    averageServiceTime: 3,
    status: 'OPEN',
    icon: 'fa-book-bookmark',
    category: 'Academic',
  },
  {
    _id: 'srv-exam-05',
    name: 'Examination Cell',
    prefix: 'EXAM',
    description: 'Hall tickets, revaluation applications, and grade sheets',
    location: 'Exam Wing, 2nd Floor',
    counterNumber: 'Counter 3',
    averageServiceTime: 5,
    status: 'CLOSED',
    icon: 'fa-graduation-cap',
    category: 'Academic',
  },
];

export const QueueProvider = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('ql_services');
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // Active queue for the logged-in user
  const [activeQueue, setActiveQueue] = useState(() => {
    try {
      const saved = localStorage.getItem('ql_active_queue');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Queue history
  const [queueHistory, setQueueHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('ql_queue_history');
      return saved ? JSON.parse(saved) : [
        {
          _id: 'hist-1',
          tokenNumber: 'CERT-028',
          serviceName: 'Certificate Office',
          date: 'Yesterday',
          status: 'COMPLETED',
        },
        {
          _id: 'hist-2',
          tokenNumber: 'LIB-014',
          serviceName: 'Central Library',
          date: '3 days ago',
          status: 'COMPLETED',
        },
      ];
    } catch {
      return [];
    }
  });

  // All active queue tickets across all services (for Staff/Admin queue boards)
  const [queueList, setQueueList] = useState(() => {
    try {
      const saved = localStorage.getItem('ql_all_queues');
      return saved ? JSON.parse(saved) : [
        {
          _id: 'q-101',
          tokenNumber: 'CERT-035',
          serviceId: 'srv-cert-01',
          serviceName: 'Certificate Office',
          counterNumber: 'Counter 2',
          studentName: 'Aarav Sharma',
          studentId: 'CSE-2023-041',
          status: 'SERVING',
          joinedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        },
        {
          _id: 'q-102',
          tokenNumber: 'CERT-036',
          serviceId: 'srv-cert-01',
          serviceName: 'Certificate Office',
          counterNumber: 'Counter 2',
          studentName: 'Priya Patel',
          studentId: 'CSE-2023-078',
          status: 'CALLED',
          joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        },
        {
          _id: 'q-103',
          tokenNumber: 'CERT-037',
          serviceId: 'srv-cert-01',
          serviceName: 'Certificate Office',
          counterNumber: 'Counter 2',
          studentName: 'Rohan Verma',
          studentId: 'IT-2023-012',
          status: 'WAITING',
          joinedAt: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          _id: 'q-104',
          tokenNumber: 'ACC-019',
          serviceId: 'srv-acc-02',
          serviceName: 'Accounts Section',
          counterNumber: 'Counter 1',
          studentName: 'Sneha Gupta',
          studentId: 'ECE-2023-055',
          status: 'SERVING',
          joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
        },
      ];
    } catch {
      return [];
    }
  });

  // Fetch services from backend if available
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await ApiClient.get('/services');
        if (res.success && res.data?.services?.length) {
          setServices(res.data.services);
          localStorage.setItem('ql_services', JSON.stringify(res.data.services));
        }
      } catch (err) {
        // Fallback to local state
      }
    };
    fetchServices();
  }, []);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('ql_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    if (activeQueue) {
      localStorage.setItem('ql_active_queue', JSON.stringify(activeQueue));
    } else {
      localStorage.removeItem('ql_active_queue');
    }
  }, [activeQueue]);

  useEffect(() => {
    localStorage.setItem('ql_queue_history', JSON.stringify(queueHistory));
  }, [queueHistory]);

  useEffect(() => {
    localStorage.setItem('ql_all_queues', JSON.stringify(queueList));
  }, [queueList]);

  // Socket listener for real-time queue events
  useEffect(() => {
    const handleQueueUpdate = (data) => {
      if (data.activeQueue && activeQueue && data.activeQueue._id === activeQueue._id) {
        setActiveQueue(data.activeQueue);
        if (data.activeQueue.status === 'CALLED') {
          toast.warning(`🔔 Your token ${data.activeQueue.tokenNumber} has been called! Proceed to ${data.activeQueue.counterNumber}.`);
        }
      }
      if (data.queueList) {
        setQueueList(data.queueList);
      }
    };

    socket.on('queueUpdated', handleQueueUpdate);
    socket.on('tokenCalled', (calledData) => {
      if (activeQueue && activeQueue._id === calledData._id) {
        setActiveQueue((prev) => ({ ...prev, status: 'CALLED' }));
        toast.warning(`🔔 Your token has been called at ${calledData.counterNumber}!`);
      }
    });

    return () => {
      socket.off('queueUpdated', handleQueueUpdate);
      socket.off('tokenCalled');
    };
  }, [activeQueue, toast]);

  // Calculate live dynamic metrics for user active queue
  const getQueueMetrics = useCallback((queueItem) => {
    if (!queueItem) return null;
    const serviceQueues = queueList.filter(
      (q) => q.serviceId === queueItem.serviceId && (q.status === 'WAITING' || q.status === 'CALLED')
    );
    const itemIndex = serviceQueues.findIndex((q) => q._id === queueItem._id);
    const peopleAhead = itemIndex >= 0 ? itemIndex : 0;
    const currentServing = queueList.find(
      (q) => q.serviceId === queueItem.serviceId && (q.status === 'SERVING' || q.status === 'CALLED')
    );
    const estimatedWait = Math.max(1, (peopleAhead + 1) * (queueItem.averageServiceTime || 4));

    return {
      peopleAhead,
      currentServingToken: currentServing ? currentServing.tokenNumber : '--',
      estimatedWait,
    };
  }, [queueList]);

  // Join Queue
  const joinQueue = async (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    if (!service) throw new Error('Service not found');
    if (service.status !== 'OPEN') throw new Error('This service is currently closed');

    if (activeQueue && (activeQueue.status === 'WAITING' || activeQueue.status === 'CALLED')) {
      throw new Error(`You already have an active queue ticket (${activeQueue.tokenNumber})`);
    }

    try {
      // Try backend API first
      const res = await ApiClient.post('/queues/join', { serviceId }).catch(() => null);
      if (res && res.success && res.data?.queue) {
        setActiveQueue(res.data.queue);
        toast.success(`Joined queue for ${service.name}! Token: ${res.data.queue.tokenNumber}`);
        return res.data.queue;
      }
    } catch (err) {
      console.warn('Backend join failed, using client simulation:', err.message);
    }

    // Client fallback simulation
    const serviceTickets = queueList.filter((q) => q.serviceId === serviceId);
    const nextNum = serviceTickets.length + 38;
    const tokenNumber = `${service.prefix}-${String(nextNum).padStart(3, '0')}`;

    const newTicket = {
      _id: 'q-' + Date.now(),
      tokenNumber,
      serviceId: service._id,
      serviceName: service.name,
      counterNumber: service.counterNumber,
      averageServiceTime: service.averageServiceTime,
      studentName: user?.name || 'Student User',
      studentId: user?.studentId || 'STU-1234',
      status: 'WAITING',
      joinedAt: new Date().toISOString(),
    };

    setQueueList((prev) => [...prev, newTicket]);
    setActiveQueue(newTicket);
    socket.emit('joinQueue', newTicket);

    toast.success(`Joined queue for ${service.name}! Your token is ${tokenNumber}`);
    return newTicket;
  };

  // Cancel Queue
  const cancelQueue = async () => {
    if (!activeQueue) return;

    try {
      await ApiClient.delete(`/queues/${activeQueue._id}`).catch(() => {});
    } catch {}

    const cancelledItem = {
      ...activeQueue,
      status: 'CANCELLED',
      date: 'Today',
    };

    setQueueHistory((prev) => [cancelledItem, ...prev]);
    setQueueList((prev) => prev.filter((q) => q._id !== activeQueue._id));
    setActiveQueue(null);

    toast.info('You have left the queue.');
  };

  // Staff: Call Next in line
  const callNext = (serviceId) => {
    setQueueList((prev) => {
      // Complete any currently serving ticket in this service
      let updated = prev.map((q) => {
        if (q.serviceId === serviceId && (q.status === 'SERVING' || q.status === 'CALLED')) {
          return { ...q, status: 'COMPLETED' };
        }
        return q;
      });

      // Find first waiting ticket
      const nextIdx = updated.findIndex((q) => q.serviceId === serviceId && q.status === 'WAITING');
      if (nextIdx !== -1) {
        updated[nextIdx] = { ...updated[nextIdx], status: 'CALLED' };
        toast.success(`Called next token: ${updated[nextIdx].tokenNumber}`);

        if (activeQueue && activeQueue._id === updated[nextIdx]._id) {
          setActiveQueue((curr) => ({ ...curr, status: 'CALLED' }));
        }
        socket.emit('tokenCalled', updated[nextIdx]);
      } else {
        toast.info('No more students waiting in line for this service.');
      }

      return updated;
    });
  };

  // Staff: Mark Completed
  const completeServing = (serviceId) => {
    setQueueList((prev) => {
      return prev.map((q) => {
        if (q.serviceId === serviceId && (q.status === 'SERVING' || q.status === 'CALLED')) {
          toast.success(`Marked token ${q.tokenNumber} as completed.`);
          if (activeQueue && activeQueue._id === q._id) {
            setActiveQueue(null);
            setQueueHistory((h) => [{ ...q, status: 'COMPLETED', date: 'Just now' }, ...h]);
          }
          return { ...q, status: 'COMPLETED' };
        }
        return q;
      });
    });
  };

  // Staff: Skip (No show)
  const skipCurrent = (serviceId) => {
    setQueueList((prev) => {
      return prev.map((q) => {
        if (q.serviceId === serviceId && (q.status === 'SERVING' || q.status === 'CALLED')) {
          toast.warning(`Skipped token ${q.tokenNumber} (No show).`);
          if (activeQueue && activeQueue._id === q._id) {
            setActiveQueue(null);
            setQueueHistory((h) => [{ ...q, status: 'SKIPPED', date: 'Just now' }, ...h]);
          }
          return { ...q, status: 'SKIPPED' };
        }
        return q;
      });
    });
  };

  // Admin: Add Service
  const addService = (newService) => {
    const created = {
      ...newService,
      _id: 'srv-' + Date.now(),
      status: newService.status || 'OPEN',
    };
    setServices((prev) => [...prev, created]);
    toast.success(`Created new service: ${created.name}`);
  };

  // Admin: Update Service
  const updateService = (id, updatedFields) => {
    setServices((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updatedFields } : s))
    );
    toast.success('Service updated successfully.');
  };

  // Admin: Delete Service
  const deleteService = (id) => {
    setServices((prev) => prev.filter((s) => s._id !== id));
    toast.success('Service removed.');
  };

  return (
    <QueueContext.Provider
      value={{
        services,
        activeQueue,
        queueHistory,
        queueList,
        joinQueue,
        cancelQueue,
        callNext,
        completeServing,
        skipCurrent,
        addService,
        updateService,
        deleteService,
        getQueueMetrics,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
