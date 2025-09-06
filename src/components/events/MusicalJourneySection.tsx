
import React from 'react';

const MusicalJourneySection = () => {
  return <div id="musical-journey" className="bg-white rounded-xl p-8 shadow-lg -mt-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center">
          <div className="mb-2">
            <div className="text-xl sm:text-2xl">Join the</div>
            <div className="font-dancing text-brunch-pink text-2xl sm:text-3xl">Brunch Singalong</div>
            <div className="text-xl sm:text-2xl">Movement</div>
          </div>
          <div className="md:block hidden">
            <h3 className="text-xl sm:text-2xl">
              <span className="font-dancing text-brunch-pink text-3xl sm:text-4xl">Free</span> inflatable microphone<br />
              for <span className="font-dancing text-brunch-pink text-3xl sm:text-4xl">all</span> guests
            </h3>
          </div>
        </div>
        <div className="relative">
          <img 
            alt="Singalong Brunch Experience" 
            className="rounded-lg w-full h-auto" 
            onError={e => {
              e.currentTarget.src = "/placeholder.svg";
              console.log("Image failed to load, using placeholder");
            }} 
            src="/lovable-uploads/e07dd65a-80bb-480e-857a-d0dde18e7d77.png" 
            loading="lazy"
            decoding="async"
            width="600" 
            height="400"
          />
          <div className="text-center mt-4 md:hidden">
            <h3 className="text-xl sm:text-2xl">
              <span className="font-dancing text-brunch-pink text-3xl sm:text-4xl">Free</span> inflatable microphone<br />
              for <span className="font-dancing text-brunch-pink text-3xl sm:text-4xl">all</span> guests
            </h3>
          </div>
        </div>
      </div>
    </div>;
};

export default MusicalJourneySection;
