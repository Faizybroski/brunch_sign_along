import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Performers = () => {
  return (
    <div className="mt-12">
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-48 h-48 mb-6">
                <AvatarImage src="/lovable-uploads/7bf14ff6-91c5-4565-810e-015930feefee.png" alt="Bobepin" />
                <AvatarFallback>BD</AvatarFallback>
              </Avatar>
              <h4 className="text-xl font-bold mb-2">Bobépine</h4>
              <p className="text-brunch-purple font-semibold mb-4">as Céline Dion</p>
              <p className="text-gray-600 text-center mb-2">
                Bobépine was born to embody the legend herself, capturing every soaring note, 
                heartfelt moment, and fierce diva energy of Céline Dion.
              </p>
              <p className="text-gray-600 text-center">
                From the first song to the final encore, Bobépine doesn't just perform Céline — she becomes her. 🎤✨
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-48 h-48 mb-6">
                <AvatarImage src="/lovable-uploads/e128edff-223d-4d3f-a15d-820b288963c8.png" alt="Ruby Doll" />
                <AvatarFallback>RD</AvatarFallback>
              </Avatar>
              <h4 className="text-xl font-bold mb-2">The Ruby Doll</h4>
              <p className="text-brunch-purple font-semibold mb-4">as Mariah Carey</p>
              <p className="text-gray-600 text-center mb-2">
                Ruby Doll, Montreal's #1 diva, channels Mariah Carey with stunning vocals, 
                iconic looks, and all the glittering glamour you can handle.
              </p>
              <p className="text-gray-600 text-center">
                From the high notes to the hair flips, she captures the spirit of Mariah 
                like no one else. Get ready for a show so good, you'll believe it's the real thing! 🎤✨
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Performers;
