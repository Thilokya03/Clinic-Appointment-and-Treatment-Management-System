import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
  RxBell,
  RxCalendar,
  RxClock,
  RxPerson,
} from "react-icons/rx";
import { LuCircleCheck, LuClipboardList, LuTriangleAlert } from "react-icons/lu";
import "./setAppointment.css";

const DOCTORS = [
  { id: "DOC-001", name: "Dr. Amal Fernando", specialization: "Cardiology", nextAvailable: "10:30" },
  { id: "DOC-002", name: "Dr. Nirmala Jayasinghe", specialization: "Dermatology", nextAvailable: "11:15" },
  { id: "DOC-003", name: "Dr. Thisara Perera", specialization: "Neurology", nextAvailable: "13:00" },
  { id: "DOC-004", name: "Dr. Chanuka Wijesuriya", specialization: "Endocrinology", nextAvailable: "14:40" },
];

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
  const [doctors, setDoctors] = useState(DOCTORS);
  const [loading, setLoading] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('catms_token');
      const response = await axios.get('http://localhost:3000/api/staff/by-category/Doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setBanner({ type: 'error', message: 'Failed to fetch doctors' });
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

  const resetForm = () => {
    setForm((prev) => ({
      ...initialFormState,
      date: prev.date,
    }));
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

            <div className="form__row">
              <label htmlFor="doctor" className="form__label">
                Assign Doctor
              </label>
              <div className="form__field">
                <span className="form__icon" aria-hidden>
                  <LuClipboardList />
                </span>
                <select
                  id="doctor"
                  name="doctor"
                  value={form.doctorId}
                  onChange={handleChange("doctorId")}
                  required
                >
                  <option value="" disabled>
                    Select a doctor
                  </option>
                  {doctors.map((doctor) => (
                    <option key={doctor.staff_id} value={doctor.staff_id}>
                      {doctor.name} {doctor.speciality ? `· ${doctor.speciality}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form__row">
              <label htmlFor="branch" className="form__label">
                Branch
              </label>
              <div className="form__field">
                <span className="form__icon" aria-hidden>
                  <RxPerson />
                </span>
                <select
                  id="branch"
                  name="branch"
                  value={form.branchId}
                  onChange={handleChange("branchId")}
                  required
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  <option value="B0001">Main Branch - Colombo</option>
                  <option value="B0002">Kandy Branch</option>
                  <option value="B0003">Galle Branch</option>
                </select>
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
              {DOCTORS.map((doctor) => (
                <li key={doctor.id} className="availability-item">
                  <div>
                    <h4>{doctor.name}</h4>
                    <span>{doctor.specialization}</span>
                  </div>
                  <span className="availability-item__time">Next at {doctor.nextAvailable}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </section>
  );
}
