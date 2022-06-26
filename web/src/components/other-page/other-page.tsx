import './other-page.css';
import { Link } from 'react-router-dom';

const OtherPage: React.FC = () => {
  return (
    <div>
      <h1>Other Page</h1>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

export default OtherPage;
