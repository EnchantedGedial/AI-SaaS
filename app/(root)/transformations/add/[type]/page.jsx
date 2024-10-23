import { auth } from '@clerk/nextjs';
import Header from '../../../../../components/shared/Header';
import TransformationForm from '../../../../../components/shared/TransformationForm';

import { transformationTypes } from '../../../../../constants/index';
import{getUserById} from '../../../../../lib/actions/user.action'


import { redirect } from 'next/navigation';

const AddTransformationTypePage = async ({ params: { type } }) => {
  const {userId} =auth();
  if(!userId) redirect('/sign-in')
  const user_in_db= await getUserById(userId)
  const transformation = transformationTypes[type];

  

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

      <section className='mt-10'>

    
    <TransformationForm
    action="Add"
    userId={user_in_db._id}
    type={transformation.type}
    creditBalance={user_in_db.creditBalance}
    />
    </section>
    </>
  );
};

export default AddTransformationTypePage;
