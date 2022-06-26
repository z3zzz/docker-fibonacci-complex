import './other-page.css';
import { Link } from 'react-router-dom';

const OtherPage: React.FC = () => {
  return (
    <div className="other-columns">
      <div className="other-column-link">
        <Link to="/">Go back to home</Link>
      </div>
      <div className="other-column-main">
        <h1>Other Page</h1>
      </div>
    </div>
  );
};

export default OtherPage;
