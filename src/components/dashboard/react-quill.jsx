import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

export function ReactQuillForm(props) {
    let {theme, value, onChange} = props;

  return <ReactQuill theme={theme} value={value} onChange={onChange} >
  </ReactQuill>;
}

ReactQuillForm.propTypes = {
    theme: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

