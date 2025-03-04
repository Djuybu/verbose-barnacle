import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FruitCarsouel } from '../type/fruitCarsouel.type'

interface FruitCarsouelState {
  carsouelList: FruitCarsouel[]
}

const initialState: FruitCarsouelState = {
  carsouelList: []
}

const FruitCarsouelSlice = createSlice({
  name: 'FruitCarsouel',
  initialState,
  reducers: {
    addCarsouelToList: (state, action: PayloadAction<FruitCarsouel>) => {
        state.carsouelList.push(action.payload)
    }

  }
})

const FruitCarsouelReducer = FruitCarsouelSlice.reducer
export const { addCarsouelToList } = FruitCarsouelSlice.actions
export default FruitCarsouelReducer
