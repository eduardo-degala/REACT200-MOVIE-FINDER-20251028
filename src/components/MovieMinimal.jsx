//src/components/MovieMinimal.jsx

import AnimatedTitle from './AnimatedTitle';
import SearchBarExpand from "./SearchBarExpand"; 

//ORIGINAL minimal page w/only title & search field
function MovieMinimal() {

//RETURN (MINIMAL PAGE)
return (

    <div className="min-h-screen bg-black text-white p-6">
    <AnimatedTitle
    containerClassName="flex-shrink-0 p-0 mb-20 h-auto z-20"
    className="text-5xl sm:text-5xl md:text-7xl lg:text-9xl text-center text-white"
    />

    <SearchBarExpand />
    </div>

);
}

//EXPORT
export default MovieMinimal;

/*
PURPOSE, minimal page due to overexpansion of project, this 
is the original page view/intent before animation explosion
*/