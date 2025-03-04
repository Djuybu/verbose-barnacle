import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useGetCarsouelsQuery } from './store/fruitCarsouel.service'


function App() {
  const {data, isFetching} = useGetCarsouelsQuery({limit: 5})
  console.log(data);

  return(<>
    <div>Hello</div>
    {!isFetching && data != undefined &&(
      <div>{data[0].tag.name}</div>
    )}
  </>)
}

export default App
