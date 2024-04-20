const X = () => {
    return (
      <div className="size-24 md:size-36 relative flex justify-center items-center"> {/* Añade clases para centrar el contenido */}
        <div className="absolute w-full h-4 md:h-7 bg-[#cdcbcd] transform rotate-45"></div>
        <div className="absolute w-full h-4 md:h-7 bg-[#edebed] transform -rotate-45"></div>
      </div>
    );
  };
  
  export default X;
  