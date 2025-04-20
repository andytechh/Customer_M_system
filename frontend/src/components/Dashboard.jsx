import React from 'react'

const Dashboard = () => {
  return (
    <>
  <div className='flex flex-row gap-5'>
    <div className='flex flex-col gap-5'>
      <div className="flex gap-[20px] flex-wrap ">
      <div className='rouded-3xl p-5 bg-gray-300'>1</div>
      <div className='rouded-3xl p-5  bg-gray-300'>2</div>
    </div>
    <div className="flex gap-[20px] flex-wrap ">
      <div className='rouded-3xl p-5  bg-gray-300'>1</div>
      <div className='rouded-3xl p-5  bg-gray-300'>2</div>
    </div>
  </div>
  <div className="flex gap-[20px] flex-wrap ">
  <div className='rouded-3xl p-5 grow  bg-gray-300'>2</div>
  </div>
    </div>
   
 </>
   
  )
}

export default Dashboard
