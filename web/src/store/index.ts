/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { configureStore } from '@reduxjs/toolkit';
import roomSlice, { RoomState } from './slices/room';
import deviceSlice, { DeviceState } from './slices/device';

export interface RootState {
  room: RoomState;
  device: DeviceState;
}

const store = configureStore({
  reducer: {
    room: roomSlice,
    device: deviceSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
