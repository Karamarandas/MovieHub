function AdditionalInfo({ movie }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 bg-base-200 p-4 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold">Release Date</h3>
        <p>{movie.release_date}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Runtime</h3>
        <p>{movie.runtime} minutes</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Genres</h3>
        <p>{movie.genres?.map((genre) => genre.name).join(", ") || "N/A"}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Budget</h3>
        <p>${movie.budget?.toLocaleString() || "N/A"}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Revenue</h3>
        <p>${movie.revenue?.toLocaleString() || "N/A"}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Status</h3>
        <p>{movie.status || "N/A"}</p>
      </div>
    </div>
  );
}

export default AdditionalInfo;
