//src/App.jsx

import { Routes, Route } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import AnimatedTitle from './components/AnimatedTitle';
import AnimatedSplitScreen from "./components/AnimatedSplitScreen";

console.log('App.jsx API Key:', 'API_KEY debugger unquote for validation');
console.log('App.jsx loaded')

//APP
function App() {
   return (

    <>
{/* TOP BAR, AnimatedTitle - SearchBar */}
<div className="fixed top-0 left-0 w-full flex items-center bg-black px-4 py-4 gap-4 mb-0 overflow-visible z-50">

  <AnimatedTitle
    containerClassName="flex-shrink-0 p-0 mb-1 h-auto z-20"
    className="text-xl text-left text-white"
  />
  <div className="flex-grow">
    <SearchBar containerClassName="bg-black" />
  </div>
</div>
    

      {/* Routes */}
      <Routes>
        <Route path="/*" element={<AnimatedSplitScreen />} />
      </Routes>


    </>
  );
}



export default App;

//END
