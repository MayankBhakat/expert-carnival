import React from 'react'
import Header from './_components/Header'

//To render all the routes inside the dashboard we have to pass the children
function DashboardLayout({children}) {
  return (
    <div>
        <Header/>
        <div className='mx-5 md:mx-20 lg:mx-36'>
        {children}
        </div>
       
    </div>
  )
}

export default DashboardLayout