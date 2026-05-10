import { useTranslation } from "react-i18next";
import PageTransition from "../components/PageTransition";
import RatingCounter from "../components/RatingCounter";
import { useCompare } from "../context/CompareContext";
import "./Compare.css";

function Compare() {
  const { t } = useTranslation();
  const { items, clear, remove } = useCompare();
  const bestRating = Math.max(...items.map((item) => item.vote_average ?? 0));
  const bestPopularity = Math.max(...items.map((item) => item.popularity ?? 0));
  const bestVoteCount = Math.max(...items.map((item) => item.vote_count ?? 0));

  return (
    <PageTransition>
      <section className="compare-page">
        <header className="compare-page__head">
          <h1 className="section-title">{t("compare_title")}</h1>
          <p className="section-subtitle">{t("compare_max_hint")}</p>
          {items.length > 0 ? (
            <button type="button" className="clear-btn" onClick={clear}>
              {t("btn_clear")}
            </button>
          ) : null}
        </header>

        {items.length === 0 ? (
          <div className="empty-state">{t("compare_empty")}</div>
        ) : (
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>{t("title")}</th>
                  {items.map((item) => (
                    <th key={`${item.media_type}-${item.id}`}>{item.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t("rating")}</td>
                  {items.map((item) => {
                    const isBestRating = (item.vote_average ?? 0) === bestRating && bestRating > 0;
                    return (
                    <td
                      key={`rating-${item.media_type}-${item.id}`}
                      className={isBestRating ? "compare-best" : ""}
                    >
                      <RatingCounter value={item.vote_average ?? 0} />
                    </td>
                    );
                  })}
                </tr>
                <tr>
                  <td>{t("vote_count")}</td>
                  {items.map((item) => {
                    const isBestVoteCount = (item.vote_count ?? 0) === bestVoteCount && bestVoteCount > 0;
                    return (
                    <td
                      key={`votes-${item.media_type}-${item.id}`}
                      className={isBestVoteCount ? "compare-best" : ""}
                    >
                      {(item.vote_count ?? 0).toLocaleString()}
                    </td>
                    );
                  })}
                </tr>
                <tr>
                  <td>{t("popularity")}</td>
                  {items.map((item) => {
                    const isBestPopularity = (item.popularity ?? 0) === bestPopularity && bestPopularity > 0;
                    return (
                    <td
                      key={`popularity-${item.media_type}-${item.id}`}
                      className={isBestPopularity ? "compare-best" : ""}
                    >
                      {(item.popularity ?? 0).toFixed(1)}
                    </td>
                    );
                  })}
                </tr>
                <tr>
                  <td>{t("year")}</td>
                  {items.map((item) => (
                    <td key={`year-${item.media_type}-${item.id}`}>
                      {(item.release_date ?? item.first_air_date ?? "").slice(0, 4) || t("tba")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>{t("language")}</td>
                  {items.map((item) => (
                    <td key={`lang-${item.media_type}-${item.id}`}>
                      {(item.original_language ?? "").toUpperCase() || t("not_available")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>{t("overview")}</td>
                  {items.map((item) => (
                    <td key={`overview-${item.media_type}-${item.id}`}>
                      {item.overview || t("not_available")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>{t("action")}</td>
                  {items.map((item) => (
                    <td key={`action-${item.media_type}-${item.id}`}>
                      <button type="button" onClick={() => remove(item)}>
                        {t("btn_remove")}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageTransition>
  );
}

export default Compare;
