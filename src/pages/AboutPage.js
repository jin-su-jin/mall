import React from 'react';
import BasicLayout from '../layouts/BasicLayout';
import useCustomLogin from '../hooks/useCustomLogin';

function AboutPage(props){

    const {isLogin , moveToLoginReturn} = useCustomLogin();

    if (!isLogin){
        return moveToLoginReturn();
    }
    return (
        <BasicLayout>
            <div className={'text-3xl'}>
                <div>About Page</div>
            </div>
        </BasicLayout>
        
    )
}

export default AboutPage;