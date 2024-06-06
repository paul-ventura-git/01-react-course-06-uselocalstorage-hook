import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.error(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function
    // This ensures we're always storing a string
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            console.log(storedValue);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error(error);
        }
    };

    useEffect(() => {
        setValue(storedValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, storedValue]);

    return [storedValue, setValue];
}

// Example usage of the hook in a component
function App() {
    const [name, setName] = useLocalStorage('name', 'Alice');

    function handlerCloseSession () {
      localStorage.clear();
      console.log("Session's been cleared.")
    }
    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
              type="submit"
              onClick={handlerCloseSession}
            >
              Clear
            </button>
        </div>
    );
}

export default App;