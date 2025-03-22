import questionMark from "../assets/questionMark.png";

function Trailer({ trailers }) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">🎬 Trailers</h2>
      <div className="flex overflow-x-auto gap-6">
        {trailers.length > 0 ? (
          trailers.map((trailer) => (
            <div
              key={trailer.key}
              className="relative w-50 cursor-pointer group"
              onClick={() =>
                window.open(
                  `https://www.youtube.com/watch?v=${trailer.key}`,
                  "_blank"
                )
              }
            >
              <img
                src={
                  trailer.key
                    ? `https://img.youtube.com/vi/${trailer.key}/0.jpg`
                    : questionMark
                }
                alt={trailer.name}
                className="rounded-lg shadow-2xl transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-bold">▶ Play</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No trailers available</p>
        )}
      </div>
    </div>
  );
}

export default Trailer;
