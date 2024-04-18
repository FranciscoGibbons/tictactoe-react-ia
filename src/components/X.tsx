const X = () => {
    return (
      <div className="size-20 relative flex justify-center items-center"> {/* Añade clases para centrar el contenido */}
        <div className="absolute w-full h-5 bg-[#cdcbcd] transform rotate-45"></div>
        <div className="absolute w-full h-5 bg-[#edebed] transform -rotate-45"></div>
      </div>
    );
  };
  
  export default X;
  