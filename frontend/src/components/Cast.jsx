import avatar from "../assets/avatar.png";
function Cast({ cast }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">🎭 Cast</h2>
      <div className="flex overflow-x-auto gap-6 scrollbar-hide">
        {cast.length > 0 ? (
          cast.map((actor) => (
            <div
              key={actor.id}
              className="text-center flex flex-col flex-shrink-0"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : avatar
                }
                alt={actor.name}
                className="rounded-full w-24 h-24 shadow-md transition-transform duration-300 hover:scale-105"
              />
              <p className="text-sm mt-2">{actor.name}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No cast information available</p>
        )}
      </div>
    </div>
  );
}

export default Cast;
