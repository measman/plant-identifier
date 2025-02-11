"use client";

import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaUpload, FaCamera } from "react-icons/fa";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;

export default function ImageUpload({
  setPlantInfo,
  setImageUrl,
}: {
  setPlantInfo: React.Dispatch<React.SetStateAction<any>>;
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImage = async (file: File) => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      if (!API_KEY) {
        throw new Error("API key is not set");
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const imageData = await readFileAsBase64(file);
      setImageUrl(URL.createObjectURL(file));

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await model.generateContent([
        "Identify this plant and provide the following information: " +
          "Common Name, Scientific Name, Brief Description, Origin, Growth Habit, Sunlight Requirements, Water Requirements. " +
          "Format the response as a JSON object with these keys. Do not include any markdown formatting.",
        { inlineData: { data: imageData, mimeType: file.type } },
      ]);

      let plantInfo = result.response.text();
      console.log("AI Response:", plantInfo);

      plantInfo = plantInfo.replace(/```json|\```/g, "").trim();

      try {
        const parsedInfo = JSON.parse(plantInfo);
        setPlantInfo(parsedInfo);
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        setError("Error parsing AI response. Please try again.");
        setPlantInfo(null);
      }
    } catch (error: unknown) {
      console.error("Error identifying plant:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(`Error identifying plant: ${errorMessage}`);
      setPlantInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImage(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImage(file);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleButtonClick = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className='mb-8 flex flex-col items-center'>
      <div className='flex space-x-4 mb-4'>
        <button
          onClick={() => handleButtonClick(fileInputRef)}
          className='bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition-colors text-lg flex items-center'
          disabled={loading}
        >
          <FaUpload className='mr-2' /> Upload Image
        </button>
        <button
          onClick={() => handleButtonClick(cameraInputRef)}
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full cursor-pointer transition-colors text-lg flex items-center'
          disabled={loading}
        >
          <FaCamera className='mr-2' /> Take Photo
        </button>
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileUpload}
        className='hidden'
        disabled={loading}
      />
      <input
        ref={cameraInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleCameraCapture}
        className='hidden'
        disabled={loading}
      />
      {loading && <p className='text-gray-600'>Analyzing image...</p>}
      {error && <p className='text-red-500 mt-2'>{error}</p>}
    </div>
  );
}
