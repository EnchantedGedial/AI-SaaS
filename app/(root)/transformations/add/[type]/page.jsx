import Header from '../../../../../components/shared/Header';
import TransformationForm from '../../../../../components/shared/TransformationForm';

import { transformationTypes } from '../../../../../constants/index';

import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }) => {
  
  const transformation = transformationTypes[type];

  

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
    <TransformationForm/>
    </>
  );
};

export default AddTransformationTypePage;
