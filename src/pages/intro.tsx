import React from "react"

const Intro: React.FC = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h1 className='text-4xl font-bold'>Welcome!</h1>
            <p className='text-xl mt-4'>
                저는 [사용자 이름]입니다. 프로젝트에 오신 것을 환영합니다!
            </p>
        </div>
    )
}

export default Intro
