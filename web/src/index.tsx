import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Fib from './components/fib';
import OtherPage from './components/other-page';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '3rem',
      fontSize: '2rem',
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Fib />} />
        <Route path="/other" element={<OtherPage />} />
      </Routes>
    </BrowserRouter>
  </div>
);
