//src/components/SearchBarExpand.jsx
    //handles user input, debounce, navigation, and keeping the URL ?q=parameter in sync 
    //navigation logic, navigate('/?=...')
    //THIS IS THE CONDENSED/EXPANDING SEARCHBAR


import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
// npm install @fortawesome/fontawesome-free

function SearchBarExpand() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  //sync input with URL (search query parameter) /search?q=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
  }, [location.search]);

  //debounced navigation (pseudo autocomplete)
  useEffect(() => {
    if (!query.trim()) return;

    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      const currentQ = params.get('q') || '';
      if (currentQ !== query.trim()) {
        navigate(`/?q=${encodeURIComponent(query.trim())}`);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, navigate, location.search]);

  const handleSearch = () => {
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  //HOVER & TEXT INPUT
    //allow text entry if hover expand is activated
    //no longer reqd to click in input box
    //hover and start typing, fills in chars
  const handleMouseEnter = () => {
      setFocused(true);
      inputRef.current?.focus(); //focus input on hover
    };

    const handleMouseLeave = () => {
      setFocused(false);
    };




//RETURN (HOVER & EXPANDING SEARCH BAR) aka visual component to generic search bar (SearchBar.jsx vs SearchBarExpand.jsx  )
  return (
    <header className="sticky top-0 z-50 flex justify-center p-4 xbg-gray-900 shadow-md">
      <div
        className={`relative flex items-center bg-white transition-all duration-300 overflow-hidden
          ${focused ? 'w-full max-w-3xl rounded-full px-4 py-2' : 'w-24 h-24 rounded-full'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Input - only visible when focused */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          onFocus={() => setFocused(true)}
          placeholder="Search..."
          className={`flex-1 bg-white text-black text-7xl outline-none rounded-l-full placeholder-gray-400 px-6 h-24 text-4xl transition-all duration-300
            ${focused ? 'opacity-100 w-full' : 'opacity-0 w-0 absolute'}
          `}
        />

        {/* Search button / magnifying glass */}
        <button
          onClick={handleSearch}
          className={`flex items-center justify-center text-black bg-white focus:outline-none transition-all duration-300
            ${focused ? 'h-24 px-6 rounded-r-full ml-2' : 'h-24 w-24 rounded-full'}
          `}
          aria-label="Search"
        >
          <i className="fa fa-search text-6xl"></i>
        </button>
      </div>
    </header>
  );
}

export default SearchBarExpand;

/*
    <header className="sticky top-0 z-50 xbg-gray-900 p-4 flex justify-center shadow-md">
      <div
        ref={containerRef}
        className={`relative flex items-center bg-white rounded-full transition-all duration-300 ${
          focused ? 'w-full max-w-lg px-4 py-2' : 'w-12 px-2 py-2'
        }`}
        onMouseEnter={() => setFocused(true)}
        onMouseLeave={() => setFocused(false)}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          onFocus={() => setFocused(true)}
          placeholder="Search for movies..."
          className={`bg-transparent outline-none text-black placeholder-gray-400 transition-opacity duration-300 ${
            focused ? 'ml-2 w-full opacity-100' : 'w-0 opacity-0'
          }`}
        />

         Magnifying glass / search button 
        <button
          onClick={handleSearch}
          className="flex items-center justify-center text-black focus:outline-none ml-2 bg-white rounded-full p-3"
          aria-label="Search"
        >
          <i className="fa fa-search text-6xl"></i>
        </button>
      </div>
    </header>

    HALF PILL VERSION
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
      onFocus={() => setFocused(true)}
      placeholder="Search for movies..."
      className={`flex-1 bg-white text-black outline-none rounded-l-full placeholder-gray-400 px-6 h-24 text-2xl transition-all duration-300 ${
        focused ? 'opacity-100 w-full' : 'opacity-0 w-0'
      }`}
    />

     Search button on the right
    <button
      onClick={handleSearch}
      className="flex items-center justify-center text-black bg-white rounded-r-full h-24 px-6 focus:outline-none"
      aria-label="Search"
    >
      <i className="fa fa-search text-6xl"></i>
    </button>
    */