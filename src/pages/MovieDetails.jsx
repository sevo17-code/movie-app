import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CastCarousel from "../components/CastCarousel";
import MovieRow from "../components/MovieRow";
import PageTransition from "../components/PageTransition";
import RatingCounter from "../components/RatingCounter";
import TrailerModal from "../components/TrailerModal";
import TVSeasonEpisodes from "../components/TVSeasonEpisodes";
import { useWatchlist } from "../context/WatchlistContext";
import {
  BACKDROP_URL,
  IMG_URL,
  getMovieDetails,
  getExternalIds,
  getImdbRating,
  getTVDetails,
  getTVSeason,
  getTranslations,
} from "../services/api";
import "./MovieDetails.css";

const fallbackPoster = "https://via.placeholder.com/400x600?text=No+Poster";

function MovieDetails({ type = "movie" }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [openTrailer, setOpenTrailer] = useState(false);
  const [pickedSeasonNumber, setPickedSeasonNumber] = useState(null);

  const { data: media, isLoading, error } = useQuery({
    queryKey: [type, id],
    queryFn: () => (type === "tv" ? getTVDetails(id) : getMovieDetails(id)),
    enabled: Boolean(id),
  });

  const selectedSeasonNumber = useMemo(() => {
    if (type !== "tv" || !media?.seasons?.length) return null;
    const pickedStillExists = media.seasons.some((x) => x.season_number === pickedSeasonNumber);
    if (pickedStillExists) return pickedSeasonNumber;
    const first = media.seasons.find((x) => x.season_number > 0) ?? media.seasons[0];
    return first?.season_number ?? null;
  }, [media, pickedSeasonNumber, type]);

  const { data: seasonData, isLoading: seasonLoading, error: seasonError } = useQuery({
    queryKey: ["tv-season", id, selectedSeasonNumber],
    queryFn: () => getTVSeason(id, selectedSeasonNumber),
    enabled: type === "tv" && Boolean(selectedSeasonNumber),
  });

  const { data: translationsData } = useQuery({
    queryKey: ["translations", type, id],
    queryFn: () => getTranslations(type, id),
    enabled: Boolean(id),
  });

  const { data: externalIds } = useQuery({
    queryKey: ["external-ids", type, id],
    queryFn: () => getExternalIds(type, id),
    enabled: Boolean(media && id),
  });

  const { data: imdbRating, isFetching: isFetchingImdb } = useQuery({
    queryKey: ["imdb-rating", externalIds?.imdb_id],
    queryFn: () => getImdbRating(externalIds.imdb_id),
    enabled: Boolean(externalIds?.imdb_id),
  });

  const availableTranslations = useMemo(() => {
    const rows = translationsData?.translations ?? [];
    const names = rows.map((x) => x.english_name || x.name || x.iso_639_1).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [translationsData]);

  const trailer = useMemo(
    () =>
      media?.videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer"),
    [media]
  );

  const similarItems =
    media?.similar?.results?.slice(0, 14).map((item) => ({ ...item, media_type: type })) ?? [];
  const mediaTitle = media?.title ?? media?.name ?? "Title Unavailable";
  const mediaYear = (media?.release_date ?? media?.first_air_date)?.slice(0, 4) || "TBA";
  const runtimeLabel =
    type === "tv" ? `${media?.number_of_seasons ?? "?"} seasons` : `${media?.runtime || "?"} min`;
  const saved = media ? isInWatchlist(media) : false;

  if (isLoading) {
    return (
      <PageTransition>
        <div className="details-loading">
          <div className="skeleton details-loading__hero" />
          <div className="skeleton details-loading__content" />
        </div>
      </PageTransition>
    );
  }

  if (error || !media) {
    return (
      <PageTransition>
        <div className="error-state">{t("load_error")}</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <article className="details-page">
        <Helmet>
          <title>CineScope - {mediaTitle}</title>
          <meta name="description" content={media.overview || `Discover ${mediaTitle}.`} />
        </Helmet>

        <header
          className="details-hero"
          style={{
            backgroundImage: media.backdrop_path ? `url(${BACKDROP_URL}${media.backdrop_path})` : "none",
          }}
        >
          <div className="details-overlay" />
        </header>

        <div className="details-content">
          <img
            className="details-poster"
            src={media.poster_path ? `${IMG_URL}${media.poster_path}` : fallbackPoster}
            alt={mediaTitle}
            loading="lazy"
          />

          <div className="details-info">
            <h1>{mediaTitle}</h1>

            <div className="rating-panel">
              <div>
                <span className="rating-panel__label">{t("rating")}</span>
                <strong>
                  <RatingCounter value={media.vote_average ?? 0} />
                </strong>
              </div>
              <div className="rating-panel__imdb">
                <span className="rating-panel__label">{t("imdb_rating")}</span>
                {imdbRating?.imdbRating && imdbRating.imdbRating !== "N/A" ? (
                  <a href={imdbRating.imdbUrl} target="_blank" rel="noreferrer">
                    {imdbRating.imdbRating}
                    {imdbRating.imdbVotes ? <small>{imdbRating.imdbVotes}</small> : null}
                  </a>
                ) : (
                  <strong>{isFetchingImdb ? t("loading") : t("not_available")}</strong>
                )}
              </div>
            </div>

            <div className="details-meta">
              <span>
                <strong>{t("year")}:</strong> {mediaYear}
              </span>
              <span>
                <strong>{type === "tv" ? `${t("length")}:` : `${t("runtime")}:`}</strong> {runtimeLabel}
              </span>
            </div>

            <div className="genres">
              {media.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="overview">{media.overview}</p>

            <div className="details-actions">
              <button onClick={() => trailer && setOpenTrailer(true)} disabled={!trailer}>
                {trailer ? t("btn_watch_trailer") : t("btn_trailer_unavailable")}
              </button>
              <button className="secondary" onClick={() => toggleWatchlist(media)}>
                {saved ? t("btn_remove_watchlist") : t("btn_add_watchlist")}
              </button>
            </div>

            <section className="details-section">
              <h2 className="section-title">{t("details_cast")}</h2>
              <CastCarousel cast={media.credits?.cast ?? []} />
            </section>

            {type === "tv" && media.seasons?.length ? (
              <section className="details-section">
                <h2 className="section-title">{t("details_seasons")}</h2>
                <div className="season-tabs">
                  {media.seasons.map((season) => (
                    <button
                      key={season.id ?? season.season_number}
                      className={selectedSeasonNumber === season.season_number ? "active" : ""}
                      onClick={() => setPickedSeasonNumber(season.season_number)}
                      type="button"
                    >
                      {season.name}
                    </button>
                  ))}
                </div>
                <TVSeasonEpisodes season={seasonData} loading={seasonLoading} error={seasonError} />
              </section>
            ) : null}

            <section className="details-section">
              <h2 className="section-title">{t("details_translations")}</h2>
              {availableTranslations.length ? (
                <div className="season-tabs">
                  {availableTranslations.map((lang) => (
                    <button key={lang} type="button" disabled>
                      {lang}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state">{t("details_no_translations")}</div>
              )}
            </section>
          </div>
        </div>

        <MovieRow
          title={type === "tv" ? t("details_similar_series") : t("details_similar_movies")}
          subtitle={type === "tv" ? "More shows with a close vibe." : "Because you liked this vibe."}
          movies={similarItems}
        />

        <TrailerModal
          open={openTrailer}
          youtubeKey={trailer?.key}
          title={mediaTitle}
          onClose={() => setOpenTrailer(false)}
        />
      </article>
    </PageTransition>
  );
}

export default MovieDetails;
