import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiGlobe,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import "./doctor-card.css";

export default function DoctorCard({ doctor, onBook }) {
  const navigate = useNavigate();

  const {
    id,
    image,
    name,
    specialty,
    bio,
    rating = 0,
    reviews = 0,
    experience,
    languages = [],
    location,
    nextAvailable,
    consultationFee,
    patientsServed,
    services = [],
    acceptingNewPatients = false,
    url,
  } = doctor || {};

  const formattedLanguages = useMemo(
    () => (languages.length ? languages.join(", ") : "Not specified"),
    [languages],
  );

  const formattedPatients = useMemo(() => {
    if (!patientsServed && patientsServed !== 0) return "-";
    return Number(patientsServed).toLocaleString();
  }, [patientsServed]);

  const formattedRating = useMemo(() => {
    const value = Number(rating);
    if (Number.isNaN(value) || value <= 0) {
      return { display: "N/A", label: "No reviews yet" };
    }
    return {
      display: value.toFixed(1),
      label: `${reviews}+ reviews`,
    };
  }, [rating, reviews]);

  const infoRows = useMemo(
    () => [
      {
        icon: <FiClock aria-hidden />,
        label: "Experience",
        value: experience ? `${experience}+ years` : "Experience details pending",
      },
      {
        icon: <FiUsers aria-hidden />,
        label: "Patients",
        value: formattedPatients,
      },
      {
        icon: <FiMapPin aria-hidden />,
        label: "Location",
        value: location || "Clinic information pending",
      },
      {
        icon: <FiGlobe aria-hidden />,
        label: "Languages",
        value: formattedLanguages,
      },
      {
        icon: <FiCalendar aria-hidden />,
        label: "Next slot",
        value: nextAvailable || "Contact to schedule",
      },
      {
        icon: <FiDollarSign aria-hidden />,
        label: "Consultation",
        value: consultationFee || "Pricing to be confirmed",
      },
    ],
    [consultationFee, experience, formattedLanguages, formattedPatients, location, nextAvailable],
  );

  const handleBook = () => {
    if (typeof onBook === "function") {
      onBook(doctor);
      return;
    }
    if (url) {
      navigate(url);
    } else {
      navigate(`/appointmentsbook?doctor=${encodeURIComponent(id ?? "")}`);
    }
  };

  return (
    <article className="doctor-card" data-doctor-id={id}>
      <div className="doctor-card__media">
        <img
          src={image}
          alt={name}
          className="doctor-card__photo"
          loading="lazy"
        />
      </div>

      <div className="doctor-card__body">
        <header className="doctor-card__header">
          <div>
            <h3 className="doctor-card__name">{name}</h3>
            <p className="doctor-card__specialty">{specialty}</p>
            {bio && <p className="doctor-card__bio">{bio}</p>}
          </div>

          <div className="doctor-card__rating" aria-label={`Rating ${formattedRating.display}`}>
            <span className="doctor-card__star" aria-hidden>
              ★
            </span>
            <span className="doctor-card__rating-value">{formattedRating.display}</span>
            <span className="doctor-card__reviews">{formattedRating.label}</span>
          </div>
        </header>

        <dl className="doctor-card__info">
          {infoRows.map(({ icon, label, value }) => (
            <div key={label} className="doctor-card__info-row">
              <span className="doctor-card__info-icon">{icon}</span>
              <div>
                <dt className="doctor-card__label">{label}</dt>
                <dd className="doctor-card__value">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <footer className="doctor-card__footer">
          <div className="doctor-card__chips">
            {services.slice(0, 3).map((service) => (
              <span key={service} className="chip">
                {service}
              </span>
            ))}
            {acceptingNewPatients && (
              <span className="chip chip--success">Accepting new patients</span>
            )}
          </div>

          <button type="button" className="btn" onClick={handleBook}>
            Book appointment
          </button>
        </footer>
      </div>
    </article>
  );
}
