import React from 'react';

// reactstrap components
import { Spinner } from 'reactstrap';

// core components

export default function PageChange(props) {
  const handleCancel = () => {
    try {
      window.dispatchEvent(new Event('clearPageTransition'));
    } catch (_e) {}
  };

  return (
    <div>
      <div className='page-transition-wrapper-div'>
        <div className='page-transition-icon-wrapper mb-3'>
          <Spinner
            color='light'
            style={{ width: '6rem', height: '6rem', borderWidth: '.3rem' }}
          />
        </div>
        <h4 className='title text-white mb-3'>
          Loading page contents for: {props.path}
        </h4>
        <button
          onClick={handleCancel}
          className='btn btn-sm btn-light'
          style={{ opacity: 0.9 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
