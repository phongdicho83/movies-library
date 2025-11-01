import { Link } from "react-router-dom";
import { img } from "../utils/tmdb";
import "./PersonCard.css";

export default function PersonCard({ person }) {
  const knownFor =
    person.known_for?.map((item) => item.title || item.name).join(", ") || "";

  return (
    <Link to={`/person/${person.id}`} className="person-card flex-item">
      {person.profile_path ? (
        <img
          src={img(person.profile_path, "w342")}
          alt={person.name}
          loading="lazy"
        />
      ) : (
        <div className="placeholder" />
      )}
      <div className="person-card-body">
        <h3>{person.name}</h3>
        {knownFor && <p className="muted known-for">{knownFor}</p>}
      </div>
    </Link>
  );
}
