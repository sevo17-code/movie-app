import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import MovieCard from "../components/MovieCard";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import { getRandomMovie, getRandomTV } from "../services/api";
import "./RandomMovie.css";

function RandomMovie() {
  const { t } = useTranslation();
  const [type, setType] = useState("movie");
  const [roll, setRoll] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["random", type, roll],
    queryFn: () => (type === "movie" ? getRandomMovie() : getRandomTV()),
  });

  return (
    <PageTransition>
      <section className="random-page">
        <Helmet>
          <title>CineScope - {t("random_title")}</title>
          <meta name="description" content={t("random_subtitle")} />
        </Helmet>

        <header className="random-header">
          <h1 className="section-title">{t("random_title")}</h1>
          <p className="section-subtitle">{t("random_subtitle")}</p>
        </header>

        <div className="random-controls">
          <button
            type="button"
            className={type === "movie" ? "active" : ""}
            onClick={() => setType("movie")}
          >
            {t("random_type_movie")}
          </button>
          <button
            type="button"
            className={type === "tv" ? "active" : ""}
            onClick={() => setType("tv")}
          >
            {t("random_type_tv")}
          </button>
        </div>

        {isError ? <div className="error-state">{t("load_error")}</div> : null}
        {isLoading ? <SkeletonGrid count={1} /> : null}

        {data ? (
          <div className="random-result">
            <MovieCard movie={data} />
            <button type="button" className="roll-btn" onClick={() => setRoll((r) => r + 1)}>
              🎲 {t("btn_roll_again")}
            </button>
          </div>
        ) : null}
      </section>
    </PageTransition>
  );
}

export default RandomMovie;
