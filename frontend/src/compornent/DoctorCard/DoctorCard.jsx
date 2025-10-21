import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGlobe,
  FiMapPin,
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
    location,
    services = [],
  } = doctor || {};


  const infoRows = useMemo(
    () => [
      {
        icon: <FiMapPin aria-hidden />,
        label: "Location",
        value: location || "Clinic information pending",
      },
    ],
    [location],
  );

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
           
          </div>

        </footer>
      </div>
    </article>
  );
}
