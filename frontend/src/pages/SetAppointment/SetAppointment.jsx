import { useMemo, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  RxBell,
  RxCalendar,
  RxClock,
  RxPerson,
} from "react-icons/rx";
import { LuCircleCheck, LuClipboardList, LuTriangleAlert, LuBuilding2 } from "react-icons/lu";
import SearchableBranchDropdown from './SearchableBranchDropdown';
import "./setAppointment.css";


const initialFormState = {
  doctorId: "",
  date: "",
  branchId: "",
  notes: ""
};

export default function SetAppointment() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialFormState);
  const [appointments, setAppointments] = useState([]);
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
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");
  const [specialities, setSpecialities] = useState(["All"]);
  const [availableDates, setAvailableDates] = useState([]);

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
      
      // Extract unique specialities
      const uniqueSpecialities = ["All", ...new Set(response.data.map(doc => doc.speciality).filter(Boolean))];
      setSpecialities(uniqueSpecialities);
      
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
      
      // Convert date to YYYY-MM-DD format if it's not already
      const dateStr = typeof date === 'string' && date.includes('T') 
        ? date.split('T')[0] 
        : date;
      
      console.log('📅 Fetching slots for doctorId:', doctorId, 'date:', dateStr);
      
      const response = await axios.get(`http://localhost:3000/api/appointment/available-slots`, {
        params: { doctorId, date: dateStr },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Available slots response:', response.data);
      
      // Return the first available time slot and schedule_id
      if (response.data.slots && response.data.slots.length > 0) {
        return {
          time: response.data.slots[0],
          schedule_id: response.data.schedule_id
        };
      }
      return null;
    } catch (err) {
      console.error('Error getting available time slots:', err);
      setBanner({ type: 'error', message: 'Failed to get available time slots' });
      return null;
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/appointment', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
      
      console.log('✅ Appointments fetched:', response.data);
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
    
    // Update specialities based on selected branch
    const doctorsInBranch = doctors.filter(doc => doc.branch_id === branch.branch_id);
    const branchSpecialities = ["All", ...new Set(doctorsInBranch.map(doc => doc.speciality).filter(Boolean))];
    setSpecialities(branchSpecialities);
    setSelectedSpeciality("All"); // Reset speciality selection
  };

  const handleBranchSearchChange = (e) => {
    setBranchSearchTerm(e.target.value);
    setShowBranchDropdown(true);
    if (!e.target.value) {
      setSelectedBranch(null);
      setForm((prev) => ({ ...prev, branchId: "" }));
      // Also clear doctor and reset specialities
      setSelectedDoctor(null);
      setDoctorSearchTerm("");
      setForm((prev) => ({ ...prev, doctorId: "" }));
      // Reset specialities to include all available ones
      const allSpecialities = ["All", ...new Set(doctors.map(doc => doc.speciality).filter(Boolean))];
      setSpecialities(allSpecialities);
      setSelectedSpeciality("All");
    }
  };

  const fetchDoctorSchedule = async (doctorId) => {
    try {
      const token = localStorage.getItem('catms_token');
      console.log('🔍 Fetching schedule for doctor:', doctorId);
      
      const response = await axios.get(`http://localhost:3000/api/doctor-schedule/by-doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Doctor schedule response:', response.data);
      console.log('✅ Number of schedules:', response.data.length);
      
      // Log each schedule in detail
      response.data.forEach((schedule, index) => {
        console.log(`Schedule ${index + 1}:`, {
          schedule_id: schedule.schedule_id,
          schedule_date: schedule.schedule_date,
          doctor_id: schedule.staff_id || schedule.doctor_id,
          start_time: schedule.start_time,
          end_time: schedule.end_time
        });
      });
      
      // Extract unique dates from the schedule
      const dates = [...new Set(response.data.map(schedule => {
        // Parse the date string
        let dateStr = schedule.schedule_date || schedule.date;
        console.log('Processing date:', dateStr);
        
        // Handle different date formats
        if (dateStr.includes('/')) {
          // Convert MM/DD/YYYY to YYYY-MM-DD
          const [month, day, year] = dateStr.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateStr;
      }))];
      
      console.log('📅 Extracted dates:', dates);
      
      // Sort dates
      dates.sort();
      
      // Filter out past dates
      const today = new Date().toISOString().slice(0, 10);
      const futureDates = dates.filter(date => {
        const isValid = date >= today;
        console.log(`Date ${date} is ${isValid ? 'valid' : 'invalid'} (today is ${today})`);
        return isValid;
      });
      
      console.log('📅 Available future dates:', futureDates);
      
      setAvailableDates(futureDates);
    } catch (err) {
      console.error('❌ Error fetching doctor schedule:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setBanner({ type: 'error', message: 'Failed to fetch doctor\'s schedule' });
      setAvailableDates([]);
    }
  };

  const handleDoctorSelect = (doctor) => {
    console.log('🔍 Doctor selected:', doctor);
    setSelectedDoctor(doctor);
    setDoctorSearchTerm(doctor.name);
    setForm((prev) => ({ ...prev, doctorId: doctor.staff_id, date: '' })); // Reset date when doctor changes
    setShowDoctorDropdown(false);
    console.log('🔍 Fetching schedule for doctor ID:', doctor.staff_id);
    fetchDoctorSchedule(doctor.staff_id); // Fetch doctor's schedule
  };

  const handleDoctorSearchChange = (e) => {
    setDoctorSearchTerm(e.target.value);
    setShowDoctorDropdown(true);
    if (!e.target.value) {
      setSelectedDoctor(null);
      setForm((prev) => ({ ...prev, doctorId: "", date: "" }));
      setAvailableDates([]); // Reset available dates when doctor is unselected
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(branchSearchTerm.toLowerCase())
  );

  // Filter doctors by selected branch and speciality
  const filteredDoctors = doctors.filter(doctor => {
    // First filter by branch if one is selected
    if (form.branchId && doctor.branch_id !== form.branchId) {
      return false;
    }
    // Then filter by speciality if not "All"
    if (selectedSpeciality !== "All" && doctor.speciality !== selectedSpeciality) {
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
    setAvailableDates([]); // Reset available dates
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log('🔍 Submit started, user:', user);
    console.log('🔍 Current form state:', form);

    if (!user || !user.id) {
      setBanner({ type: "error", message: "You must be logged in to book an appointment." });
      return;
    }

    if (!form.doctorId || !form.date || !form.branchId) {
      setBanner({ type: "warning", message: "Please fill in all required fields before saving." });
      console.log('❌ Validation failed:', {
        doctorId: form.doctorId,
        date: form.date,
        branchId: form.branchId
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('catms_token');
      console.log('🔍 Token exists:', !!token);
      
      // Calculate appointment times based on duration
      console.log('🔍 Getting available time slot for doctor:', form.doctorId, 'date:', form.date);
      const slotInfo = await getAvailableTimeSlot(form.doctorId, form.date);
      
      if (!slotInfo) {
        setBanner({ type: "error", message: "No available time slots for selected date" });
        setLoading(false);
        return;
      }

      console.log('✅ Got slot info:', slotInfo);

      // Generate appointment ID
      const appointmentId = `A${Date.now().toString().slice(-4)}`;

      // Convert date to YYYY-MM-DD format
      const appointmentDate = typeof form.date === 'string' && form.date.includes('T')
        ? form.date.split('T')[0]
        : form.date;

      const appointmentData = {
        appointment_id: appointmentId,
        patient_id: user.id,
        schedule_id: slotInfo.schedule_id,
        status: 'Scheduled',
        appointment_date: appointmentDate,
        notes: form.notes || null,
        appointment_fee: 300.00
      };

      console.log('📝 Creating appointment with data:', appointmentData);

      const response = await axios.post('http://localhost:3000/api/appointment', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Appointment created successfully:', response.data);

      const doctor = doctors.find((doc) => doc.staff_id === form.doctorId);
      
      // Refresh the appointments list
      fetchAppointments();
      
      resetForm();
      setBanner({
        type: "success",
        message: `Appointment with ${doctor?.name || "doctor"} scheduled successfully for ${new Date(form.date).toLocaleDateString()}!`,
      });
    } catch (err) {
      console.error('❌ Error creating appointment:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setBanner({
        type: "warning",
        message: err.response?.data?.error || err.response?.data?.details || "Failed to create appointment. Please try again.",
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
            {user && (
              <div className="form__row" style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RxPerson style={{ fontSize: '1.5rem', color: '#0284c7' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: '500', color: '#0c4a6e' }}>Booking for:</p>
                    <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#0369a1' }}>{user.username}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="form__row">
              <label htmlFor="branch" className="form__label">
                Select Branch <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <SearchableBranchDropdown
                value={branchSearchTerm}
                onChange={setBranchSearchTerm}
                onSelect={(branch) => {
                  setSelectedBranch(branch);
                  setBranchSearchTerm(branch.name);
                  setForm(prev => ({ ...prev, branchId: branch.branch_id }));
                  setDoctorSearchTerm("");
                  setSelectedDoctor(null);
                }}
                loading={loadingBranches}
                branches={branches}
                showDropdown={showBranchDropdown}
                setShowDropdown={setShowBranchDropdown}
              />
            </div>

            <div className="form__row">
              <label htmlFor="speciality" className="form__label">
                Doctor Speciality
              </label>
              <div className="form__field">
                <select
                  id="speciality"
                  value={selectedSpeciality}
                  onChange={(e) => {
                    setSelectedSpeciality(e.target.value);
                    // Clear doctor selection when speciality changes
                    setDoctorSearchTerm("");
                    setSelectedDoctor(null);
                    setForm(prev => ({ ...prev, doctorId: "" }));
                  }}
                  className="form__select"
                >
                  {specialities.map(speciality => (
                    <option key={speciality} value={speciality}>
                      {speciality}
                    </option>
                  ))}
                </select>
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
                  <select
                    id="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange("date")}
                    required
                    disabled={!selectedDoctor}
                    className="form__select"
                  >
                    <option value="">Select a date</option>
                    {availableDates.map(date => {
                      const dateObj = date.includes('/') 
                        ? new Date(date.split('/')[2], parseInt(date.split('/')[0]) - 1, date.split('/')[1])
                        : new Date(date);
                      return (
                        <option key={date} value={date}>
                          {dateObj.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="form__row">
              <label htmlFor="notes" className="form__label">
                Notes (Optional)
              </label>
              <div className="form__field">
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes || ""}
                  onChange={handleChange("notes")}
                  placeholder="Add any additional notes or special requirements..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
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

          <div className="card upcoming-card">
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
          </div>
        </section>

        <section className="side-panel">
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
