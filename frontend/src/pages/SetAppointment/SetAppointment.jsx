import { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  RxBell,
  RxCalendar,
  RxClock,
  RxPerson,
} from "react-icons/rx";
import { LuCircleCheck, LuClipboardList, LuTriangleAlert, LuBuilding2 } from "react-icons/lu";
import "./setAppointment.css";

const INITIAL_APPOINTMENTS = [
  {
    id: "APT-2305",
    patientName: "Naduni Senanayake",
    patientId: "PT-1034",
    doctorId: "DOC-001",
    doctorName: "Dr. Amal Fernando",
    date: new Date().toISOString().slice(0, 10),
    time: "09:00",
    duration: 30,
    visitType: "Follow-up",
    status: "Confirmed",
    sendReminder: true,
  },
  {
    id: "APT-2306",
    patientName: "Kasun Abeysekara",
    patientId: "PT-1042",
    doctorId: "DOC-003",
    doctorName: "Dr. Thisara Perera",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "11:30",
    duration: 45,
    visitType: "Consultation",
    status: "Pending",
    sendReminder: false,
  },
  {
    id: "APT-2307",
    patientName: "Ruvini Jayawardena",
    patientId: "PT-0981",
    doctorId: "DOC-002",
    doctorName: "Dr. Nirmala Jayasinghe",
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    time: "15:00",
    duration: 30,
    visitType: "Skin Screening",
    status: "Waiting",
    sendReminder: true,
  },
];

const initialFormState = {
  patientName: "",
  doctorId: "",
  date: "",
  branchId: "",
  visitType: "Consultation",
  duration: 30
};

