
export default function AuthInput({ label, error, type = "text", placeholder, ...props }) { 
    return ( 
        <div> 
            <label className=" block mb-3 text-sm font-medium text-[#6F6866] " > {label} </label> 
            <input type={type} placeholder={placeholder} className={` w-full rounded-2xl border bg-white/60 px-5 py-4 text-[#38302E] outline-none transition focus:ring-2 focus:ring-[#9CAEA9]/20 ${error ? "border-red-500" : "border-[#788585]/30 focus:border-[#9CAEA9]" } `} {...props} /> 
            {error && ( 
                <p className="mt-2 text-sm text-red-500"> {error} </p> 
            )} 
        </div> );
}