//src/components/SearchBar.jsx
    //handles user input, debounce, navigation, and keeping the URL ?q=parameter in sync 
    //navigation logic, navigate('/?=...')

import { useState, useEffect } from 'react'; //useState React hook create/manage state inside functional component, useEffect React hook to run side effects (fetch API data, update URL, set timers)
import { useNavigate, useLocation } from 'react-router-dom'; //useNavigate to URLs and routes, useLocation location obj URL info query parameters

function SearchBar() {
  const [query, setQuery] = useState('');   //current text input value, starts empty string and updates new value
  const navigate = useNavigate();           //stores nav function, changes URL
  const location = useLocation();           //location pathname/search, syncing input with URL

  //keep local query in sync when user manually changes URL or presses Home
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setQuery(q);
  }, [location.search]);

  //debounced navigation effect, re-submits per each character entry
    //pseudo autofill, enables "search-as-you-type" without firing a request on every keystroke
    //whenever the query changes, wait 400ms before updating URL.
  useEffect(() => {
    if (!query.trim()) return; //trim, skip empty strings

    const delayDebounce = setTimeout(() => {
      //only navigate if URL query is different (avoid infinite loop)
      const params = new URLSearchParams(location.search);
      const currentQ = params.get('q') || '';
      if (currentQ !== query.trim()) {
        navigate(`/?q=${encodeURIComponent(query.trim())}`);
      }
    }, 400); //400=debounce delay (300–500ms is typical)

    //cleanup: if user keeps typing, cancel the previous timeout
    return () => clearTimeout(delayDebounce);
  }, [query, navigate, location.search]);

  //manual search trigger 
    //aka pressing Enter (onKeyDown) or clicking Search (onClick)
    //negated w/onChange and debounce effect
  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  //reset back to homepage (clear query + URL)
  const handleReset = () => {
    setQuery('');
    navigate('/');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: '#111',
        color: '#fff',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // triggers debounce effect
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch(); // instant search on Enter
        }}
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #444',
          background: '#222',
          color: '#fff',
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          background: '#4CAF50',
          border: 'none',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Search
      </button>
      <button
        onClick={handleReset}
        style={{
          background: '#f44336',
          border: 'none',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Home
      </button>
    </header>
  );
}

export default SearchBar;