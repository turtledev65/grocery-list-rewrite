import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src="logo.svg"
        width={128}
        height={128}
        alt="logo"
        className="w-72 motion-safe:animate-float"
      />
      <div className="absolute bottom-0 w-full pb-6">
        <h1 className="text-center text-4xl font-bold">
          Grocery List
          <span className="ml-2 text-base text-gray-400">2.0</span>
        </h1>
      </div>
    </div>
  );
};

export default AboutPage;
