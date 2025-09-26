// ShimmerCard.jsx
const ShimmerCard = () => {
  return (
    <div className="relative w-[420px] h-[72vh] rounded-2xl overflow-hidden shadow-2xl bg-base-300">
      {/* Main shimmer effect */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-base-200 to-base-300">
        <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-base-100/10 to-transparent" />
      </div>

      {/* Bottom content area */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="absolute bottom-6 left-6 right-6 space-y-4">
          {/* Name placeholder */}
          <div className="h-8 w-2/3 rounded-lg bg-base-100/20" />
          
          {/* Bio placeholder */}
          <div className="h-4 w-3/4 rounded-lg bg-base-100/20" />
          
          {/* Buttons placeholder */}
          <div className="flex justify-between pt-2">
            <div className="h-8 w-24 rounded-lg bg-base-100/20" />
            <div className="h-8 w-24 rounded-lg bg-base-100/20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerCard;