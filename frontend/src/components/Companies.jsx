import questionMark from "../assets/questionMark.png";
function Companies({ movie }) {
  return (
    <div>
      {movie.production_companies?.length > 0 && (
        <div className="mb-8 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">Production Companies</h3>
          <div className="flex flex-wrap gap-4">
            {movie.production_companies.map((company) => (
              <div
                key={company.id}
                className="gap-2 flex flex-col text-center justify-center items-center"
              >
                <img
                  src={
                    company.logo_path
                      ? `https://image.tmdb.org/t/p/w200${company.logo_path}`
                      : questionMark
                  }
                  alt={company.name}
                  className="w-24 h-24 object-contain"
                />
                <p>{company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Companies;
