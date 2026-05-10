import { useTranslation } from "react-i18next";

function TVSeasonEpisodes({ season, loading, error }) {
  const { t } = useTranslation();

  if (loading) {
    return <div className="loading-state">{t("episodes_loading")}</div>;
  }

  if (error) {
    return <div className="error-state">{t("episodes_error")}</div>;
  }

  if (!season?.episodes?.length) {
    return <div className="empty-state">{t("episodes_empty")}</div>;
  }

  return (
    <div className="episodes-list">
      {season.episodes.map((episode) => (
        <article key={episode.id} className="episode-item">
          <h4>
            {t("episode_prefix")} {episode.episode_number}: {episode.name}
          </h4>
          <p>
            {t("rating")}: {episode.vote_average ? episode.vote_average.toFixed(1) : t("not_available")}
          </p>
        </article>
      ))}
    </div>
  );
}

export default TVSeasonEpisodes;
