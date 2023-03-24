import React from 'react';
import ReactLoading from 'react-loading';


export const Loader: React.FC = () => {
  return (
    <ReactLoading type='spin' color='white' width={20} height={20}/>
  );
}