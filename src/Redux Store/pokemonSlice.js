import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  comparison: {
    slots: [null, null, null, null],
    activeComparisons: 2
  }
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const emptySlot = state.comparison.slots.findIndex(slot => !slot);
      if (emptySlot !== -1) {
        state.comparison.slots[emptySlot] = action.payload;
      }
    },
    removeFromComparison: (state, action) => {
      state.comparison.slots[action.payload] = null;
    },
    setActiveComparisons: (state, action) => {
      state.comparison.activeComparisons = action.payload;
    }
  }
});

export const { addToComparison, removeFromComparison, setActiveComparisons } = pokemonSlice.actions;
export default pokemonSlice.reducer;