import React, { useState, useEffect } from 'react';
import * as Api from '../../utils/api';
import './fib.css';

interface KeyValuePair {
  key: string;
  value: number;
}

const Fib: React.FC = () => {
  const [searchedIndexes, setSearchedIndexes] = useState<number[]>([]);
  const [searchedKeyValues, setSearchedKeyValues] = useState<KeyValuePair[]>(
    []
  );
  const [index, setIndex] = useState('');
  const [flag, setFlag] = useState(0);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { data } = await Api.post('/api/values', { index: parseInt(index) });
    console.log(data);

    setIndex('');
    setFlag(flag + 1);
  };

  useEffect(() => {
    async function fetchIndexes() {
      const { data }: { data: number[] } = await Api.get('/api/indexes');

      setSearchedIndexes(data);
    }

    async function fetchKeyValues() {
      const { data }: { data: KeyValuePair[] } = await Api.get('/api/values');

      setSearchedKeyValues(data);
    }

    fetchIndexes();
    fetchKeyValues();
  }, [flag]);

  return (
    <div>
      <form>
        <label>Enter your index: </label>
        <input value={index} onChange={(e) => setIndex(e.target.value)} />
        <button onClick={onClick}>Submit</button>
      </form>

      <h3>Indexes you have seen: </h3>
      <p>{searchedIndexes.map((number) => number).join(', ')}</p>

      <h3>Caculated Values: </h3>
      {searchedKeyValues.map(({ key, value }) => (
        <div key={key}>
          For index {key} the fibonacci number is {value}
        </div>
      ))}
    </div>
  );
};

export default Fib;
