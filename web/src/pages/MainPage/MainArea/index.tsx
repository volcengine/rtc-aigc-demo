/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useSelector } from 'react-redux';
import Antechamber from './Antechamber';
import Room from './Room';

function MainArea() {
  const room = useSelector((state: any) => state.room);
  const isJoined = room.isJoined;
  return isJoined ? <Room /> : <Antechamber />;
}

export default MainArea;
