import "./LoadMore.css";

export default function LoadMore({ show, onLoadMore }) {
  if (!show) {
    return null;
  }

  return (
    <div className="load-more-container">
      <button onClick={onLoadMore} className="button">
        Load More
      </button>
    </div>
  );
}