export default function SetAppointment() {
  const [form, setForm] = useState(initialFormState);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [banner, setBanner] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const doctorDropdownRef = useRef(null);
  const [branchSearchTerm, setBranchSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const branchDropdownRef = useRef(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    fetchBranches();
    fetchDoctors();
    fetchAppointments();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target)) {
        setShowDoctorDropdown(false);
      }
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target)) {
        setShowBranchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const token = localStorage.getItem('catms_token');
      console.log('🔍 Fetching branches...');
      
      const response = await axios.get('http://localhost:3000/api/branch', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Branches fetched:', response.data);
      console.log('📊 Number of branches:', response.data.length);
      
      setBranches(response.data);
      setLoadingBranches(false);
    } catch (err) {
      console.error('❌ Error fetching branches:', err);
      setLoadingBranches(false);
      setBanner({ type: 'error', message: 'Failed to fetch branches.' });
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true);
      const token = localStorage.getItem('catms_token');
      console.log('🔍 Fetching doctors with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get('http://localhost:3000/api/staff/by-category/Doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Doctors fetched:', response.data);
      console.log('📊 Number of doctors:', response.data.length);
      
      setDoctors(response.data);
      setLoadingDoctors(false);
    } catch (err) {
      console.error('❌ Error fetching doctors:', err);
      console.error('Response:', err.response?.data);
      console.error('Status:', err.response?.status);
      setLoadingDoctors(false);
      setBanner({ type: 'error', message: 'Failed to fetch doctors. Please try refreshing the page.' });
    }
  };

  const getAvailableTimeSlot = async (doctorId, date) => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get(`http://localhost:3000/api/appointments/available-slots`, {
        params: { doctorId, date },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Return the first available time slot
      return response.data.slots[0];
    } catch (err) {
      console.error('Error getting available time slots:', err);
      setBanner({ type: 'error', message: 'Failed to get available time slots' });
      return null;
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setBanner({ type: 'error', message: 'Failed to fetch appointments' });
    }
  };



  const stats = useMemo(() => {
    const appointmentsToday = appointments.filter((apt) => apt.date === today).length;
    const pending = appointments.filter((apt) => apt.status === "Pending").length;
    const reminders = appointments.filter((apt) => apt.sendReminder).length;

    return [
      {
        label: "Appointments Today",
        value: appointmentsToday,
        icon: <RxCalendar />,
      },
      {
        label: "Pending Approvals",
        value: pending,
        icon: <LuClipboardList />,
      },
      {
        label: "Reminders Enabled",
        value: reminders,
        icon: <RxBell />,
      },
    ];
  }, [appointments, today]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setBranchSearchTerm(branch.name);
    setForm((prev) => ({ ...prev, branchId: branch.branch_id }));
    setShowBranchDropdown(false);
    // Clear doctor selection when branch changes
    setSelectedDoctor(null);
    setDoctorSearchTerm("");
    setForm((prev) => ({ ...prev, doctorId: "" }));
  };

  const handleBranchSearchChange = (e) => {
    setBranchSearchTerm(e.target.value);
    setShowBranchDropdown(true);
    if (!e.target.value) {
      setSelectedBranch(null);
      setForm((prev) => ({ ...prev, branchId: "" }));
      // Also clear doctor
      setSelectedDoctor(null);
      setDoctorSearchTerm("");
      setForm((prev) => ({ ...prev, doctorId: "" }));
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorSearchTerm(doctor.name);
    setForm((prev) => ({ ...prev, doctorId: doctor.staff_id }));
    setShowDoctorDropdown(false);
  };

  const handleDoctorSearchChange = (e) => {
    setDoctorSearchTerm(e.target.value);
    setShowDoctorDropdown(true);
    if (!e.target.value) {
      setSelectedDoctor(null);
      setForm((prev) => ({ ...prev, doctorId: "" }));
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  // Filter doctors by selected branch
  const filteredDoctors = doctors.filter(doctor => {
    // First filter by branch if one is selected
    if (form.branchId && doctor.branch_id !== form.branchId) {
      return false;
    }
    // Then filter by search term
    if (doctorSearchTerm) {
      return doctor.name?.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
             doctor.speciality?.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    }
    return true;
  });

  const resetForm = () => {
    setForm((prev) => ({
      ...initialFormState,
      date: prev.date,
    }));
    setDoctorSearchTerm("");
    setSelectedDoctor(null);
    setShowDoctorDropdown(false);
    setBranchSearchTerm("");
    setSelectedBranch(null);
    setShowBranchDropdown(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.patientName || !form.doctorId || !form.date || !form.branchId) {
      setBanner({ type: "warning", message: "Please fill in all required fields before saving." });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('catms_token');
      
      // Calculate appointment times based on duration
      const timeSlot = await getAvailableTimeSlot(form.doctorId, form.date);
      if (!timeSlot) {
        setBanner({ type: "error", message: "No available time slots for selected date" });
        return;
      }

      const startTime = timeSlot;
      const startDate = new Date();
      const [hours, minutes] = startTime.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes), 0);
      const endDate = new Date(startDate.getTime() + form.duration * 60000);
      const endTime = endDate.toTimeString().slice(0, 5);

      // Generate appointment ID
      const appointmentId = `A${Date.now().toString().slice(-4)}`;

      const appointmentData = {
        appointment_id: appointmentId,
        doctor_id: form.doctorId,
        branch_id: form.branchId,
        status: 'Scheduled',
        appointment_date: form.date,
        start_time: startTime,
        end_time: endTime,
        notes: form.visitType,
        appointment_fee: 300.00
      };

      await axios.post('http://localhost:3000/api/appointment', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const doctor = doctors.find((doc) => doc.staff_id === form.doctorId);
      
      const newAppointment = {
        id: appointmentId,
        patientName: form.patientName.trim(),
        patientId: form.patientId.trim(),
        doctorId: form.doctorId,
        doctorName: doctor?.name || "Assigned doctor",
        date: form.date,
        time: form.time,
        visitType: "Consultation",
        status: "Pending",
      };

      setAppointments((prev) => [newAppointment, ...prev]);
      resetForm();
      setBanner({
        type: "success",
        message: `Appointment for ${newAppointment.patientName} scheduled successfully!`,
      });
    } catch (err) {
      console.error('Error creating appointment:', err);
      setBanner({
        type: "warning",
        message: err.response?.data?.error || "Failed to create appointment. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeBanner = () => setBanner(null);

  return (
    <section className="set-appointment-page">
      <header className="set-appointment__header">
        <div>
          <h1>Set Appointment</h1>
          <p>Coordinate patient bookings, track follow-ups, and send reminders from one place.</p>
        </div>
      </header>

      <div className="set-appointment__stats">
        {stats.map((stat) => (
          <article key={stat.label} className="stat-card">
            <div className="stat-card__icon" aria-hidden>{stat.icon}</div>
            <div>
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
          </article>
        ))}
      </div>

      {banner && (
        <div className={`set-appointment__banner banner--${banner.type}`} role="status">
          {banner.type === "success" ? (
            <LuCircleCheck className="banner__icon" aria-hidden />
          ) : (
            <LuTriangleAlert className="banner__icon" aria-hidden />
          )}
          <span>{banner.message}</span>
          <button type="button" onClick={closeBanner} className="banner__close" aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}

      <div className="set-appointment__grid">
        <section className="card form-card">
          <header className="card__header">
            <div className="card__title">
              <LuClipboardList aria-hidden />
              <span>New Appointment</span>
            </div>
            <p>Capture patient details, choose the doctor, set time, and notify automatically.</p>
          </header>

          <form className="appointment-form" onSubmit={handleSubmit}>
            <div className="form__row">
              <label htmlFor="patientName" className="form__label">
                Patient Name
              </label>
              <div className="form__field">
                <span className="form__icon" aria-hidden>
                  <RxPerson />
                </span>
                <input
                  id="patientName"
                  name="patientName"
                  type="text"
                  placeholder="e.g. Sanduni Perera"
                  value={form.patientName}
                  onChange={handleChange("patientName")}
                  required
                />
              </div>
            </div>

            <div className="form__row" ref={branchDropdownRef}>
              <label htmlFor="branch" className="form__label">
                Select Branch <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="form__field search-dropdown-field">
                <span className="form__icon" aria-hidden>
                  <LuBuilding2 />
                </span>
                <div className="search-dropdown-wrapper">
                  <input
                    id="branch"
                    type="text"
                    value={branchSearchTerm}
                    onChange={handleBranchSearchChange}
                    onFocus={() => setShowBranchDropdown(true)}
                    placeholder="Search branch by name..."
                    autoComplete="off"
                    required
                  />
                  {showBranchDropdown && loadingBranches && (
                    <div className="search-dropdown-menu">
                      <div className="search-dropdown-item no-results">
                        Loading branches...
                      </div>
                    </div>
                  )}
                  {showBranchDropdown && !loadingBranches && filteredBranches.length > 0 && (
                    <div className="search-dropdown-menu">
                      {filteredBranches.map((branch) => (
                        <div
                          key={branch.branch_id}
                          className="search-dropdown-item"
                          onClick={() => handleBranchSelect(branch)}
                        >
                          <div className="doctor-info">
                            <span className="doctor-name">{branch.name}</span>
                            {branch.address && (
                              <span className="doctor-specialty">{branch.address}</span>
                            )}
                          </div>
                          <span className="doctor-id">ID: {branch.branch_id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showBranchDropdown && !loadingBranches && branches.length === 0 && (
                    <div className="search-dropdown-menu">
                      <div className="search-dropdown-item no-results">
                        No branches available.
                      </div>
                    </div>
                  )}
                  {showBranchDropdown && !loadingBranches && branchSearchTerm && filteredBranches.length === 0 && branches.length > 0 && (
                    <div className="search-dropdown-menu">
                      <div className="search-dropdown-item no-results">
                        No branches found matching "{branchSearchTerm}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form__row" ref={doctorDropdownRef}>
              <label htmlFor="doctor" className="form__label">
                Assign Doctor {!form.branchId && <span style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 'normal' }}>(Select branch first)</span>}
              </label>
              <div className="form__field search-dropdown-field">
                <span className="form__icon" aria-hidden>
                  <LuClipboardList />
                </span>
                <div className="search-dropdown-wrapper">
                  <input
                    id="doctor"
                    type="text"
                    value={doctorSearchTerm}
                    onChange={handleDoctorSearchChange}
                    onFocus={() => setShowDoctorDropdown(true)}
                    placeholder={form.branchId ? "Search doctor by name or specialty..." : "Select a branch first..."}
                    autoComplete="off"
                    required
                    disabled={!form.branchId}
                  />
                  {showDoctorDropdown && loadingDoctors && (
                    <div className="search-dropdown-menu">
                      <div className="search-dropdown-item no-results">
                        Loading doctors...
                      </div>
                    </div>
                  )}
                  {showDoctorDropdown && !loadingDoctors && filteredDoctors.length > 0 && (
                    <div className="search-dropdown-menu">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.staff_id}
                          className="search-dropdown-item"
                          onClick={() => handleDoctorSelect(doctor)}
                        >
                          <div className="doctor-info">
                            <span className="doctor-name">{doctor.name}</span>
                            {doctor.speciality && (
                              <span className="doctor-specialty">{doctor.speciality}</span>
                            )}
                          </div>
                          <span className="doctor-id">ID: {doctor.staff_id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showDoctorDropdown && !loadingDoctors && form.branchId && filteredDoctors.length === 0 && (
                    <div className="search-dropdown-menu">
                      <div className="search-dropdown-item no-results">
                        {doctorSearchTerm ? `No doctors found matching "${doctorSearchTerm}"` : `No doctors available in this branch`}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form__split">
              <div className="form__row">
                <label htmlFor="date" className="form__label">
                  Appointment Date
                </label>
                <div className="form__field">
                  <span className="form__icon" aria-hidden>
                    <RxCalendar />
                  </span>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange("date")}
                    min={today}
                    required
                  />
                </div>
              </div>

              <div className="form__row">
                <label htmlFor="visitType" className="form__label">
                  Visit Type
                </label>
                <div className="form__field">
                  <span className="form__icon" aria-hidden>
                    <RxClock />
                  </span>
                  <select
                    id="visitType"
                    name="visitType"
                    value={form.visitType}
                    onChange={handleChange("visitType")}
                    required
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form__row">
              <label htmlFor="duration" className="form__label">
                Duration (minutes)
              </label>
              <div className="form__field">
                <span className="form__icon" aria-hidden>
                  <RxClock />
                </span>
                <select
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange("duration")}
                  required
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
            </div>

            <div className="form__actions">
              <button type="button" className="btn btn--ghost" onClick={resetForm} disabled={loading}>
                Clear form
              </button>
              <button type="submit" className="btn btn--primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save appointment'}
              </button>
            </div>
          </form>
        </section>

        <section className="side-panel">
          <article className="card upcoming-card">
            <header className="card__header">
              <div className="card__title">
                <RxCalendar aria-hidden />
                <span>Upcoming</span>
              </div>
              <p>Stay on top of the next scheduled sessions.</p>
            </header>

            <ul className="upcoming-list">
              {appointments.map((appointment) => (
                <li key={appointment.id} className="upcoming-item">
                  <div className="upcoming-item__time">
                    <span className="upcoming-item__date">{new Date(appointment.date).toLocaleDateString()}</span>
                    <span className="upcoming-item__slot">{appointment.time}</span>
                  </div>
                  <div className="upcoming-item__info">
                    <h3>{appointment.patientName}</h3>
                    <p>{appointment.doctorName}</p>
                    <span className={`status status--${appointment.status.toLowerCase()}`}>
                      {appointment.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="card availability-card">
            <header className="card__header">
              <div className="card__title">
                <RxPerson aria-hidden />
                <span>Doctor availability</span>
              </div>
              <p>Quick glance at the next free slot for each specialist.</p>
            </header>

            <ul className="availability-list">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <li key={doctor.staff_id} className="availability-item">
                    <div>
                      <h4>{doctor.name}</h4>
                      <span>{doctor.speciality || 'General Practice'}</span>
                    </div>
                    <span className="availability-item__time">ID: {doctor.staff_id}</span>
                  </li>
                ))
              ) : (
                <li className="availability-item">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Loading doctors...</span>
                  </div>
                </li>
              )}
            </ul>
          </article>
        </section>
      </div>
    </section>
  );
}
