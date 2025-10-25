import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { tmdb } from "../utils/tmdb";
import MovieCard from "../components/MovieCard";
import TvShowCard from "../components/TvShowCard";
import PersonCard from "../components/PersonCard";
import LoadMore from "../components/LoadMore";

// Bản đồ cấu hình giúp ánh xạ từ URL (type/category) sang endpoint TMDB và tiêu đề hiển thị
const config = {
  movies: {
    popular: { path: "movie/popular", title: "Popular Movies" },
    upcoming: { path: "movie/upcoming", title: "Upcoming Movies" },
    "top-rated": { path: "movie/top_rated", title: "Top Rated Movies" },
  },
  tvshows: {
    popular: { path: "tv/popular", title: "Popular TV Shows" },
    "on-tv": { path: "tv/on_the_air", title: "Currently Airing TV Shows" },
    "top-rated": { path: "tv/top_rated", title: "Top Rated TV Shows" },
  },
  person: {
    popular: { path: "person/popular", title: "Popular People" },
  },
};

export default function ListPage(props) {
  const params = useParams();
  // Ưu tiên nhận "type" và "category" từ props (khi định tuyến cụ thể), nếu không sẽ lấy từ URL params
  const type = props.type || params.type;
  const category = props.category || params.category;

  // Trả về sớm khi chưa xác định được type/category (tránh render thừa vòng)
  if (!type || !category) {
    return <div>Loading...</div>;
  }
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const current = config[type]?.[category];

  useEffect(() => {
    // Khi type/category đổi: reset danh sách, trang và lỗi để tải lại từ đầu
    if (!current) {
      return;
    }
    setItems([]);
    setPage(1);
    setError(null);
  }, [current, type, category]);

  useEffect(() => {
    if (!current) return;
    // Vòng đời tải dữ liệu: gọi TMDB với endpoint trong config, hỗ trợ phân trang
    let ignore = false;
    async function load() {
      if (page === 1) setLoading(true);
      try {
        const data = await tmdb(current.path, { page });
        if (!ignore) {
          let newItems = data.results || [];
          // Nếu là danh sách người (person), lọc những người không có ảnh đại diện
          if (type === "person") {
            newItems = newItems.filter((person) => !!person.profile_path);
          }
          setItems((prevItems) => [...prevItems, ...newItems]);
        }
      } catch (e) {
        if (!ignore) setError(e.message || "Failed to load");
      } finally {
        if (!ignore && page === 1) setLoading(false);
      }
    }
    load();
    return () => {
      // Hủy cập nhật state nếu component unmount hoặc deps thay đổi trong lúc request đang chạy
      ignore = true;
    };
  }, [current, page]);

  function handleLoadMore() {
    // Xử lý nút "Load more": tăng trang để tải thêm kết quả và nối vào danh sách hiện tại
    setPage((prevPage) => prevPage + 1);
  }
  if (!current) {
    return (
      <p className="error">
        Sorry, this page doesn't exist or is not configured.
      </p>
    );
  }

  // Chỉ hiển thị Loading khi đang tải trang đầu tiên
  if (page === 1 && loading) return <p>Loading {current.title}...</p>;

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  // Chọn component thẻ hiển thị theo loại dữ liệu (movie/tv/person)
  const renderCard = (item) => {
    switch (type) {
      case "movies":
        return <MovieCard key={item.id} movie={item} />;
      case "tvshows":
        return <TvShowCard key={item.id} show={item} />;
      case "person":
        return <PersonCard key={item.id} person={item} />;
      default:
        return null;
    }
  };

  return (
    <section>
      {/* Tiêu đề danh sách lấy từ config tương ứng */}
      <h1>{current.title}</h1>
      <div className="item-grid">
        {/* Hiển thị danh sách thẻ, hoặc thông báo khi không có kết quả */}
        {items.length > 0
          ? items.map(renderCard)
          : !loading && <p>No items found.</p>}
      </div>
      {/* Nút tải thêm chỉ hiện khi đã có ít nhất một kết quả */}
      <LoadMore show={items.length > 0} onLoadMore={handleLoadMore} />
    </section>
  );
}
