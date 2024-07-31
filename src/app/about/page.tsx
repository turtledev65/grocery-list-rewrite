const AboutPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-gray-400 p-20 text-white motion-safe:animate-float">
        Logo
      </div>
      <div className="absolute bottom-0 w-full pb-6">
        <h1 className="text-center text-4xl font-bold">
          Grocery List
          <span className="text-base text-gray-400 ml-2">
            2.0
          </span>
        </h1>
      </div>
    </div>
  );
};

export default AboutPage;
