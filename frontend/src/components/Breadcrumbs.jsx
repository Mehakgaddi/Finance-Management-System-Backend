import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname
    .split('/')
    .filter((x) => x);

  return (
    <div
      style={{
        padding: '10px 20px',
        background: '#f0f0f0',
        marginBottom: '20px',
      }}
    >
      <Link to="/">Home</Link>

      {pathnames.map((value, index) => {
        const to =
          '/' + pathnames.slice(0, index + 1).join('/');

        return (
          <span key={to}>
            {' / '}
            <Link to={to}>{value}</Link>
          </span>
        );
      })}
    </div>
  );
}

export default Breadcrumbs;