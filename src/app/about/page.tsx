import Image from "next/image";

const AboutPage = () => {
  return (
    <>
      <Image
        src="logo.svg"
        width={128}
        height={128}
        alt="logo"
        priority
        className="absolute left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 transform animate-float"
      />
      <div className="fixed bottom-0 w-full pb-6">
        <h1 className="text-center text-4xl font-bold">
          Grocery List
          <span className="ml-2 text-base text-gray-400">2.0</span>
        </h1>
      </div>
    </>
  );
};

export default AboutPage;
