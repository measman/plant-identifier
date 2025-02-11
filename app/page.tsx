"use client";

import { useState, useMemo } from "react";
import ImageUpload from "./components/ImageUpload";
import PlantInfo from "./components/PlantInfo";
import {
  FaUpload,
  FaLeaf,
  FaInfoCircle,
  FaSeedling,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface PlantData {
  "Common Name": string;
  "Scientific Name": string;
  "Brief Description": string;
  Origin: string;
  "Growth Habit": string;
  "Sunlight Requirements": string;
  "Water Requirements": string;
}

interface HowToUseCard {
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<PlantData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>("");

  const howToUseCards = useMemo<HowToUseCard[]>(
    () => [
      {
        icon: <FaUpload className='text-4xl mb-4 text-green-600' />,
        title: "Upload Image",
        description:
          "Take a clear photo of the plant you want to identify and upload it to our app.",
      },
      {
        icon: <FaLeaf className='text-4xl mb-4 text-green-600' />,
        title: "AI Analysis",
        description:
          "Our advanced AI analyzes the image to identify the plant species.",
      },
      {
        icon: <FaInfoCircle className='text-4xl mb-4 text-green-600' />,
        title: "Get Information",
        description:
          "Receive detailed information about the plant, including its name and characteristics.",
      },
      {
        icon: <FaSeedling className='text-4xl mb-4 text-green-600' />,
        title: "Learn More",
        description:
          "Discover care tips, growing conditions, and interesting facts about the identified plant.",
      },
    ],
    []
  );

  const handleReset = () => {
    setPlantInfo(null);
    setImageUrl("");
  };

  const InfoCard = ({ icon, title, description }: HowToUseCard) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow'
    >
      {icon}
      <h3 className='text-xl font-semibold mb-2 text-green-800'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
    </motion.div>
  );

  return (
    <div className='bg-gradient-to-b from-green-100 to-green-300 min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-5xl font-bold mb-4 text-green-800 text-center'
        >
          Plant Identifier
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-xl text-green-700 mb-8 text-center max-w-2xl mx-auto'
        >
          Discover the wonders of nature! Upload an image or take a photo of a
          plant, and let our AI identify it for you.
        </motion.p>

        <div className='flex justify-center mb-12'>
          <ImageUpload setPlantInfo={setPlantInfo} setImageUrl={setImageUrl} />
        </div>

        <AnimatePresence>
          {plantInfo && imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='flex flex-col items-center mt-12'
            >
              <PlantInfo info={plantInfo} imageUrl={imageUrl} />
              <button
                onClick={handleReset}
                className='mt-4 flex items-center px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
              >
                <FaTrash className='mr-2' /> Clear Results
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {(!plantInfo || !imageUrl) && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-gray-600 mt-4 text-center'
          >
            Upload an image or take a photo to see plant information.
          </motion.p>
        )}

        <div className='mb-12'>
          <h2 className='text-3xl font-bold mb-4 text-green-800 text-center'>
            How It Works
          </h2>
          <p className='text-lg text-green-700 mb-8 text-center max-w-2xl mx-auto'>
            Our plant identification app is easy to use and provides valuable
            information about the plants you discover.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {howToUseCards.map((card, index) => (
              <InfoCard key={index} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
