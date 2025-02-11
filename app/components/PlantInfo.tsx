import Image from "next/image";

interface PlantInfoProps {
  info: {
    "Common Name": string;
    "Scientific Name": string;
    "Brief Description": string;
    Origin: string;
    "Growth Habit": string;
    "Sunlight Requirements": string;
    "Water Requirements": string;
  };
  imageUrl: string;
}

export default function PlantInfo({ info, imageUrl }: PlantInfoProps) {
  return (
    <div className='bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full'>
      <h2 className='text-3xl font-semibold mb-6 text-green-800'>
        {info["Common Name"]}
      </h2>
      <div className='flex flex-col md:flex-row gap-8'>
        <div className='md:w-1/2'>
          <Image
            src={imageUrl}
            alt={info["Common Name"]}
            width={400}
            height={400}
            className='rounded-lg shadow-md object-cover w-full h-auto'
          />
        </div>
        <div className='md:w-1/2'>
          <h3 className='text-xl font-semibold mb-2 text-green-700'>
            Scientific Name
          </h3>
          <p className='text-gray-700 mb-4 italic'>{info["Scientific Name"]}</p>
          <h3 className='text-xl font-semibold mb-2 text-green-700'>
            Description
          </h3>
          <p className='text-gray-700 mb-4'>{info["Brief Description"]}</p>
          <table className='w-full border-collapse'>
            <tbody>
              {[
                "Origin",
                "Growth Habit",
                "Sunlight Requirements",
                "Water Requirements",
              ].map((key) => (
                <tr key={key} className='border-b border-gray-200'>
                  <td className='py-2 pr-4 font-semibold text-green-600'>
                    {key}
                  </td>
                  <td className='py-2'>{info[key as keyof typeof info]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
