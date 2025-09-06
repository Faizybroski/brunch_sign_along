
import React from 'react';
import Performers from './about/Performers';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const About = () => {
  return <section id="about" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">About <span className="font-dancing text-brunch-pink">Brunch Singalong</span></h2>
        <div className="w-20 h-1 bg-brunch-pink mx-auto mb-8"></div>
      </div>
      
      <div>
        <div className="mb-12 flex justify-center">
          <img 
            alt="Singalong Brunch Experience" 
            className="rounded-lg shadow-lg w-full md:w-1/3 lg:w-2/5 h-auto transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" 
            onError={e => {
              e.currentTarget.src = "/placeholder.svg";
              console.log("About image failed to load, using placeholder");
            }} 
            src="/lovable-uploads/8b616d82-a332-4539-9d50-b6abb5783208.png" 
          />
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="performers" className="border-none">
            <AccordionTrigger 
              className="text-lg font-bold text-center w-full flex justify-center group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-brunch-purple/10 hover:text-brunch-purple"
            >
              Meet the Performers
              <span className="text-brunch-pink group-hover:text-brunch-purple transition-colors duration-300">
                ✨
              </span>
            </AccordionTrigger>
            <AccordionContent className="mt-2">
              <Performers />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </section>;
};

export default About;
