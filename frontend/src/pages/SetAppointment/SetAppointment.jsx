import { useMemo, useState } from "react";
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
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  duration: "30",
  visitType: "Consultation",
  sendReminder: true,
  notes: "",
};

export default function SetAppointment() {
  const [form, setForm] = useState(initialFormState);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [banner, setBanner] = useState(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.patientName || !form.patientId || !form.doctorId || !form.date || !form.time) {
      setBanner({ type: "warning", message: "Please fill in patient, doctor, date and time before saving." });
      return;
    }

    const doctor = DOCTORS.find((doc) => doc.id === form.doctorId);

    const newAppointment = {
      id: `APT-${Date.now().toString().slice(-5)}`,
      patientName: form.patientName.trim(),
      patientId: form.patientId.trim(),
      doctorId: form.doctorId,
      doctorName: doctor?.name || "Assigned doctor",
      date: form.date,
      time: form.time,
      duration: Number(form.duration) || 30,
      visitType: form.visitType,
      status: "Pending",
      sendReminder: form.sendReminder,
      notes: form.notes.trim(),
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    resetForm();
    setBanner({
      type: "success",
      message: `Appointment for ${newAppointment.patientName} scheduled with ${newAppointment.doctorName}.`,
    });
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
              <label htmlFor="patientId" className="form__label">
                Patient ID
              </label>
              <input
                id="patientId"
                name="patientId"
                type="text"
                placeholder="e.g. PT-1204"
                value={form.patientId}
                onChange={handleChange("patientId")}
                required
              />
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
                  {DOCTORS.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} · {doctor.specialization}
                    </option>
                  ))}
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
                <label htmlFor="time" className="form__label">
                  Start Time
                </label>
                <div className="form__field">
                  <span className="form__icon" aria-hidden>
                    <RxClock />
                  </span>
                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange("time")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form__split">
              <div className="form__row">
                <label htmlFor="duration" className="form__label">
                  Duration (minutes)
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange("duration")}
                >
                  {[15, 30, 45, 60].map((option) => (
                    <option key={option} value={option}>
                      {option} minutes
                    </option>
                  ))}
                </select>
              </div>

              <div className="form__row">
                <label htmlFor="visitType" className="form__label">
                  Visit Type
                </label>
                <select
                  id="visitType"
                  name="visitType"
                  value={form.visitType}
                  onChange={handleChange("visitType")}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Screening">Screening</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="form__row form__row--notes">
              <label htmlFor="notes" className="form__label">
                Notes for reception / nurse
              </label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Any preparation instructions or additional context..."
                value={form.notes}
                onChange={handleChange("notes")}
                rows={3}
              />
            </div>

            <div className="form__row form__row--inline">
              <label className="form__label form__label--checkbox">
                <input
                  type="checkbox"
                  name="sendReminder"
                  checked={form.sendReminder}
                  onChange={handleChange("sendReminder")}
                />
                Send reminder SMS 24 hours before
              </label>
            </div>

            <div className="form__actions">
              <button type="button" className="btn btn--ghost" onClick={resetForm}>
                Clear form
              </button>
              <button type="submit" className="btn btn--primary">
                Save appointment
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
